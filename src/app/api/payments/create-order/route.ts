import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createServer } from '@/lib/supabase/server';
import { createRazorpayOrder } from '@/lib/services/razorpay';
import { calculateRazorpayChargeInPaise } from '@/lib/utils/razorpay';
import { verifyTeamMembership } from '../auth';
import {
  OFFER_EVENT_IDS,
  OFFER_PER_EVENT,
  getOtherOfferEvent,
} from '@/lib/constants/avengersOffer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamId, eventId, offerOptIn } = body;

    if (!teamId || !eventId) {
      return NextResponse.json(
        { error: 'teamId and eventId are required' },
        { status: 400 }
      );
    }

    // Create Supabase client for auth (needs cookies to get current user)
    const supabase = await createServer();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log(
        '[create-order] User not authenticated:',
        authError?.message || 'No user found'
      );
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(
      '[create-order] Details:',
      user.id,
      user.email,
      teamId,
      eventId
    );

    // Verify team exists.
    const { data: team, error: teamError } = await supabaseAdmin
      .from('teams')
      .select('team_id, team_name, team_lead_id, event_id')
      .eq('team_id', teamId)
      .single();

    if (teamError || !team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const isAuthorizedTeamMember = await verifyTeamMembership(
      teamId,
      user.id,
      user.email,
      team.team_lead_id
    );

    if (!isAuthorizedTeamMember) {
      return NextResponse.json(
        { error: 'You are not authorized to pay for this team' },
        { status: 403 }
      );
    }

    if (team.event_id !== eventId) {
      return NextResponse.json(
        { error: 'Team does not belong to this event' },
        { status: 400 }
      );
    }

    // Get event details and registration fee
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('id, name, registration_fees')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (!event.registration_fees || event.registration_fees <= 0) {
      return NextResponse.json(
        { error: 'Event has no registration fee' },
        { status: 400 }
      );
    }

    let finalRegistrationFee = event.registration_fees;

    // ── Avengers Initiative offer pricing ────────────────────────────
    if (OFFER_EVENT_IDS.includes(eventId)) {
      const otherEventId = getOtherOfferEvent(eventId);

      // Check if user already has a verified registration for the other offer event
      const { data: otherTeam } = await supabaseAdmin
        .from('teams')
        .select('team_id, transaction_verified')
        .eq('event_id', otherEventId)
        .eq('team_lead_id', user.id)
        .not('transaction_verified', 'is', null)
        .maybeSingle();

      if (otherTeam) {
        // Check if they paid full price for the other event
        const { data: otherPayment } = await supabaseAdmin
          .from('payments')
          .select('amount')
          .eq('team_id', otherTeam.team_id)
          .eq('status', 'paid')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // amount is stored in paise; ₹50 = 5000+ paise (with gateway fee)
        const paidFullPrice = otherPayment && otherPayment.amount >= 5000;

        if (paidFullPrice) {
          // Early registrant who paid full price → this event is FREE
          finalRegistrationFee = 0;
        } else {
          // Other event was paid at offer price → this event also at offer price
          finalRegistrationFee = OFFER_PER_EVENT;
        }
      } else if (offerOptIn === true) {
        // User explicitly opted into the offer
        finalRegistrationFee = OFFER_PER_EVENT; // ₹25
      }

      console.log(
        `[Avengers Offer] eventId=${eventId} offerOptIn=${offerOptIn} fee=₹${finalRegistrationFee}`
      );

      // Free registration — skip Razorpay entirely
      if (finalRegistrationFee === 0) {
        // Mark team as verified
        await supabaseAdmin
          .from('teams')
          .update({ transaction_verified: new Date().toISOString() })
          .eq('team_id', teamId);

        // Create a payment record for bookkeeping
        await supabaseAdmin.from('payments').insert({
          user_id: user.id,
          event_id: eventId,
          team_id: teamId,
          razorpay_order_id: `free_offer_${teamId}`,
          amount: 0,
          currency: 'INR',
          status: 'paid',
          verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        return NextResponse.json({
          free: true,
          teamId,
          eventName: event.name,
        });
      }
    }

    // ── Anime Fiesta pricing calculation ─────────────────────────────
    const ANIME_FIESTA_EVENT_ID = 'fccf6fad-0e49-4a5c-a971-3ab874dc923a';
    if (eventId === ANIME_FIESTA_EVENT_ID) {
      const { count: memberCount, error: participantsError } =
        await supabaseAdmin
          .from('participants')
          .select('*', { count: 'exact', head: true })
          .eq('team_id', teamId);

      if (participantsError) {
        console.error('Error fetching participants count:', participantsError);
        return NextResponse.json(
          { error: 'Failed to fetch team member count' },
          { status: 500 }
        );
      }

      const teamSize = memberCount ?? 1;
      const baseFee = event.registration_fees;

      // Pricing formula (max team size: 4):
      // x = 1: fee = y
      // x = 2: fee = 2y
      // x = 3: fee = 3y - y/3
      // x = 4: fee = 4y - 2y/3
      switch (teamSize) {
        case 1:
          finalRegistrationFee = baseFee;
          break;
        case 2:
          finalRegistrationFee = 2 * baseFee;
          break;
        case 3:
          finalRegistrationFee = Math.round(3 * baseFee - baseFee / 3);
          break;
        case 4:
          finalRegistrationFee = Math.round(4 * baseFee - (2 * baseFee) / 3);
          break;
      }

      console.log(
        `[create-order] Anime Fiesta pricing: teamSize=${teamSize}, baseFee=${baseFee}, finalFee=${finalRegistrationFee}`
      );
    }

    // Check if there's already a pending/paid payment for this team
    const { data: existingPayment } = await supabaseAdmin
      .from('payments')
      .select('id, status, razorpay_order_id')
      .eq('team_id', teamId)
      .in('status', ['pending', 'paid'])
      .single();

    if (existingPayment?.status === 'paid') {
      return NextResponse.json(
        { error: 'Payment already completed for this team' },
        { status: 400 }
      );
    }
    // Create Razorpay order with adjusted amount (includes payment gateway charges)
    const razorpayOrder = await createRazorpayOrder({
      amount: calculateRazorpayChargeInPaise(finalRegistrationFee), // Convert to paise and adjust for fees
      eventId,
      userId: user.id,
      teamId,
      eventName: event.name,
    });

    console.log('Razorpay order created successfully');

    // Upsert payment record
    const paymentData = {
      user_id: user.id,
      event_id: eventId,
      team_id: teamId,
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: 'INR',
      status: 'pending',
      updated_at: new Date().toISOString(),
    };

    let insertError;
    if (existingPayment) {
      // Update existing pending payment with new order
      const { error } = await supabaseAdmin
        .from('payments')
        .update(paymentData)
        .eq('id', existingPayment.id);
      insertError = error;
    } else {
      // Create new payment record
      const { error } = await supabaseAdmin
        .from('payments')
        .insert(paymentData);
      insertError = error;
    }

    if (insertError) {
      console.error('Error inserting payment:', insertError);
      return NextResponse.json(
        {
          error: 'Failed to save payment record',
          details: insertError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      teamName: team.team_name,
      eventName: event.name,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create order', details: errorMessage },
      { status: 500 }
    );
  }
}

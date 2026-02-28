import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createServer } from '@/lib/supabase/server';
import { createRazorpayOrder } from '@/lib/services/razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamId, eventId } = body;

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

    // Verify team exists and belongs to this user
    const { data: team, error: teamError } = await supabaseAdmin
      .from('teams')
      .select('team_id, team_name, team_lead_id, event_id')
      .eq('team_id', teamId)
      .single();

    if (teamError || !team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    if (team.team_lead_id !== user.id) {
      return NextResponse.json(
        { error: 'You are not authorized to pay for this team' },
        { status: 403 }
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

    // Anime Fiesta pricing calculation
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
    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder({
      amount: finalRegistrationFee,
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
      amount: finalRegistrationFee * 100, // Store in paise
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

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createServer } from '@/lib/supabase/server';
import {
  OFFER_EVENT_IDS,
  getOtherOfferEvent,
} from '@/lib/constants/avengersOffer';

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

    // 1. Authenticate user
    const supabase = await createServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. eventId must be an offer event
    if (!OFFER_EVENT_IDS.includes(eventId)) {
      return NextResponse.json(
        { error: 'Event is not eligible for free offer registration' },
        { status: 403 }
      );
    }

    // 3. Verify team belongs to this user and event
    const { data: team, error: teamError } = await supabaseAdmin
      .from('teams')
      .select('team_id, team_lead_id, event_id, transaction_verified')
      .eq('team_id', teamId)
      .single();

    if (teamError || !team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    if (team.team_lead_id !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized for this team' },
        { status: 403 }
      );
    }

    if (team.event_id !== eventId) {
      return NextResponse.json(
        { error: 'Team does not belong to this event' },
        { status: 400 }
      );
    }

    // Already registered — no-op
    if (team.transaction_verified) {
      return NextResponse.json({ success: true, alreadyVerified: true });
    }

    // 4. Other offer event must have a verified registration with full price
    const otherEventId = getOtherOfferEvent(eventId);

    const { data: otherTeam } = await supabaseAdmin
      .from('teams')
      .select('team_id, transaction_verified')
      .eq('event_id', otherEventId)
      .eq('team_lead_id', user.id)
      .not('transaction_verified', 'is', null)
      .maybeSingle();

    if (!otherTeam) {
      return NextResponse.json(
        { error: 'Other offer event not registered or not verified' },
        { status: 403 }
      );
    }

    // Check payment amount for the other event
    const { data: otherPayment } = await supabaseAdmin
      .from('payments')
      .select('amount')
      .eq('team_id', otherTeam.team_id)
      .eq('status', 'paid')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // amount is in paise; ₹50 = 5000+ paise (with gateway fee)
    const paidFullPrice = otherPayment && otherPayment.amount >= 5000;

    if (!paidFullPrice) {
      return NextResponse.json(
        { error: 'Other event was not paid at full price' },
        { status: 403 }
      );
    }

    // 5. All checks passed — mark as free verified registration
    const now = new Date().toISOString();

    await supabaseAdmin
      .from('teams')
      .update({ transaction_verified: now })
      .eq('team_id', teamId);

    // Create bookkeeping payment record
    await supabaseAdmin.from('payments').insert({
      user_id: user.id,
      event_id: eventId,
      team_id: teamId,
      razorpay_order_id: `free_offer_${teamId}`,
      amount: 0,
      currency: 'INR',
      status: 'paid',
      verified_at: now,
      updated_at: now,
    });

    console.log(
      `[mark-free] Free offer registration: userId=${user.id} eventId=${eventId} teamId=${teamId}`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[mark-free] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

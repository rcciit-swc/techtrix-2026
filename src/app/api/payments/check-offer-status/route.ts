import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createServer } from '@/lib/supabase/server';
import {
  OFFER_EVENT_IDS,
  getOtherOfferEvent,
} from '@/lib/constants/avengersOffer';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { error: 'eventId is required' },
        { status: 400 }
      );
    }

    if (!OFFER_EVENT_IDS.includes(eventId)) {
      return NextResponse.json({
        otherRegistered: false,
        paidFullPrice: false,
      });
    }

    const supabase = await createServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const otherEventId = getOtherOfferEvent(eventId);

    // Check if user has a verified registration for the other offer event
    const { data: otherTeam } = await supabaseAdmin
      .from('teams')
      .select('team_id, transaction_verified')
      .eq('event_id', otherEventId)
      .eq('team_lead_id', user.id)
      .not('transaction_verified', 'is', null)
      .maybeSingle();

    if (!otherTeam) {
      return NextResponse.json({
        otherRegistered: false,
        paidFullPrice: false,
      });
    }

    // Check the payment amount for the other event
    const { data: otherPayment } = await supabaseAdmin
      .from('payments')
      .select('amount')
      .eq('team_id', otherTeam.team_id)
      .eq('status', 'paid')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // amount is in paise; ₹50 = 5000+ paise (with gateway fee)
    const paidFullPrice = !!(otherPayment && otherPayment.amount >= 5000);

    return NextResponse.json({
      otherRegistered: true,
      paidFullPrice,
    });
  } catch (error) {
    console.error('[check-offer-status] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

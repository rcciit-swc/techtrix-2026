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

    // Get the current user
    console.log('[create-order] Getting user from auth...');

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log('[create-order] Auth result:', {
      user: user?.id,
      authError: authError?.message,
    });

    if (authError || !user) {
      console.log(
        '[create-order] User not authenticated:',
        authError?.message || 'No user found'
      );
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[create-order] User authenticated:', user.id, user.email);

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
    console.log('ALL verification done we now crrrrreaaate ordedr ');
    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder({
      amount: event.registration_fees,
      eventId,
      userId: user.id,
      teamId,
      eventName: event.name,
    });

    // Upsert payment record
    const paymentData = {
      user_id: user.id,
      event_id: eventId,
      team_id: teamId,
      razorpay_order_id: razorpayOrder.id,
      amount: event.registration_fees * 100, // Store in paise
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

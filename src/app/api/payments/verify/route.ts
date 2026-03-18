import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createServer } from '@/lib/supabase/server';
import { verifyPaymentSignature } from '@/lib/services/razorpay';
import { verifyTeamMembership } from '../auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment fields' },
        { status: 400 }
      );
    }

    // Verify the payment signature
    const isValidSignature = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }
    console.log('Signature verified successfully');
    // Create Supabase client for auth
    const supabase = await createServer();

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the payment record
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('razorpay_order_id', razorpay_order_id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      );
    }

    // Verify the payment belongs to this user or another member of the same team.
    let isAuthorizedPayer = payment.user_id === user.id;

    if (!isAuthorizedPayer && payment.team_id) {
      isAuthorizedPayer = await verifyTeamMembership(
        payment.team_id,
        user.id,
        user.email
      );
    }

    if (!isAuthorizedPayer) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update payment status
    const { error: updatePaymentError } = await supabaseAdmin
      .from('payments')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: 'paid',
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.id);

    if (updatePaymentError) {
      console.error('Error updating payment:', updatePaymentError);
      return NextResponse.json(
        { error: 'Failed to update payment status' },
        { status: 500 }
      );
    }

    // Update team's transaction_verified status
    if (payment.team_id) {
      const { error: updateTeamError } = await supabaseAdmin
        .from('teams')
        .update({
          transaction_id: payment.id,
          transaction_verified: new Date().toISOString(),
          payment_mode: 'RAZORPAY',
        })
        .eq('team_id', payment.team_id);

      if (updateTeamError) {
        console.error('Error updating team:', updateTeamError);
        // Continue anyway, webhook will retry
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      teamId: payment.team_id,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}

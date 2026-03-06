import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      token,
      referral_code,
      community_name,
      community_image,
      community_email,
    } = body;

    if (!token || !referral_code || !community_name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token, referral code, and community name are required',
        },
        { status: 400 }
      );
    }

    // Validate referral code format (alphanumeric, hyphens, underscores, 3-30 chars)
    const referralCodeRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    if (!referralCodeRegex.test(referral_code)) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Referral code must be 3-30 characters and contain only letters, numbers, hyphens, and underscores',
        },
        { status: 400 }
      );
    }

    // Verify the token
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('community_partner_invitations')
      .select('id, email, community_name, fest_id, status, expires_at')
      .eq('token', token)
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json(
        { success: false, error: 'Invalid invitation token' },
        { status: 404 }
      );
    }

    if (invitation.status === 'revoked') {
      return NextResponse.json(
        { success: false, error: 'This invitation has been revoked' },
        { status: 410 }
      );
    }

    if (invitation.status === 'accepted') {
      return NextResponse.json(
        { success: false, error: 'This invitation has already been accepted' },
        { status: 410 }
      );
    }

    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'This invitation has expired' },
        { status: 410 }
      );
    }

    // Check referral code uniqueness
    const { data: existingPartner } = await supabaseAdmin
      .from('community_partners')
      .select('referral_code')
      .eq('referral_code', referral_code)
      .single();

    if (existingPartner) {
      return NextResponse.json(
        {
          success: false,
          error:
            'This referral code is already taken. Please choose a different one.',
        },
        { status: 409 }
      );
    }

    // Insert into community_partners
    const { error: insertError } = await supabaseAdmin
      .from('community_partners')
      .insert({
        referral_code,
        community_name,
        community_image: community_image || null,
        community_email: community_email || invitation.email,
        fest_id: invitation.fest_id,
      });

    if (insertError) {
      console.error('Error inserting community partner:', insertError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create community partner. Please try again.',
        },
        { status: 500 }
      );
    }

    // Update invitation status to accepted
    const { error: updateError } = await supabaseAdmin
      .from('community_partner_invitations')
      .update({ status: 'accepted' })
      .eq('id', invitation.id);

    if (updateError) {
      console.error('Error updating invitation status:', updateError);
      // Partner was created, so we don't fail the whole operation
    }

    return NextResponse.json({
      success: true,
      message:
        'Welcome aboard! Your community partnership has been set up successfully.',
      referral_code,
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process invitation' },
      { status: 500 }
    );
  }
}

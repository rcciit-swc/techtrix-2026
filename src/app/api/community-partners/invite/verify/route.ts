import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    const { data: invitation, error } = await supabaseAdmin
      .from('community_partner_invitations')
      .select('id, email, community_name, fest_id, status, expires_at')
      .eq('token', token)
      .single();

    if (error || !invitation) {
      return NextResponse.json(
        { valid: false, error: 'Invalid invitation token' },
        { status: 404 }
      );
    }

    if (invitation.status === 'revoked') {
      return NextResponse.json(
        { valid: false, error: 'This invitation has been revoked' },
        { status: 410 }
      );
    }

    if (invitation.status === 'accepted') {
      return NextResponse.json(
        { valid: false, error: 'This invitation has already been accepted' },
        { status: 410 }
      );
    }

    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json(
        { valid: false, error: 'This invitation has expired' },
        { status: 410 }
      );
    }

    return NextResponse.json({
      valid: true,
      email: invitation.email,
      community_name: invitation.community_name,
      fest_id: invitation.fest_id,
    });
  } catch (error) {
    console.error('Error verifying invitation:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to verify invitation' },
      { status: 500 }
    );
  }
}

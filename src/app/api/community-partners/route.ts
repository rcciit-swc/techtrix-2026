import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { referral_code, community_name, community_image, community_email } =
      body;

    if (!referral_code) {
      return NextResponse.json(
        { success: false, error: 'Referral code is required' },
        { status: 400 }
      );
    }

    if (!community_name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Community name is required' },
        { status: 400 }
      );
    }

    // Verify the community partner exists
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('community_partners')
      .select('referral_code')
      .eq('referral_code', referral_code)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: 'Community partner not found' },
        { status: 404 }
      );
    }

    // Update community partner details (referral_code is PK, not editable)
    const { error: updateError } = await supabaseAdmin
      .from('community_partners')
      .update({
        community_name: community_name.trim(),
        community_image: community_image || null,
        community_email: community_email || null,
      })
      .eq('referral_code', referral_code);

    if (updateError) {
      console.error('Error updating community partner:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update community partner' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Community profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating community partner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update community partner' },
      { status: 500 }
    );
  }
}

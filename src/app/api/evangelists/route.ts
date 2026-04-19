import { supabaseAdmin } from '@/lib/supabase/admin';
import { createServer } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  try {
    // Authenticate the request
    const supabase = await createServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { referral_code, name, image, phone, college } = body;

    if (!referral_code) {
      return NextResponse.json(
        { success: false, error: 'Referral code is required' },
        { status: 400 }
      );
    }

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    // Verify the evangelist exists and belongs to the authenticated user
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('evangelists')
      .select('referral_code, email')
      .eq('referral_code', referral_code)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: 'Evangelist not found' },
        { status: 404 }
      );
    }

    // Verify the authenticated user owns this evangelist profile
    if (
      !existing.email ||
      existing.email.toLowerCase() !== user.email?.toLowerCase()
    ) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Update evangelist details (referral_code is PK, not editable)
    const { error: updateError } = await supabaseAdmin
      .from('evangelists')
      .update({
        name: name.trim(),
        image: image || null,
        phone: phone || null,
        college: college || null,
      })
      .eq('referral_code', referral_code);

    if (updateError) {
      console.error('Error updating evangelist:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update evangelist profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Evangelist profile updated successfully',
    });
  } catch (error) {
    console.error('Error updating evangelist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update evangelist profile' },
      { status: 500 }
    );
  }
}

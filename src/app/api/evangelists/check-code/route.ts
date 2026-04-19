import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { available: false, error: 'Code is required' },
      { status: 400 }
    );
  }

  const referralCodeRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  if (!referralCodeRegex.test(code)) {
    return NextResponse.json({ available: false });
  }

  const [{ data: evangelistData }, { data: communityData }] = await Promise.all(
    [
      supabaseAdmin
        .from('evangelists')
        .select('referral_code')
        .eq('referral_code', code)
        .single(),
      supabaseAdmin
        .from('community_partners')
        .select('referral_code')
        .eq('referral_code', code)
        .single(),
    ]
  );

  return NextResponse.json({ available: !evangelistData && !communityData });
}

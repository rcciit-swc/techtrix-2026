import { createServer } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Get the authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Check if user exists in public.users table
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single();

        if (fetchError && fetchError.code === 'PGRST116') {
          // User doesn't exist, create a new user
          const { error: insertError } = await supabase.from('users').insert({
            id: user.id,
            email: user.email,
            name:
              user.user_metadata?.full_name || user.user_metadata?.name || null,
          });

          if (insertError) {
            console.error('Error creating user:', insertError);
          }

          // New user — redirect to onboarding
          const onboardingUrl = `/profile?onboarding=true${next && next !== '/' ? `&next=${encodeURIComponent(next)}` : ''}`;
          return NextResponse.redirect(`${origin}${onboardingUrl}`);
        } else if (fetchError) {
          console.error('Error checking user:', fetchError);
        } else {
          // User exists — check if profile is complete
          const isProfileComplete =
            existingUser?.name &&
            existingUser?.phone &&
            existingUser?.college &&
            existingUser?.gender;

          if (!isProfileComplete) {
            const onboardingUrl = `/profile?onboarding=true${next && next !== '/' ? `&next=${encodeURIComponent(next)}` : ''}`;
            return NextResponse.redirect(`${origin}${onboardingUrl}`);
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

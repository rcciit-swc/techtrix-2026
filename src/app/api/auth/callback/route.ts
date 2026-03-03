import { NextResponse } from 'next/server';

/**
 * Legacy OAuth callback route.
 * Authentication now uses Firebase Auth (redirect flow) which doesn't
 * need a server-side callback. This route is kept as a safe redirect
 * in case any old links or bookmarks reference it.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get('next') ?? '/';

  return NextResponse.redirect(`${origin}${next}`);
}

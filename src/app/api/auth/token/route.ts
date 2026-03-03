// app/api/auth/token/route.ts
// Firebase-to-Supabase Token Bridge
// Verifies a Firebase ID token, finds/creates the user in Supabase,
// mints a Supabase-compatible JWT, and sets it as an httpOnly cookie.

import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

/** Lazily initialize Firebase Admin to avoid build-time errors when env vars are missing */
function getFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
          /\\n/g,
          '\n'
        ),
      }),
    });
  }
  return admin;
}

/** Lazily create the Supabase admin client */
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const { firebaseToken } = await request.json();

    if (!firebaseToken) {
      return NextResponse.json(
        { error: 'Missing firebaseToken' },
        { status: 400 }
      );
    }

    const firebaseAdmin = getFirebaseAdmin();
    const supabaseAdmin = getSupabaseAdmin();

    // 1. Verify the Firebase token
    const decoded = await firebaseAdmin.auth().verifyIdToken(firebaseToken);
    const email = decoded.email;

    if (!email) {
      return NextResponse.json({ error: 'No email in token' }, { status: 400 });
    }

    const avatarUrl = decoded.picture || null;
    const displayName = decoded.name || null;

    // 2. Find existing user by email in the `users` table
    let { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, name, phone, college, gender')
      .eq('email', email)
      .single();

    let isNewUser = false;
    let userId: string;

    if (existingUser) {
      // Existing user — use their Supabase UUID
      userId = existingUser.id;
    } else {
      // 3. New user — create in Supabase Auth (for UUID) and `users` table
      isNewUser = true;
      const { data: authUser, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          email_confirm: true,
        });

      if (createError) {
        console.error('Error creating Supabase auth user:', createError);
        throw createError;
      }

      userId = authUser.user.id;

      // Insert into the `users` table
      const { error: insertError } = await supabaseAdmin.from('users').insert({
        id: userId,
        email,
        name: displayName,
      });

      if (insertError) {
        console.error('Error inserting user into users table:', insertError);
        // Don't throw — the auth user exists, so subsequent logins will work
      }
    }

    // Check profile completeness
    const isProfileComplete = !isNewUser
      ? !!(
          existingUser?.name &&
          existingUser?.phone &&
          existingUser?.college &&
          existingUser?.gender
        )
      : false;

    // 4. Mint a Supabase-compatible JWT
    const supabaseJWT = jwt.sign(
      {
        sub: userId, // auth.uid() reads this
        role: 'authenticated',
        email,
        aud: 'authenticated',
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.SUPABASE_JWT_SECRET!
    );

    // 5. Build response with httpOnly cookie
    const response = NextResponse.json({
      access_token: supabaseJWT,
      user: { id: userId, email },
      isNewUser,
      isProfileComplete,
      avatarUrl,
      displayName,
    });

    // Set the JWT as an httpOnly cookie for server-side auth
    response.cookies.set('sb-custom-auth-token', supabaseJWT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 3600, // 1 hour — matches JWT expiry
    });

    return response;
  } catch (error) {
    console.error('Token bridge error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

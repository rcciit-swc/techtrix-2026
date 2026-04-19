'use client';

import { Button } from '@/components/ui/button';
import { login } from '@/lib/services/auth';
import { supabase } from '@/lib/supabase/client';
import { uploadToImgBB } from '@/lib/utils/imgbb';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface InvitationData {
  email: string;
  name: string;
  fest_id: string | null;
}

type PageState =
  | 'checking-auth'
  | 'redirecting'
  | 'loading'
  | 'invalid'
  | 'form'
  | 'submitting'
  | 'success';

type ErrorType = 'general' | 'email-mismatch';

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const masked =
    local.length <= 2
      ? local[0] + '***'
      : local[0] + '***' + local[local.length - 1];
  return `${masked}@${domain}`;
}

export default function EvangelistOnboard() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [state, setState] = useState<PageState>('checking-auth');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorType, setErrorType] = useState<ErrorType>('general');
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loggedInEmail, setLoggedInEmail] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // set from invitation, not editable
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [image, setImage] = useState('');
  const [referralCodeError, setReferralCodeError] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Referral code availability check
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [isCodeAvailable, setIsCodeAvailable] = useState<boolean | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auth check → token verify on mount
  useEffect(() => {
    if (!token) {
      setErrorMessage(
        'No invitation token provided. Please use the link from your invitation email.'
      );
      setErrorType('general');
      setState('invalid');
      return;
    }

    const init = async () => {
      // Step 1: check auth
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Not logged in — redirect to Google OAuth, come back here after
        setState('redirecting');
        await login();
        return;
      }

      setLoggedInEmail(user.email ?? '');

      // Step 2: verify the invitation token
      setState('loading');
      try {
        const res = await fetch(
          `/api/evangelists/invite/verify?token=${encodeURIComponent(token)}`
        );
        const data = await res.json();

        if (!res.ok || !data.valid) {
          setErrorMessage(data.error || 'Invalid invitation token.');
          setErrorType('general');
          setState('invalid');
          return;
        }

        // Step 3: check email match
        if (data.email.toLowerCase() !== (user.email ?? '').toLowerCase()) {
          setInvitation(data); // store so we can show invitation email
          setErrorType('email-mismatch');
          setErrorMessage(
            `This invitation was sent to ${maskEmail(data.email)}, but you are signed in as ${maskEmail(user.email ?? '')}.`
          );
          setState('invalid');
          return;
        }

        setInvitation(data);
        setName(data.name);
        setEmail(data.email);
        setState('form');
      } catch {
        setErrorMessage('Failed to verify invitation. Please try again.');
        setErrorType('general');
        setState('invalid');
      }
    };

    init();
  }, [token]);

  const validateReferralCode = useCallback((code: string) => {
    if (!code) {
      setReferralCodeError('Referral code is required');
      return false;
    }
    if (code.length < 3 || code.length > 30) {
      setReferralCodeError('Must be 3-30 characters');
      return false;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(code)) {
      setReferralCodeError(
        'Only letters, numbers, hyphens, and underscores allowed'
      );
      return false;
    }
    setReferralCodeError('');
    return true;
  }, []);

  const checkCodeAvailability = useCallback((code: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const isFormatValid =
      code.length >= 3 && code.length <= 30 && /^[a-zA-Z0-9_-]+$/.test(code);

    if (!isFormatValid) {
      setIsCodeAvailable(null);
      setIsCheckingCode(false);
      return;
    }

    setIsCheckingCode(true);
    setIsCodeAvailable(null);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/evangelists/check-code?code=${encodeURIComponent(code)}`
        );
        const data = await res.json();
        setIsCodeAvailable(data.available ?? false);
      } catch {
        setIsCodeAvailable(null);
      } finally {
        setIsCheckingCode(false);
      }
    }, 500);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setImageUploading(true);
    try {
      const url = await uploadToImgBB(file);
      setImage(url);
      toast.success('Image uploaded successfully');
    } catch {
      toast.error('Failed to upload image. Please try again.');
      setImagePreview(null);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateReferralCode(referralCode)) return;
    if (!isCodeAvailable) {
      toast.error('Please choose an available referral code');
      return;
    }
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!phone.trim()) {
      toast.error('Phone number is required');
      return;
    }
    if (!college.trim()) {
      toast.error('College is required');
      return;
    }

    setState('submitting');

    try {
      const res = await fetch('/api/evangelists/invite/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          referral_code: referralCode.trim(),
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          college: college.trim() || null,
          image: image || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || 'Failed to complete onboarding');
        setState('form');
        return;
      }

      setState('success');
    } catch {
      toast.error('Something went wrong. Please try again.');
      setState('form');
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,247,255,0.03)_0%,transparent_70%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold text-white uppercase tracking-wide mb-2"
            style={{ fontFamily: 'Metal Mania' }}
          >
            TechTrix 2026
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-500 mx-auto mb-3" />
          <p className="text-white/50 text-sm">Evangelist Onboarding</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-md p-6 md:p-8 shadow-2xl">
          {/* Checking Auth State */}
          {state === 'checking-auth' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-12 gap-4"
            >
              <div className="w-10 h-10 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
              <p className="text-white/60 text-sm">Checking your session...</p>
            </motion.div>
          )}

          {/* Redirecting to Login State */}
          {state === 'redirecting' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-12 gap-4 text-center"
            >
              <div className="w-10 h-10 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
              <p className="text-white/60 text-sm">
                Redirecting you to sign in...
              </p>
              <p className="text-white/30 text-xs max-w-xs">
                You&apos;ll be brought back here automatically after signing in.
              </p>
            </motion.div>
          )}

          {/* Loading / Verifying Token State */}
          {state === 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-12 gap-4"
            >
              <div className="w-10 h-10 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
              <p className="text-white/60 text-sm">
                Verifying your invitation...
              </p>
            </motion.div>
          )}

          {/* Invalid State */}
          {state === 'invalid' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-12 gap-4 text-center"
            >
              {errorType === 'email-mismatch' ? (
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
                  <svg
                    className="w-8 h-8 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                  <svg
                    className="w-8 h-8 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}

              <h2
                className="text-xl font-semibold text-white"
                style={{ fontFamily: 'Metal Mania' }}
              >
                {errorType === 'email-mismatch'
                  ? 'Wrong Account'
                  : 'Invitation Invalid'}
              </h2>
              <p className="text-white/50 text-sm max-w-sm">{errorMessage}</p>

              {errorType === 'email-mismatch' && (
                <div className="w-full mt-2 space-y-3">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white/30 text-xs uppercase tracking-wider">
                        Signed in as
                      </span>
                      <span className="text-white/60 text-xs font-mono">
                        {maskEmail(loggedInEmail)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/30 text-xs uppercase tracking-wider">
                        Invitation for
                      </span>
                      <span className="text-amber-400/80 text-xs font-mono">
                        {invitation ? maskEmail(invitation.email) : '—'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => login()}
                    className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm rounded-xl transition-all"
                  >
                    Sign in with a different account
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Form State */}
          {(state === 'form' || state === 'submitting') && invitation && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="text-center mb-6">
                <h2
                  className="text-xl font-semibold text-white mb-1"
                  style={{ fontFamily: 'Metal Mania' }}
                >
                  Welcome, Evangelist!
                </h2>
                <p className="text-white/40 text-xs">
                  Complete your details below to get started
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-white/70 text-xs font-medium mb-1.5 uppercase tracking-wider">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  placeholder="Your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-white/70 text-xs font-medium mb-1.5 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white/50 text-sm cursor-not-allowed"
                />
                <p className="text-white/30 text-xs mt-1">
                  Email is set from your invitation and cannot be changed
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white/70 text-xs font-medium mb-1.5 uppercase tracking-wider">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  placeholder="Your phone number"
                />
              </div>

              {/* College */}
              <div>
                <label className="block text-white/70 text-xs font-medium mb-1.5 uppercase tracking-wider">
                  College
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  placeholder="Your college / institution"
                />
              </div>

              {/* Referral Code */}
              <div>
                <label className="block text-white/70 text-xs font-medium mb-1.5 uppercase tracking-wider">
                  Referral Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => {
                      const val = e.target.value;
                      setReferralCode(val);
                      if (referralCodeError) validateReferralCode(val);
                      checkCodeAvailability(val);
                    }}
                    onBlur={() => validateReferralCode(referralCode)}
                    required
                    className={`w-full bg-white/5 border rounded-lg px-4 py-2.5 pr-10 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-1 transition-all ${
                      referralCodeError
                        ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
                        : isCodeAvailable === true
                          ? 'border-green-500/50 focus:border-green-500/50 focus:ring-green-500/20'
                          : isCodeAvailable === false
                            ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
                            : 'border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                    }`}
                    placeholder="e.g. my-code-2026"
                  />
                  {/* Right-end indicator */}
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    {isCheckingCode ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                    ) : isCodeAvailable === true ? (
                      <svg
                        className="w-4 h-4 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : isCodeAvailable === false ? (
                      <svg
                        className="w-4 h-4 text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : null}
                  </div>
                </div>
                {referralCodeError ? (
                  <p className="text-red-400 text-xs mt-1">
                    {referralCodeError}
                  </p>
                ) : isCodeAvailable === false ? (
                  <p className="text-red-400 text-xs mt-1">
                    This referral code is already taken
                  </p>
                ) : isCodeAvailable === true ? (
                  <p className="text-green-400 text-xs mt-1">
                    Referral code is available
                  </p>
                ) : (
                  <p className="text-white/30 text-xs mt-1">
                    This will be used to track registrations you refer
                  </p>
                )}
              </div>

              {/* Profile Photo Upload */}
              <div>
                <label className="block text-white/70 text-xs font-medium mb-1.5 uppercase tracking-wider">
                  Profile Photo{' '}
                  <span className="text-white/30">(optional)</span>
                </label>
                <div
                  onClick={() =>
                    !imageUploading && fileInputRef.current?.click()
                  }
                  className={`w-full border border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                    imageUploading
                      ? 'border-cyan-500/30 bg-cyan-500/5'
                      : 'border-white/10 bg-white/5 hover:border-cyan-500/40 hover:bg-white/[0.07]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {imageUploading ? (
                    <div className="flex items-center justify-center gap-2 py-2">
                      <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                      <span className="text-cyan-400/70 text-sm">
                        Uploading...
                      </span>
                    </div>
                  ) : imagePreview ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="text-left">
                        <p className="text-white/70 text-sm">Photo uploaded</p>
                        <p className="text-white/30 text-xs">Click to change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2">
                      <svg
                        className="w-8 h-8 text-white/30 mx-auto mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                        />
                      </svg>
                      <p className="text-white/40 text-sm">
                        Click to upload your profile photo
                      </p>
                      <p className="text-white/20 text-xs mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  state === 'submitting' ||
                  imageUploading ||
                  isCheckingCode ||
                  isCodeAvailable !== true
                }
                className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold py-3 rounded-lg text-sm uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20"
              >
                {state === 'submitting' ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  'Complete Onboarding'
                )}
              </button>
            </motion.form>
          )}

          {/* Success State */}
          {state === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-8 gap-1 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2
                className="text-2xl font-semibold text-white mb-2"
                style={{ fontFamily: 'Metal Mania' }}
              >
                Welcome, Evangelist!
              </h2>
              <p className="text-white/50 text-sm max-w-sm mb-6">
                Your evangelist profile is now active. Share your referral link
                to start tracking registrations.
              </p>

              <div className="w-full space-y-4 mb-8">
                {/* Referral Code Box */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all hover:bg-white/[0.07]">
                  <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-2 font-medium">
                    Your Referral Code
                  </p>
                  <p className="text-cyan-400 text-2xl font-mono font-bold tracking-wider drop-shadow-[0_0_8px_rgba(0,247,255,0.4)]">
                    {referralCode}
                  </p>
                </div>

                {/* Referral Link Box */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left transition-all hover:bg-white/[0.07]">
                  <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-2 font-medium">
                    Your Referral Link
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 overflow-hidden">
                      <p className="text-white/80 text-xs font-mono truncate">
                        {`${window.location.origin}/?ref=${referralCode}`}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const link = `${window.location.origin}/?ref=${referralCode}`;
                        navigator.clipboard.writeText(link);
                        toast.success('Referral link copied!');
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                      title="Copy Link"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col gap-3">
                <Button
                  onClick={async () => {
                    const shareUrl = `${window.location.origin}/?ref=${referralCode}`;
                    const shareData = {
                      title: 'Join TechTrix 2026',
                      text: `🔥 Join TechTrix 2026! Register now using my referral link for amazing events and prizes! 🚀`,
                      url: shareUrl,
                    };

                    if (
                      navigator.share &&
                      navigator.canShare &&
                      navigator.canShare(shareData)
                    ) {
                      try {
                        await navigator.share(shareData);
                      } catch (err) {
                        if ((err as Error).name !== 'AbortError') {
                          toast.error(
                            'Could not share. Try copying the link instead.'
                          );
                        }
                      }
                    } else {
                      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareData.text}\n\n🔗 ${shareUrl}`)}`;
                      window.open(whatsappUrl, '_blank');
                    }
                  }}
                  className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 12.684a3 3 0 100-2.684 3 3 0 000 2.684z"
                    />
                  </svg>
                  Share with Others
                </Button>

                <Link href="/" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full h-12 border-white/10 bg-transparent text-white/70 hover:text-white hover:bg-white/5 font-medium uppercase tracking-wider rounded-xl transition-all"
                  >
                    Go to Home
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-white/20 text-xs mt-6">
          TechTrix 2026 — RCCIIT Student Welfare Committee
        </p>
      </motion.div>
    </div>
  );
}

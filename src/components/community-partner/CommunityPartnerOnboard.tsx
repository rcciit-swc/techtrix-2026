'use client';

import { Button } from '@/components/ui/button';
import { uploadToImgBB } from '@/lib/utils/imgbb';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface InvitationData {
  email: string;
  community_name: string;
  fest_id: string | null;
}

type PageState = 'loading' | 'invalid' | 'form' | 'submitting' | 'success';

export default function CommunityPartnerOnboard() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [state, setState] = useState<PageState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [invitation, setInvitation] = useState<InvitationData | null>(null);

  // Form fields
  const [communityName, setCommunityName] = useState('');
  const [communityEmail, setCommunityEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [communityImage, setCommunityImage] = useState('');
  const [referralCodeError, setReferralCodeError] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      setErrorMessage(
        'No invitation token provided. Please use the link from your invitation email.'
      );
      setState('invalid');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(
          `/api/community-partners/invite/verify?token=${encodeURIComponent(token)}`
        );
        const data = await res.json();

        if (!res.ok || !data.valid) {
          setErrorMessage(data.error || 'Invalid invitation token.');
          setState('invalid');
          return;
        }

        setInvitation(data);
        setCommunityName(data.community_name);
        setCommunityEmail(data.email);
        setState('form');
      } catch {
        setErrorMessage('Failed to verify invitation. Please try again.');
        setState('invalid');
      }
    };

    verifyToken();
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

    // Show preview
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setImageUploading(true);
    try {
      const url = await uploadToImgBB(file);
      setCommunityImage(url);
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
    if (!communityName.trim()) {
      toast.error('Community name is required');
      return;
    }

    setState('submitting');

    try {
      const res = await fetch('/api/community-partners/invite/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          referral_code: referralCode.trim(),
          community_name: communityName.trim(),
          community_image: communityImage || null,
          community_email: communityEmail.trim() || null,
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(250,204,21,0.03)_0%,transparent_70%)]" />
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
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 mx-auto mb-3" />
          <p className="text-white/50 text-sm">Community Partner Onboarding</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-md p-6 md:p-8 shadow-2xl">
          {/* Loading State */}
          {state === 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-12 gap-4"
            >
              <div className="w-10 h-10 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
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
              <h2
                className="text-xl font-semibold text-white"
                style={{ fontFamily: 'Metal Mania' }}
              >
                Invitation Invalid
              </h2>
              <p className="text-white/50 text-sm max-w-sm">{errorMessage}</p>
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
                  Welcome, Partner!
                </h2>
                <p className="text-white/40 text-xs">
                  Complete your details below to get started
                </p>
              </div>

              {/* Community Name */}
              <div>
                <label className="block text-white/70 text-xs font-medium mb-1.5 uppercase tracking-wider">
                  Community Name
                </label>
                <input
                  type="text"
                  value={communityName}
                  onChange={(e) => setCommunityName(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all"
                  placeholder="Your community name"
                />
              </div>

              {/* Community Email */}
              <div>
                <label className="block text-white/70 text-xs font-medium mb-1.5 uppercase tracking-wider">
                  Community Email
                </label>
                <input
                  type="email"
                  value={communityEmail}
                  onChange={(e) => setCommunityEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all"
                  placeholder="contact@community.com"
                />
              </div>

              {/* Referral Code */}
              <div>
                <label className="block text-white/70 text-xs font-medium mb-1.5 uppercase tracking-wider">
                  Referral Code
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => {
                    setReferralCode(e.target.value);
                    if (referralCodeError) validateReferralCode(e.target.value);
                  }}
                  onBlur={() => validateReferralCode(referralCode)}
                  required
                  className={`w-full bg-white/5 border rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-1 transition-all ${
                    referralCodeError
                      ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
                      : 'border-white/10 focus:border-yellow-500/50 focus:ring-yellow-500/20'
                  }`}
                  placeholder="e.g. my-community-2026"
                />
                {referralCodeError && (
                  <p className="text-red-400 text-xs mt-1">
                    {referralCodeError}
                  </p>
                )}
                <p className="text-white/30 text-xs mt-1">
                  This will be used to track registrations from your community
                </p>
              </div>

              {/* Community Logo Upload */}
              <div>
                <label className="block text-white/70 text-xs font-medium mb-1.5 uppercase tracking-wider">
                  Community Logo{' '}
                  <span className="text-white/30">(optional)</span>
                </label>
                <div
                  onClick={() =>
                    !imageUploading && fileInputRef.current?.click()
                  }
                  className={`w-full border border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                    imageUploading
                      ? 'border-yellow-500/30 bg-yellow-500/5'
                      : 'border-white/10 bg-white/5 hover:border-yellow-500/40 hover:bg-white/[0.07]'
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
                      <div className="w-4 h-4 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
                      <span className="text-yellow-400/70 text-sm">
                        Uploading...
                      </span>
                    </div>
                  ) : imagePreview ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="text-left">
                        <p className="text-white/70 text-sm">Image uploaded</p>
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
                        Click to upload your community logo
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
                disabled={state === 'submitting' || imageUploading}
                className="w-full mt-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold py-3 rounded-lg text-sm uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20"
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
                Welcome Aboard!
              </h2>
              <p className="text-white/50 text-sm max-w-sm mb-6">
                Your community partnership is now active. Use the link below to
                track registrations from your community.
              </p>

              <div className="w-full space-y-4 mb-8">
                {/* Referral Code Box */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all hover:bg-white/[0.07]">
                  <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-2 font-medium">
                    Your Referral Code
                  </p>
                  <p className="text-[#EDF526] text-2xl font-mono font-bold tracking-wider drop-shadow-[0_0_8px_rgba(237,245,38,0.4)]">
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
                      // Fallback to WhatsApp if native share is not available
                      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareData.text}\n\n🔗 ${shareUrl}`)}`;
                      window.open(whatsappUrl, '_blank');
                    }
                  }}
                  className="w-full h-12 bg-white text-black hover:bg-white/90 font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95"
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

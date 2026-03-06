'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ExternalLink, Github, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

import { checkUserSponsorProofAction } from '@/lib/actions/sponsor';
import { getUserData } from '@/lib/services/user';
import { useSponsor } from '@/lib/stores/sponsor';

export default function SponsorModal() {
  const {
    isVerified,
    isChecked,
    hasBeenShown,
    setVerified,
    setChecked,
    markShown,
  } = useSponsor();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Already shown this session or already verified — skip
    if (hasBeenShown || isVerified) return;

    const checkVisibility = async () => {
      try {
        const userData = await getUserData();

        if (!userData?.data?.email) {
          // Case 1: NOT logged in — show modal once, mark as shown
          setIsOpen(true);
          markShown();
          setChecked(true);
          return;
        }

        // Case 2: Logged in — check the sheet
        const hasProof = await checkUserSponsorProofAction(userData.data.email);
        if (hasProof) {
          // Email found in sheet — never show modal
          setVerified(true);
        } else {
          // Email NOT in sheet — show modal once, mark as shown
          setIsOpen(true);
          markShown();
        }
      } catch (error) {
        console.error('Error in SponsorModal visibility check:', error);
        // On error, show modal to be safe
        setIsOpen(true);
        markShown();
      } finally {
        setChecked(true);
      }
    };

    checkVisibility();
  }, [hasBeenShown, isVerified, setVerified, setChecked, markShown]);

  const handleClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) markShown();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] border-yellow-400/50 bg-black/90 backdrop-blur-xl text-white overflow-hidden p-0">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-transparent pointer-events-none" />

        <DialogHeader className="p-4 pb-0 relative">
          <DialogTitle
            className="text-xl md:text-2xl font-bold text-yellow-400 uppercase tracking-tighter text-center"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Support Our Sponsor: Bindu 🚀
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-3 relative overflow-hidden">
          {/* Video Section */}
          <div className="rounded-lg overflow-hidden border border-white/10 shadow-2xl bg-black/40 aspect-video relative group max-w-[440px] mx-auto">
            <video
              src="https://sfrxivbavmvrjmmrmfxq.supabase.co/storage/v1/object/public/videos/video.mp4"
              controls
              className="w-full h-full object-cover"
              autoPlay
              muted
            />
          </div>

          <div className="space-y-2 text-white/80 text-xs md:text-sm leading-tight">
            <p className="font-semibold text-white">
              Techtrix 2026 is officially happening! 🚀
            </p>
            <p>
              To make this happen, we need to show some love to our sponsor,{' '}
              <strong>Bindu</strong>:
            </p>

            <ul className="space-y-1 list-none">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold text-[10px] mt-0.5">
                  1
                </span>
                <span>
                  <strong>Star the Repo:</strong> Go to the Github link and hit
                  the ⭐.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold text-[10px] mt-0.5">
                  2
                </span>
                <span>
                  <strong>Screenshot:</strong> Take a proof screenshot with your
                  username.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold text-[10px] mt-0.5">
                  3
                </span>
                <span>
                  <strong>Submit:</strong> Upload your proof in the Google form
                  link.
                </span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <Button
              asChild
              className="bg-white text-black hover:bg-white/90 font-bold h-10 rounded-lg group text-xs px-4"
            >
              <a
                href="https://github.com/GetBindu/Bindu/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Github className="w-4 h-4" />
                STAR REPO
                <Star className="w-3.5 h-3.5 text-yellow-500 group-hover:scale-110 transition-transform fill-yellow-500" />
              </a>
            </Button>

            <Button
              asChild
              className="bg-yellow-400 text-black hover:bg-yellow-300 font-bold h-10 rounded-lg text-xs px-4"
            >
              <a
                href="https://forms.gle/UyGEmksXgtuRWikq5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                SUBMIT PROOF
              </a>
            </Button>
          </div>

          <p className="text-center text-[10px] text-white/50 italic py-1">
            Your cooperation means a lot. Let&apos;s make this fest huge! 🚀
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

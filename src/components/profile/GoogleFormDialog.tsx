'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

const GOOGLE_FORM_URL = 'https://forms.gle/UyGEmksXgtuRWikq5';

interface GoogleFormDialogProps {
  open: boolean;
  onProceed: () => void;
}

export default function GoogleFormDialog({
  open,
  onProceed,
}: GoogleFormDialogProps) {
  const [formOpened, setFormOpened] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleOpenForm = () => {
    window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer');
    setFormOpened(true);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-[480px] max-w-[360px] border border-white/10 rounded-[24px] p-0 bg-[#090b0d] shadow-2xl flex flex-col w-full"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <VisuallyHidden>
          <DialogTitle>Fill Google Form</DialogTitle>
        </VisuallyHidden>

        {/* Background */}
        <div
          className="absolute inset-0 opacity-50 pointer-events-none rounded-[24px]"
          style={{
            backgroundImage: 'url(/about/poster.png)',
            backgroundSize: 'auto 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div className="relative z-10 px-6 sm:px-8 py-8 flex flex-col items-center gap-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2
              className="text-[22px] sm:text-[26px] text-yellow-400 uppercase tracking-wider mb-2"
              style={{ fontFamily: "'Metal Mania'" }}
            >
              One Last Step!
            </h2>
            <p
              className="text-white/70 text-[13px] sm:text-[14px] leading-relaxed"
              style={{ fontFamily: 'Maname' }}
            >
              Please fill out this quick form to complete your registration.
            </p>
          </motion.div>

          {/* Open Form Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full"
          >
            <Button
              onClick={handleOpenForm}
              className="w-full h-[48px] bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-[14px] sm:text-[15px] rounded-full shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-all duration-300 border-0 uppercase tracking-wider gap-2"
              style={{ fontFamily: "'Metal Mania'" }}
            >
              <ExternalLink size={18} />
              {formOpened ? 'Open Form Again' : 'Open Google Form'}
            </Button>
          </motion.div>

          {/* Confirmation Checkbox */}
          <AnimatePresence>
            {formOpened && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full"
              >
                <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-white/10 hover:border-yellow-400/30 bg-white/5 transition-all">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                        confirmed
                          ? 'bg-yellow-400 border-yellow-400'
                          : 'border-white/30 group-hover:border-yellow-400/50'
                      }`}
                    >
                      {confirmed && (
                        <CheckCircle2 size={14} className="text-black" />
                      )}
                    </div>
                  </div>
                  <span
                    className="text-white/80 text-[12px] sm:text-[13px] select-none"
                    style={{ fontFamily: 'Maname' }}
                  >
                    I have filled out the Google Form
                  </span>
                </label>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Proceed Button */}
          <AnimatePresence>
            {formOpened && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full"
              >
                <Button
                  onClick={onProceed}
                  disabled={!confirmed}
                  className="w-full h-[44px] bg-white/10 border border-white/20 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-[14px] sm:text-[15px] rounded-full transition-all duration-300 uppercase tracking-wider"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  Proceed
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

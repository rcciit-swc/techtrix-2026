'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useUser } from '@/lib/stores';
import { uploadToImgBB } from '@/lib/utils/imgbb';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export interface CommunityPartnerData {
  referral_code: string;
  community_name: string;
  community_image: string | null;
  community_email: string | null;
}

interface EditCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityData: CommunityPartnerData;
  onSaved: (updated: CommunityPartnerData) => void;
}

export default function EditCommunityDialog({
  open,
  onOpenChange,
  communityData,
  onSaved,
}: EditCommunityDialogProps) {
  const { setCommunityData } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [communityName, setCommunityName] = useState(
    communityData.community_name
  );
  const communityEmail = communityData.community_email || '';
  const [communityImage, setCommunityImage] = useState(
    communityData.community_image || ''
  );
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    communityData.community_image || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setCommunityImage(url);
      toast.success('Image uploaded successfully');
    } catch {
      toast.error('Failed to upload image');
      setImagePreview(communityData.community_image || null);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!communityName.trim()) {
      toast.error('Community name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/community-partners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referral_code: communityData.referral_code,
          community_name: communityName.trim(),
          community_image: communityImage || null,
          community_email: communityEmail.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || 'Failed to update');
        return;
      }

      toast.success('Community profile updated!');
      setShowSuccess(true);
      const updated = {
        ...communityData,
        community_name: communityName.trim(),
        community_image: communityImage || null,
        community_email: communityEmail.trim() || null,
      };
      onSaved(updated);
      setCommunityData(updated);

      setTimeout(() => {
        setShowSuccess(false);
        onOpenChange(false);
      }, 1500);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-w-[360px] max-h-[90vh] overflow-hidden border border-white/10 rounded-[24px] p-0 bg-[#000000] shadow-2xl flex flex-col w-full">
        <VisuallyHidden>
          <DialogTitle>Edit Community Profile</DialogTitle>
        </VisuallyHidden>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 w-full h-full">
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 px-6"
              >
                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(250,204,21,0.5)]">
                  <Check size={40} className="text-black" />
                </div>
                <h2
                  className="text-2xl font-bold text-yellow-400 mb-2 uppercase tracking-wider"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  Updated!
                </h2>
                <p
                  className="text-white/70 text-center"
                  style={{ fontFamily: 'Maname' }}
                >
                  Community profile updated successfully
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="editForm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="px-4 sm:px-8 py-4 sm:py-6"
              >
                <div className="relative z-10 flex flex-col gap-4 items-center w-full">
                  <h2
                    className="text-[20px] sm:text-[24px] leading-tight text-yellow-400 text-center w-full uppercase tracking-wider"
                    style={{ fontFamily: "'Metal Mania'" }}
                  >
                    Community Profile
                  </h2>

                  <div className="flex flex-col gap-3 w-full">
                    {/* Referral Code - Disabled */}
                    <div className="flex flex-col gap-1 items-start w-full">
                      <label
                        className="font-medium text-[11px] sm:text-[12px] leading-tight text-white/80 uppercase tracking-wide"
                        style={{ fontFamily: 'Maname' }}
                      >
                        Referral Code
                      </label>
                      <input
                        type="text"
                        value={communityData.referral_code}
                        disabled
                        className="w-full py-2 bg-white/5 border border-white/10 px-3 font-medium text-[12px] sm:text-[13px] text-white/50 cursor-not-allowed rounded-xl font-mono"
                        style={{ fontFamily: 'Maname' }}
                      />
                      <p className="text-white/30 text-[10px]">
                        Referral code cannot be changed
                      </p>
                    </div>

                    {/* Community Name */}
                    <div className="flex flex-col gap-1 items-start w-full">
                      <label
                        className="font-medium text-[11px] sm:text-[12px] leading-tight text-white/80 uppercase tracking-wide"
                        style={{ fontFamily: 'Maname' }}
                      >
                        Community Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={communityName}
                        onChange={(e) => setCommunityName(e.target.value)}
                        required
                        className="w-full py-2 bg-white/10 border border-white/20 hover:border-yellow-400/60 focus:border-yellow-400 px-3 font-medium text-[12px] sm:text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/30 rounded-xl transition-all"
                        style={{ fontFamily: 'Maname' }}
                        placeholder="Your community name"
                      />
                    </div>

                    {/* Community Email - Non-editable */}
                    <div className="flex flex-col gap-1 items-start w-full">
                      <label
                        className="font-medium text-[11px] sm:text-[12px] leading-tight text-white/80 uppercase tracking-wide"
                        style={{ fontFamily: 'Maname' }}
                      >
                        Community Email
                      </label>
                      <input
                        type="email"
                        value={communityEmail}
                        disabled
                        className="w-full py-2 bg-white/5 border border-white/10 px-3 font-medium text-[12px] sm:text-[13px] text-white/50 cursor-not-allowed rounded-xl"
                        style={{ fontFamily: 'Maname' }}
                      />
                      <p className="text-white/30 text-[10px]">
                        Email cannot be changed
                      </p>
                    </div>

                    {/* Community Logo Upload */}
                    <div className="flex flex-col gap-1 items-start w-full">
                      <label
                        className="font-medium text-[11px] sm:text-[12px] leading-tight text-white/80 uppercase tracking-wide"
                        style={{ fontFamily: 'Maname' }}
                      >
                        Community Logo
                      </label>
                      <div
                        onClick={() =>
                          !imageUploading && fileInputRef.current?.click()
                        }
                        className={`w-full border border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
                          imageUploading
                            ? 'border-yellow-500/30 bg-yellow-500/5'
                            : 'border-white/20 bg-white/5 hover:border-yellow-400/60'
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
                          <div className="flex items-center justify-center gap-2 py-1">
                            <div className="w-4 h-4 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
                            <span className="text-yellow-400/70 text-xs">
                              Uploading...
                            </span>
                          </div>
                        ) : imagePreview ? (
                          <div className="flex items-center gap-3">
                            <img
                              src={imagePreview}
                              alt="Logo"
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div className="text-left">
                              <p className="text-white/70 text-xs">
                                Logo uploaded
                              </p>
                              <p className="text-white/30 text-[10px]">
                                Click to change
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="py-1">
                            <p className="text-white/40 text-xs">
                              Click to upload logo
                            </p>
                            <p className="text-white/20 text-[10px] mt-0.5">
                              PNG, JPG up to 5MB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || imageUploading}
                    className="w-full max-w-[500px] h-[40px] bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-[14px] sm:text-[15px] rounded-full shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-all duration-300 border-0 uppercase tracking-wider font-['Metal_Mania'] mt-2"
                  >
                    {isSubmitting ? 'SAVING...' : 'SAVE CHANGES'}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

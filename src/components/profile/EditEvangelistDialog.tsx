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

export interface EvangelistData {
  referral_code: string;
  name: string;
  image: string | null;
  email: string | null;
  phone: string | null;
  college: string | null;
}

interface EditEvangelistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evangelistData: EvangelistData;
  onSaved: (updated: EvangelistData) => void;
}

export default function EditEvangelistDialog({
  open,
  onOpenChange,
  evangelistData,
  onSaved,
}: EditEvangelistDialogProps) {
  const { setEvangelistData } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [name, setName] = useState(evangelistData.name);
  const [phone, setPhone] = useState(evangelistData.phone || '');
  const [college, setCollege] = useState(evangelistData.college || '');
  const [image, setImage] = useState(evangelistData.image || '');
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    evangelistData.image || null
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
      setImage(url);
      toast.success('Image uploaded successfully');
    } catch {
      toast.error('Failed to upload image');
      setImagePreview(evangelistData.image || null);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/evangelists', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referral_code: evangelistData.referral_code,
          name: name.trim(),
          image: image || null,
          phone: phone.trim() || null,
          college: college.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || 'Failed to update');
        return;
      }

      toast.success('Evangelist profile updated!');
      setShowSuccess(true);
      const updated = {
        ...evangelistData,
        name: name.trim(),
        image: image || null,
        phone: phone.trim() || null,
        college: college.trim() || null,
      };
      onSaved(updated);
      setEvangelistData(updated);

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
          <DialogTitle>Edit Evangelist Profile</DialogTitle>
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
                <div className="w-20 h-20 bg-cyan-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,247,255,0.5)]">
                  <Check size={40} className="text-black" />
                </div>
                <h2
                  className="text-2xl font-bold text-cyan-400 mb-2 uppercase tracking-wider"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  Updated!
                </h2>
                <p
                  className="text-white/70 text-center"
                  style={{ fontFamily: 'Maname' }}
                >
                  Evangelist profile updated successfully
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
                    className="text-[20px] sm:text-[24px] leading-tight text-cyan-400 text-center w-full uppercase tracking-wider"
                    style={{ fontFamily: "'Metal Mania'" }}
                  >
                    Evangelist Profile
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
                        value={evangelistData.referral_code}
                        disabled
                        className="w-full py-2 bg-white/5 border border-white/10 px-3 font-medium text-[12px] sm:text-[13px] text-white/50 cursor-not-allowed rounded-xl font-mono"
                        style={{ fontFamily: 'Maname' }}
                      />
                      <p className="text-white/30 text-[10px]">
                        Referral code cannot be changed
                      </p>
                    </div>

                    {/* Name */}
                    <div className="flex flex-col gap-1 items-start w-full">
                      <label
                        className="font-medium text-[11px] sm:text-[12px] leading-tight text-white/80 uppercase tracking-wide"
                        style={{ fontFamily: 'Maname' }}
                      >
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full py-2 bg-white/10 border border-white/20 hover:border-cyan-400/60 focus:border-cyan-400 px-3 font-medium text-[12px] sm:text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/30 rounded-xl transition-all"
                        style={{ fontFamily: 'Maname' }}
                        placeholder="Your name"
                      />
                    </div>

                    {/* Email - Non-editable */}
                    <div className="flex flex-col gap-1 items-start w-full">
                      <label
                        className="font-medium text-[11px] sm:text-[12px] leading-tight text-white/80 uppercase tracking-wide"
                        style={{ fontFamily: 'Maname' }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        value={evangelistData.email || ''}
                        disabled
                        className="w-full py-2 bg-white/5 border border-white/10 px-3 font-medium text-[12px] sm:text-[13px] text-white/50 cursor-not-allowed rounded-xl"
                        style={{ fontFamily: 'Maname' }}
                      />
                      <p className="text-white/30 text-[10px]">
                        Email cannot be changed
                      </p>
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1 items-start w-full">
                      <label
                        className="font-medium text-[11px] sm:text-[12px] leading-tight text-white/80 uppercase tracking-wide"
                        style={{ fontFamily: 'Maname' }}
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full py-2 bg-white/10 border border-white/20 hover:border-cyan-400/60 focus:border-cyan-400 px-3 font-medium text-[12px] sm:text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/30 rounded-xl transition-all"
                        style={{ fontFamily: 'Maname' }}
                        placeholder="Your phone number"
                      />
                    </div>

                    {/* College */}
                    <div className="flex flex-col gap-1 items-start w-full">
                      <label
                        className="font-medium text-[11px] sm:text-[12px] leading-tight text-white/80 uppercase tracking-wide"
                        style={{ fontFamily: 'Maname' }}
                      >
                        College
                      </label>
                      <input
                        type="text"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        className="w-full py-2 bg-white/10 border border-white/20 hover:border-cyan-400/60 focus:border-cyan-400 px-3 font-medium text-[12px] sm:text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/30 rounded-xl transition-all"
                        style={{ fontFamily: 'Maname' }}
                        placeholder="Your college / institution"
                      />
                    </div>

                    {/* Profile Photo Upload */}
                    <div className="flex flex-col gap-1 items-start w-full">
                      <label
                        className="font-medium text-[11px] sm:text-[12px] leading-tight text-white/80 uppercase tracking-wide"
                        style={{ fontFamily: 'Maname' }}
                      >
                        Profile Photo
                      </label>
                      <div
                        onClick={() =>
                          !imageUploading && fileInputRef.current?.click()
                        }
                        className={`w-full border border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
                          imageUploading
                            ? 'border-cyan-500/30 bg-cyan-500/5'
                            : 'border-white/20 bg-white/5 hover:border-cyan-400/60'
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
                            <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                            <span className="text-cyan-400/70 text-xs">
                              Uploading...
                            </span>
                          </div>
                        ) : imagePreview ? (
                          <div className="flex items-center gap-3">
                            <img
                              src={imagePreview}
                              alt="Photo"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="text-left">
                              <p className="text-white/70 text-xs">
                                Photo uploaded
                              </p>
                              <p className="text-white/30 text-[10px]">
                                Click to change
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="py-1">
                            <p className="text-white/40 text-xs">
                              Click to upload photo
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
                    className="w-full max-w-[500px] h-[40px] bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-[14px] sm:text-[15px] rounded-full shadow-[0_0_15px_rgba(0,247,255,0.3)] transition-all duration-300 border-0 uppercase tracking-wider font-['Metal_Mania'] mt-2"
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

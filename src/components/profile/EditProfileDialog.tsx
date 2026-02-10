'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check } from 'lucide-react';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: any;
  profileImage?: string;
  name?: string;
  onSave: (formData: FormData) => Promise<void>;
}

export default function EditProfileDialog({
  open,
  onOpenChange,
  userData,
  name,
  onSave,
}: EditProfileDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Pass the form data to the onSave handler
      await onSave(new FormData(e.currentTarget));
      setShowSuccess(true);

      // Close dialog after showing success message
      setTimeout(() => {
        setShowSuccess(false);
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[682px] md:max-w-[682px] max-w-[380px] max-h-[85vh] overflow-y-auto my-scrollbar border-none rounded-[24px] p-0 bg-transparent shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>Edit Profile</DialogTitle>
        </VisuallyHidden>
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative z-10 flex flex-col items-center justify-center py-12 px-6 bg-[#090b0d] rounded-[24px] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-50 pointer-events-none"
                style={{
                  backgroundImage: 'url(/about/check2.png)',
                  backgroundSize: '450px',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(250,204,21,0.5)]">
                  <Check size={40} className="text-black" />
                </div>
                <h2
                  className="text-2xl font-bold text-yellow-400 mb-2 uppercase tracking-wider"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  Profile Updated!
                </h2>
                <p className="text-white/70 text-center mb-4" style={{ fontFamily: 'Maname' }}>
                  Your profile has been successfully updated
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="editForm"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={handleSubmit}
              className="relative z-10 px-5 sm:px-10 md:px-10 py-10 bg-[#090b0d] rounded-[24px] border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Internal Background Image */}
              <div
                className="absolute inset-0 opacity-50 pointer-events-none"
                style={{
                  backgroundImage: 'url(/about/check2.png)',
                  backgroundSize: '450px',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />

              <div className="relative z-10 flex flex-col gap-10 items-center w-full">
                {/* Content Section */}
                <div className="flex flex-col gap-8 md:gap-[33px] items-start w-full">
                  {/* Title */}
                  <h2
                    className="text-[28px] md:text-[36px] leading-normal text-yellow-400 text-center w-full uppercase tracking-wider"
                    style={{ fontFamily: "'Metal Mania'" }}
                  >
                    Personal Information
                  </h2>

                  {/* Full Name Field */}
                  <div className="flex flex-col gap-2 items-start w-full">
                    <label
                      htmlFor="fullName"
                      className="font-medium text-[18px] leading-normal text-white/80 uppercase tracking-wide"
                      style={{ fontFamily: 'Maname' }}
                    >
                      Full Name
                    </label>
                    <div className="relative w-full h-[50px]">
                      <input
                        id="fullName"
                        name="fullName"
                        defaultValue={userData?.name || name}
                        className="w-full h-full bg-white/10 border border-white/20 hover:border-yellow-400/60 focus:border-yellow-400 px-5 py-0 font-medium text-[18px] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/30 rounded-xl transition-all leading-[50px]"
                        style={{ fontFamily: 'Maname' }}
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Gender Field */}
                  <div className="flex flex-col gap-2 items-start w-full">
                    <label
                      htmlFor="gender"
                      className="font-medium text-[18px] leading-normal text-white/80 uppercase tracking-wide"
                      style={{ fontFamily: 'Maname' }}
                    >
                      Gender
                    </label>
                    <Select name="gender" defaultValue={userData?.gender || ''}>
                      <SelectTrigger className="w-full h-[50px] bg-white/10 border border-white/20 hover:border-yellow-400/60 focus:border-yellow-400 rounded-xl px-5 font-medium text-[18px] text-white focus:ring-2 focus:ring-yellow-400/30 transition-all leading-[50px] flex items-center" style={{ fontFamily: 'Maname' }}>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/95 backdrop-blur-md border border-white/20 rounded-xl">
                        <SelectItem
                          value="female"
                          className="text-white focus:text-yellow-400 hover:bg-white/10 focus:bg-white/10 font-medium text-[16px]"
                          style={{ fontFamily: 'Maname' }}
                        >
                          Female
                        </SelectItem>
                        <SelectItem
                          value="male"
                          className="text-white focus:text-yellow-400 hover:bg-white/10 focus:bg-white/10 font-medium text-[16px]"
                          style={{ fontFamily: 'Maname' }}
                        >
                          Male
                        </SelectItem>
                        <SelectItem
                          value="other"
                          className="text-white focus:text-yellow-400 hover:bg-white/10 focus:bg-white/10 font-medium text-[16px]"
                          style={{ fontFamily: 'Maname' }}
                        >
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Phone Number Field */}
                  <div className="flex flex-col gap-2 items-start w-full">
                    <label
                      htmlFor="phone"
                      className="font-medium text-[18px] leading-normal text-white/80 uppercase tracking-wide"
                      style={{ fontFamily: 'Maname' }}
                    >
                      Phone Number
                    </label>
                    <div className="relative w-full h-[50px]">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={userData?.phone || ''}
                        className="w-full h-full bg-white/10 border border-white/20 hover:border-yellow-400/60 focus:border-yellow-400 px-5 py-0 font-medium text-[18px] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/30 rounded-xl transition-all leading-[50px]"
                        style={{ fontFamily: 'Maname' }}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="flex flex-col gap-2 items-start w-full">
                    <label
                      htmlFor="email"
                      className="font-medium text-[18px] leading-normal text-white/80 uppercase tracking-wide"
                      style={{ fontFamily: 'Maname' }}
                    >
                      Email ID
                    </label>
                    <div className="relative w-full h-[50px]">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={userData?.email || ''}
                        className="w-full h-full bg-white/5 border border-white/10 px-5 py-0 font-medium text-[18px] text-white/50 focus:outline-none rounded-xl cursor-not-allowed leading-[50px]"
                        style={{ fontFamily: 'Maname' }}
                        placeholder="Enter your email"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* College Field */}
                  <div className="flex flex-col gap-2 items-start w-full">
                    <label
                      htmlFor="college"
                      className="font-medium text-[18px] leading-normal text-white/80 uppercase tracking-wide"
                      style={{ fontFamily: 'Maname' }}
                    >
                      College
                    </label>
                    <div className="relative w-full h-[50px]">
                      <input
                        id="college"
                        name="college"
                        defaultValue={userData?.college || ''}
                        className="w-full h-full bg-white/10 border border-white/20 hover:border-yellow-400/60 focus:border-yellow-400 px-5 py-0 font-medium text-[18px] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/30 rounded-xl transition-all leading-[50px]"
                        style={{ fontFamily: 'Maname' }}
                        placeholder="Enter your college name"
                      />
                    </div>
                  </div>

                  {/* College Roll Field */}
                  <div className="flex flex-col gap-2 items-start w-full">
                    <label
                      htmlFor="college_roll"
                      className="font-medium text-[18px] leading-normal text-white/80 uppercase tracking-wide"
                      style={{ fontFamily: 'Maname' }}
                    >
                      College Roll No
                    </label>
                    <div className="relative w-full h-[50px]">
                      <input
                        id="college_roll"
                        name="college_roll"
                        defaultValue={userData?.college_roll || ''}
                        className="w-full h-full bg-white/10 border border-white/20 hover:border-yellow-400/60 focus:border-yellow-400 px-5 py-0 font-medium text-[18px] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/30 rounded-xl transition-all leading-[50px]"
                        style={{ fontFamily: 'Maname' }}
                        placeholder="Enter your college roll no"
                      />
                    </div>
                  </div>

                  {/* Course Field */}
                  <div className="flex flex-col gap-2 items-start w-full">
                    <label
                      htmlFor="course"
                      className="font-medium text-[18px] leading-normal text-white/80 uppercase tracking-wide"
                      style={{ fontFamily: 'Maname' }}
                    >
                      Course
                    </label>
                    <div className="relative w-full h-[50px]">
                      <input
                        id="course"
                        name="course"
                        defaultValue={userData?.course || ''}
                        className="w-full h-full bg-white/10 border border-white/20 hover:border-yellow-400/60 focus:border-yellow-400 px-5 py-0 font-medium text-[18px] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/30 rounded-xl transition-all leading-[50px]"
                        style={{ fontFamily: 'Maname' }}
                        placeholder="e.g. B.Tech, M.Tech, BCA"
                      />
                    </div>
                  </div>

                  {/* Stream Field */}
                  <div className="flex flex-col gap-2 items-start w-full">
                    <label
                      htmlFor="stream"
                      className="font-medium text-[18px] leading-normal text-white/80 uppercase tracking-wide"
                      style={{ fontFamily: 'Maname' }}
                    >
                      Stream
                    </label>
                    <div className="relative w-full h-[50px]">
                      <input
                        id="stream"
                        name="stream"
                        defaultValue={userData?.stream || ''}
                        className="w-full h-full bg-white/10 border border-white/20 hover:border-yellow-400/60 focus:border-yellow-400 px-5 py-0 font-medium text-[18px] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/30 rounded-xl transition-all leading-[50px]"
                        style={{ fontFamily: 'Maname' }}
                        placeholder="e.g. CSE, ECE, ME"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <Button
                  type="submit"
                  className="w-full max-w-[500px] h-[48px] bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-[18px] rounded-full shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-all duration-300 border-0 uppercase tracking-wider"
                  style={{ fontFamily: "'Metal Mania'" }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>SAVING...</span>
                    </>
                  ) : (
                    'SAVE CHANGES'
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
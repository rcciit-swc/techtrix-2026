'use client';

import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
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

export const EditProfileDialog: FC<EditProfileDialogProps> = ({
  open,
  onOpenChange,
  userData,
  name,
  profileImage,
  onSave,
}) => {
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
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
                  <Check size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 rajdhanifont">
                  Profile Updated!
                </h2>
                <p className="text-gray-300 text-center mb-4 rajdhanifont">
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
                    className="rajdhanifont font-semibold text-[35px] md:text-[40px] leading-normal text-white text-center underline decoration-solid underline-offset-4 w-full"
                    style={{ textUnderlinePosition: 'from-font' }}
                  >
                    Personal Information
                  </h2>

                  {/* Full Name Field */}
                  <div className="flex flex-col gap-5 md:gap-[6px] items-start w-full">
                    <label
                      htmlFor="fullName"
                      className="rajdhanifont font-medium text-[24px] leading-normal text-white"
                    >
                      Full Name
                    </label>
                    <div className="relative w-full h-[45px]">
                      <div className="absolute inset-0 bg-[#090b0d] border border-[#ff003c] rounded-[15px]" />
                      <input
                        id="fullName"
                        name="fullName"
                        defaultValue={userData?.name || name}
                        className="relative w-full h-full bg-transparent px-[22px] rajdhanifont font-semibold text-[25px] text-[#cca855] focus:outline-none focus:ring-2 focus:ring-[#ff003c] rounded-[15px]"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Gender Field */}
                  <div className="flex flex-col gap-5 md:gap-[6px] items-start w-full">
                    <label
                      htmlFor="gender"
                      className="rajdhanifont font-medium text-[24px] leading-normal text-white"
                    >
                      Gender
                    </label>
                    <Select name="gender" defaultValue={userData?.gender || ''}>
                      <SelectTrigger className="relative w-full h-[45px] bg-[#090b0d] border border-[#ff003c] rounded-[15px] px-[22px] rajdhanifont font-semibold text-[25px] text-[#cca855] focus:ring-2 focus:ring-[#ff003c]">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#090b0d] border border-[#ff003c]">
                        <SelectItem
                          value="female"
                          className="text-[#cca855] focus:text-white hover:bg-[#ff003c]/20 focus:bg-[#ff003c]/20 rajdhanifont font-semibold text-[20px]"
                        >
                          Female
                        </SelectItem>
                        <SelectItem
                          value="male"
                          className="text-[#cca855] focus:text-white hover:bg-[#ff003c]/20 focus:bg-[#ff003c]/20 rajdhanifont font-semibold text-[20px]"
                        >
                          Male
                        </SelectItem>
                        <SelectItem
                          value="other"
                          className="text-[#cca855] focus:text-white hover:bg-[#ff003c]/20 focus:bg-[#ff003c]/20 rajdhanifont font-semibold text-[20px]"
                        >
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Phone Number Field */}
                  <div className="flex flex-col gap-5 md:gap-[7px] items-start w-full">
                    <label
                      htmlFor="phone"
                      className="rajdhanifont font-medium text-[24px] leading-normal text-white"
                    >
                      Phone Number
                    </label>
                    <div className="relative w-full h-[45px]">
                      <div className="absolute inset-0 bg-[#090b0d] border border-[#ff003c] rounded-[15px]" />
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={userData?.phone || ''}
                        className="relative w-full h-full bg-transparent px-[22px] rajdhanifont font-semibold text-[25px] text-[#cca855] focus:outline-none focus:ring-2 focus:ring-[#ff003c] rounded-[15px]"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="flex flex-col gap-5 md:gap-[18px] items-start w-full">
                    <label
                      htmlFor="email"
                      className="rajdhanifont font-medium text-[24px] leading-normal text-white"
                    >
                      Email ID
                    </label>
                    <div className="relative w-full h-[45px]">
                      <div className="absolute inset-0 bg-[#090b0d] border border-[#ff003c] rounded-[15px]" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={userData?.email || ''}
                        className="relative w-full h-full bg-transparent px-[22px] rajdhanifont font-semibold text-[25px] text-[#cca855] focus:outline-none focus:ring-2 focus:ring-[#ff003c] rounded-[15px]"
                        placeholder="Enter your email"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <Button
                  type="submit"
                  className="w-full max-w-[500px] h-[48px] bg-[#f2efe9] hover:bg-[#e5e2dc] text-black rajdhanifont font-semibold text-[21px] rounded-[15px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.25)] transition-all duration-300 border-0"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>SAVING...</span>
                    </>
                  ) : (
                    'SAVE'
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
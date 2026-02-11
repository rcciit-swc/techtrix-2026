'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check } from 'lucide-react';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: any;
  profileImage?: string;
  name?: string;
  onSave: (formData: FormData) => Promise<void>;
}

export default function EditProfileDialog({ open, onOpenChange, userData, name, onSave }: EditProfileDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(new FormData(e.currentTarget));
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); onOpenChange(false); }, 2000);
    } catch (error) { console.error('Failed to save profile:', error); }
    finally { setIsSubmitting(false); }
  };

  const formFields = [
    { id: 'fullName', label: 'Full Name', defaultValue: userData?.name || name, placeholder: 'Enter your full name' },
    { id: 'phone', label: 'Phone Number', type: 'tel', defaultValue: userData?.phone, placeholder: 'Enter phone number' },
    { id: 'email', label: 'Email ID', type: 'email', defaultValue: userData?.email, placeholder: 'Enter your email', readOnly: true },
    { id: 'college', label: 'College', defaultValue: userData?.college, placeholder: 'Enter your college name' },
    { id: 'college_roll', label: 'College Roll No', defaultValue: userData?.college_roll, placeholder: 'Enter your college roll no' },
    { id: 'course', label: 'Course', defaultValue: userData?.course, placeholder: 'e.g. B.Tech, M.Tech, BCA' },
    { id: 'stream', label: 'Stream', defaultValue: userData?.stream, placeholder: 'e.g. CSE, ECE, ME' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[682px] md:max-w-[682px] max-w-[380px] max-h-[85vh] overflow-hidden border border-white/10 rounded-[24px] p-0 bg-[#090b0d] shadow-2xl flex flex-col w-full">
        <VisuallyHidden><DialogTitle>Edit Profile</DialogTitle></VisuallyHidden>

        {/* Fixed Background */}
        <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ backgroundImage: 'url(/about/poster.png)', backgroundSize: 'auto 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto my-scrollbar relative z-10 w-full h-full">
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 px-6"
              >
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(250,204,21,0.5)]">
                    <Check size={40} className="text-black" />
                  </div>
                  <h2 className="text-2xl font-bold text-yellow-400 mb-2 uppercase tracking-wider" style={{ fontFamily: "'Metal Mania'" }}>Profile Updated!</h2>
                  <p className="text-white/70 text-center mb-4" style={{ fontFamily: 'Maname' }}>Your profile has been successfully updated</p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="editForm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="px-5 sm:px-10 md:px-10 py-10"
              >
                <div className="relative z-10 flex flex-col gap-8 items-center w-full">
                  <h2 className="text-[28px] md:text-[36px] leading-normal text-yellow-400 text-center w-full uppercase tracking-wider" style={{ fontFamily: "'Metal Mania'" }}>Personal Information</h2>

                  <div className="flex flex-col gap-6 w-full">
                    {formFields.map((field) => (
                      <div key={field.id} className="flex flex-col gap-2 items-start w-full">
                        <label htmlFor={field.id} className="font-medium text-[18px] leading-normal text-white/80 uppercase tracking-wide" style={{ fontFamily: 'Maname' }}>{field.label}</label>
                        <input
                          id={field.id}
                          name={field.id}
                          type={field.type || 'text'}
                          defaultValue={field.defaultValue || ''}
                          readOnly={field.readOnly}
                          className={`w-full pt-2 pb-4 bg-white/${field.readOnly ? '5' : '10'} border border-white/${field.readOnly ? '10' : '20'} ${!field.readOnly && 'hover:border-yellow-400/60 focus:border-yellow-400'} px-5 font-medium text-[18px] text-white ${field.readOnly ? 'text-white/50 cursor-not-allowed' : 'focus:outline-none focus:ring-2 focus:ring-yellow-400/30'} rounded-xl transition-all`}
                          style={{ fontFamily: 'Maname' }}
                          placeholder={field.placeholder}
                        />
                      </div>
                    ))}

                    {/* Gender Field */}
                    <div className="flex flex-col gap-2 items-start w-full">
                      <label htmlFor="gender" className="font-medium text-[18px] leading-normal text-white/80 uppercase tracking-wide" style={{ fontFamily: 'Maname' }}>Gender</label>
                      <Select name="gender" defaultValue={userData?.gender || ''}>
                        <SelectTrigger className="w-full pt-2 pb-4 bg-white/10 border border-white/20 hover:border-yellow-400/60 focus:border-yellow-400 rounded-xl px-5 font-medium text-[18px] text-white focus:ring-2 focus:ring-yellow-400/30 transition-all font-[Maname] min-h-[50px]">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/95 backdrop-blur-md border border-white/20 rounded-xl">
                          {['Female', 'Male', 'Other'].map(v => (
                            <SelectItem key={v.toLowerCase()} value={v.toLowerCase()} className="text-white focus:text-yellow-400 hover:bg-white/10 focus:bg-white/10 font-medium text-[16px] font-[Maname]">
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full max-w-[500px] h-[48px] bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-[18px] rounded-full shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-all duration-300 border-0 uppercase tracking-wider font-['Metal_Mania']">
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
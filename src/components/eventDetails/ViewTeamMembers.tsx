'use client';
import type { Variants } from 'framer-motion';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import {
  User,
  Phone,
  Mail,
  Users,
  Edit,
  Trash2,
  CreditCard,
  Crown,
  Check,
  Loader2,
  X,
  ArrowRight,
} from 'lucide-react';

interface TeamMember {
  name: string;
  email: string;
  phone: string;
}

interface ViewTeamMembersProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teamMembers: TeamMember[];
  teamLeadData?: any;
  onEditMember: (index: number) => void;
  onEditTeamLead: () => void;
  confirmTeam: () => void;
  onRemoveMember: (index: number) => void;
  showConfirmTeam: boolean;
  registerLoading: boolean;
  isFree: boolean;
}

export function ViewTeamMembers({
  isOpen,
  onOpenChange,
  teamMembers,
  onEditMember,
  teamLeadData,
  onEditTeamLead,
  onRemoveMember,
  confirmTeam,
  registerLoading,
  showConfirmTeam,
  isFree,
}: ViewTeamMembersProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Stop Lenis smooth scroll when sheet/drawer is open
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).lenis) {
      if (isOpen) {
        (window as any).lenis.stop();
        document.body.style.overflow = 'hidden';
      } else {
        (window as any).lenis.start();
        document.body.style.overflow = '';
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen]);

  const memberVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  const Content = () => (
    <div className="mt-6 space-y-6">
      {/* Team Lead Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-yellow-400/5 rounded-xl blur-sm group-hover:bg-yellow-400/10 transition-all duration-500"></div>
        <div className="relative bg-white/5 border border-white/10 rounded-xl p-5 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400/20 p-2 rounded-full">
                <Crown size={18} className="text-yellow-400" />
              </div>
              <h3
                className="text-lg text-white tracking-widest"
                style={{ fontFamily: "'Metal Mania'" }}
              >
                Team Lead
              </h3>
            </div>
            <Button
              onClick={onEditTeamLead}
              variant="ghost"
              size="sm"
              className="text-white/40 hover:text-white hover:bg-white/10 h-8 w-8 p-0 rounded-full"
            >
              <Edit size={14} />
            </Button>
          </div>

          <div className="space-y-3 pl-2 border-l border-white/10 ml-4">
            <div className="flex items-center gap-3">
              <User size={14} className="text-white/40 shrink-0" />
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">
                  Name
                </p>
                <p className="text-sm text-white font-medium">
                  {teamLeadData?.name || '-'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={14} className="text-white/40 shrink-0" />
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">
                  Email
                </p>
                <p className="text-sm text-white font-medium truncate max-w-[200px]">
                  {teamLeadData?.email || '-'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={14} className="text-white/40 shrink-0" />
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">
                  Phone
                </p>
                <p className="text-sm text-white font-medium">
                  {teamLeadData?.phone || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Team Members List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-lg text-white tracking-widest flex items-center gap-2"
            style={{ fontFamily: "'Metal Mania'" }}
          >
            <Users size={18} className="text-white/60" />
            Team Members
            <span className="text-sm text-white/40 font-sans tracking-normal ml-2">
              ({teamMembers.length})
            </span>
          </h3>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {teamMembers.length > 0 ? (
              teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={memberVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="bg-white/5 border border-white/10 rounded-xl p-4 group hover:border-white/20 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 p-2 rounded-full">
                        <User size={16} className="text-white/80" />
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">
                          {member.name}
                        </p>
                        <p className="text-xs text-white/40">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => onEditMember(index)}
                        variant="ghost"
                        size="sm"
                        className="text-white/40 hover:text-white hover:bg-white/10 h-7 w-7 p-0 rounded-full"
                      >
                        <Edit size={12} />
                      </Button>
                      <Button
                        onClick={() => onRemoveMember(index)}
                        variant="ghost"
                        size="sm"
                        className="text-white/40 hover:text-red-400 hover:bg-red-500/10 h-7 w-7 p-0 rounded-full"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/60 pl-11">
                    <Phone size={10} />
                    <span>{member.phone}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 border border-dashed border-white/10 rounded-xl"
              >
                <p className="text-white/40 text-sm">No members added yet</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showConfirmTeam && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="pt-4 border-t border-white/10"
        >
          {/* Divider with spacing handled by margin/padding */}
        </motion.div>
      )}
    </div>
  );

  const desktopSidebarVariants: Variants = {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.2 } },
  };

  const mobileDrawerVariants: Variants = {
    hidden: { y: '100%', opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    exit: { y: '100%', opacity: 0, transition: { duration: 0.2 } },
  };

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange} modal={true}>
        <DrawerContent className="bg-[#0A0A0A] border-t border-white/20 max-h-[85vh] flex flex-col">
          <motion.div
            variants={mobileDrawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col h-full"
          >
            <DrawerHeader className="border-b border-white/10 pb-4">
              <DrawerTitle
                className="text-white text-xl tracking-widest text-center"
                style={{ fontFamily: "'Metal Mania'" }}
              >
                Team Roster
              </DrawerTitle>
              <DrawerDescription className="text-white/40 text-center text-xs">
                Review your team details before registering
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-4 flex-1 overflow-y-auto my-scrollbar">
              <Content />
            </div>

            {showConfirmTeam && (
              <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-md">
                <Button
                  onClick={confirmTeam}
                  disabled={registerLoading}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium py-6 rounded-full group relative overflow-hidden transition-all duration-300"
                >
                  {registerLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} className="mr-2" />
                      <span className="tracking-wide text-sm">
                        {isFree ? 'CONFIRM REGISTRATION' : 'CONFIRM & PAY'}
                      </span>
                      <ArrowRight
                        size={16}
                        className="ml-2 group-hover:translate-x-1 transition-transform"
                      />
                      <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange} modal={true}>
      <SheetContent
        side="right"
        className="w-full sm:w-[500px] bg-black/80 backdrop-blur-xl border-l border-white/20 p-0 shadow-2xl overflow-hidden flex flex-col"
      >
        <motion.div
          variants={desktopSidebarVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col h-full"
        >
          <SheetHeader className="p-6 border-b border-white/10">
            <SheetTitle
              className="text-white text-2xl tracking-widest flex items-center gap-3"
              style={{ fontFamily: "'Metal Mania'" }}
            >
              <Users size={24} className="text-white/80" />
              Team Roster
            </SheetTitle>
            <SheetDescription className="text-white/40 text-sm">
              Review and manage your team members
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 pb-6 my-scrollbar">
            <Content />
          </div>

          {showConfirmTeam && (
            <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-md">
              <Button
                onClick={confirmTeam}
                disabled={registerLoading}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium py-6 rounded-full group relative overflow-hidden transition-all duration-300 shadow-lg"
              >
                {registerLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin mr-2" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={20} className="mr-2" />
                    <span className="tracking-wide">
                      {isFree ? 'CONFIRM REGISTRATION' : 'CONFIRM & PAY'}
                    </span>
                    <ArrowRight
                      size={18}
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                    />
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                  </>
                )}
              </Button>
            </div>
          )}
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}

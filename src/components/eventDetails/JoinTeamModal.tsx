'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUser } from '@/lib/stores';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Building,
  Check,
  Loader2,
  Mail,
  Phone,
  Search,
  User,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface TeamInfo {
  team_id: string;
  team_name: string;
  event_name: string;
  current_members: number;
  max_team_size: number;
  slots_available: number;
}

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function JoinTeamModal({
  isOpen,
  onClose,
  onSuccess,
}: JoinTeamModalProps) {
  const { userData } = useUser();

  const [step, setStep] = useState<'code' | 'details' | 'success'>('code');
  const [code, setCode] = useState('');
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');

  useEffect(() => {
    if (isOpen && userData) {
      setName(userData.name ?? '');
      setPhone(userData.phone ?? '');
      setEmail(userData.email ?? '');
      setCollege((userData as any).college ?? '');
    }
  }, [isOpen, userData?.id]);

  const handleLookup = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/teams/join?code=${encodeURIComponent(code.trim().toUpperCase())}`
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? 'Invalid code');
        setLoading(false);
        return;
      }
      setTeamInfo(data);
      setStep('details');
    } catch {
      toast.error('Failed to look up team. Try again.');
    }
    setLoading(false);
  };

  const handleJoin = async () => {
    if (!name || !phone || !email || !college) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/teams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invite_code: code.trim().toUpperCase(),
          name,
          phone,
          email,
          college,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? 'Failed to join team');
        setLoading(false);
        return;
      }
      setStep('success');
      onSuccess?.();
    } catch {
      toast.error('Something went wrong. Try again.');
    }
    setLoading(false);
  };

  const handleClose = () => {
    setStep('code');
    setCode('');
    setTeamInfo(null);
    onClose();
  };

  const fadeVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-[420px] bg-black/90 backdrop-blur-xl border border-white/20 p-0 shadow-2xl rounded-2xl overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-white/10">
          <DialogHeader>
            <DialogTitle
              className="text-center text-white text-xl tracking-widest"
              style={{ fontFamily: "'Metal Mania'" }}
            >
              Join a Team
            </DialogTitle>
            <p className="text-center text-white/50 text-xs mt-1">
              Enter an invite code to join an existing team
            </p>
          </DialogHeader>
        </div>

        <div className="px-6 py-6">
          <AnimatePresence mode="wait">
            {/* Step 1 — Code entry */}
            {step === 'code' && (
              <motion.div
                key="code"
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-white/50 text-xs uppercase tracking-wider">
                    Invite Code
                  </label>
                  <div className="relative">
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                      placeholder="TT-XXXXXX"
                      autoFocus
                      className="w-full bg-white/5 border border-white/15 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 focus:outline-none text-white rounded-xl p-3 pl-10 text-sm tracking-widest placeholder:text-white/20 placeholder:tracking-normal"
                    />
                    <Search
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleClose}
                    className="flex-1 py-2.5 rounded-full text-xs border border-white/15 text-white/50 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLookup}
                    disabled={loading || !code.trim()}
                    className="flex-1 py-2.5 rounded-full text-xs bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                  >
                    {loading ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <>
                        Find Team <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2 — Team info + member details */}
            {step === 'details' && teamInfo && (
              <motion.div
                key="details"
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                {/* Team summary */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-white text-sm font-medium">
                      {teamInfo.team_name}
                    </p>
                    <span className="text-white/40 text-xs flex items-center gap-1">
                      <Users size={11} />
                      {teamInfo.current_members}/{teamInfo.max_team_size}
                    </span>
                  </div>
                  <p className="text-white/40 text-xs">{teamInfo.event_name}</p>
                  <p className="text-yellow-300 text-xs">
                    {teamInfo.slots_available} slot
                    {teamInfo.slots_available !== 1 ? 's' : ''} available
                  </p>
                </div>

                {/* Member details */}
                <div className="space-y-3">
                  {[
                    {
                      icon: User,
                      label: 'Your Name',
                      value: name,
                      setter: setName,
                      type: 'text',
                      readOnly: !!userData?.name,
                    },
                    {
                      icon: Phone,
                      label: 'Phone',
                      value: phone,
                      setter: setPhone,
                      type: 'tel',
                      readOnly: !!userData?.phone,
                    },
                    {
                      icon: Mail,
                      label: 'Email',
                      value: email,
                      setter: setEmail,
                      type: 'email',
                      readOnly: !!userData?.email,
                    },
                    {
                      icon: Building,
                      label: 'College',
                      value: college,
                      setter: setCollege,
                      type: 'text',
                      readOnly: false,
                    },
                  ].map(
                    ({ icon: Icon, label, value, setter, type, readOnly }) => (
                      <div key={label} className="space-y-1">
                        <label className="text-white/40 text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <Icon size={11} /> {label}
                        </label>
                        <input
                          type={type}
                          value={value}
                          onChange={(e) => setter(e.target.value)}
                          readOnly={readOnly}
                          className={`w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-yellow-400/40 transition-colors ${readOnly ? 'text-white/60' : ''}`}
                        />
                      </div>
                    )
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setStep('code')}
                    className="flex items-center gap-1 px-4 py-2.5 rounded-full text-xs border border-white/15 text-white/50 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <X size={12} /> Back
                  </button>
                  <button
                    onClick={handleJoin}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-full text-xs bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                  >
                    {loading ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <>
                        Join Team <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3 — Success */}
            {step === 'success' && teamInfo && (
              <motion.div
                key="success"
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col items-center py-4 space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                  <Check size={28} className="text-green-400" />
                </div>
                <div className="text-center space-y-1">
                  <p
                    className="text-white text-lg tracking-wide"
                    style={{ fontFamily: "'Metal Mania'" }}
                  >
                    Joined!
                  </p>
                  <p className="text-white/50 text-sm">
                    You've joined{' '}
                    <span className="text-white">{teamInfo.team_name}</span>
                  </p>
                  <p className="text-white/30 text-xs">{teamInfo.event_name}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-full text-xs bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all"
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

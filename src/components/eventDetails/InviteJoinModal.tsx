'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { login } from '@/lib/services/auth';
import { getTeamDataByTeamId } from '@/lib/services/register';
import { useEvents, useUser } from '@/lib/stores';
import {
  AlertCircle,
  Building,
  Check,
  Crown,
  Loader2,
  Mail,
  Phone,
  User,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface TeamMemberInfo {
  label: string;
  name: string;
  email: string | null;
  phone: string | null;
}

interface TeamInfo {
  team_id: string;
  team_name: string;
  event_id: string;
  event_name: string;
  current_members: number;
  min_team_size: number;
  max_team_size: number;
  slots_available: number;
  team_status: string;
  members: TeamMemberInfo[];
}

// Minimal shape needed for rendering a team's member list
interface ExistingTeamView {
  team_id: string;
  team_name: string;
  members: TeamMemberInfo[];
}

type ModalView = 'join' | 'already_this' | 'already_other' | 'joined';

interface InviteJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  invCode: string;
  eventId: string;
}

export function InviteJoinModal({
  isOpen,
  onClose,
  invCode,
  eventId,
}: InviteJoinModalProps) {
  const { userData, userLoading } = useUser();
  const eventsData = useEvents((s) => s.eventsData);

  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  const [college, setCollege] = useState('');
  const [joining, setJoining] = useState(false);

  // Which screen to show
  const [view, setView] = useState<ModalView>('join');
  // For "already_other" — holds the other team's data once fetched
  const [otherTeam, setOtherTeam] = useState<ExistingTeamView | null>(null);
  const [fetchingOther, setFetchingOther] = useState(false);

  // ── Reset on open ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !invCode) return;
    setFetching(true);
    setTeamError(null);
    setTeamInfo(null);
    setView('join');
    setOtherTeam(null);

    fetch(`/api/teams/join?code=${encodeURIComponent(invCode)}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) setTeamError(data.error ?? 'Invalid invite code');
        else setTeamInfo(data);
      })
      .catch(() => setTeamError('Failed to load team info.'))
      .finally(() => setFetching(false));
  }, [isOpen, invCode]);

  // Pre-fill college from profile
  useEffect(() => {
    if (userData?.college) setCollege(userData.college);
  }, [userData?.college]);

  // ── Membership detection (runs once teamInfo + userData both ready) ────────
  useEffect(() => {
    if (!teamInfo || !userData?.email) return;

    // Case 1: already a member of the invited team
    const inThisTeam = teamInfo.members.some(
      (m) => m.email?.toLowerCase() === userData.email.toLowerCase()
    );
    if (inThisTeam) {
      setView('already_this');
      return;
    }

    // Case 2: already in a DIFFERENT team for this event
    const storeEvent = eventsData.find((e) => e.id === eventId);
    const existingTeamId = storeEvent?.registered_team_id;
    if (existingTeamId && existingTeamId !== teamInfo.team_id) {
      setView('already_other');
      // Pre-fetch the other team's details for "View Team"
      setFetchingOther(true);
      getTeamDataByTeamId(existingTeamId)
        .then((data) => {
          if (!data) return;
          setOtherTeam({
            team_id: data.team_id,
            team_name: data.team_name ?? 'Your Team',
            members: [
              {
                label: 'Team Lead',
                name: data.team_lead_name ?? data.team_lead_email ?? '—',
                email: data.team_lead_email,
                phone: data.team_lead_phone,
              },
              ...data.participants.map((p, i) => ({
                label: `Member ${i + 2}`,
                name: p.name,
                email: p.email,
                phone: p.phone ?? null,
              })),
            ],
          });
        })
        .finally(() => setFetchingOther(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamInfo, userData?.email]);

  const handleLogin = () => {
    login(`/event/${eventId}?inv_code=${encodeURIComponent(invCode)}`);
  };

  const handleJoin = async () => {
    if (!college.trim()) {
      toast.error('Please enter your college name');
      return;
    }
    setJoining(true);
    try {
      const res = await fetch('/api/teams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invite_code: invCode,
          name: userData!.name,
          phone: userData!.phone,
          email: userData!.email,
          college: college.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? 'Failed to join team');
        return;
      }
      setView('joined');
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setJoining(false);
    }
  };

  const isLoading = fetching || userLoading;

  // ── Header copy per view ───────────────────────────────────────────────────
  const headerTitle = {
    join: 'Join Team',
    already_this: 'Already a Member',
    already_other: 'Already Registered',
    joined: "You're In!",
  }[view];

  const headerSub = {
    join: 'You were invited to join a team',
    already_this: `You're already part of ${teamInfo?.team_name ?? 'this team'}`,
    already_other: 'You have a different team for this event',
    joined: `Successfully joined ${teamInfo?.team_name}`,
  }[view];

  // ── Shared member list renderer ────────────────────────────────────────────
  const MemberList = ({ members }: { members: TeamMemberInfo[] }) => (
    <div className="space-y-2">
      <p className="text-white/40 text-xs uppercase tracking-wider flex items-center gap-1.5">
        <Users size={11} /> Members
      </p>
      {members.map((m, i) => (
        <div
          key={i}
          className="bg-white/5 border border-white/10 rounded-xl p-3"
        >
          <div className="flex items-center gap-1.5 mb-1">
            {i === 0 ? (
              <Crown size={11} className="text-yellow-400" />
            ) : (
              <User size={11} className="text-white/30" />
            )}
            <span
              className={`text-[10px] uppercase tracking-wider ${i === 0 ? 'text-yellow-400' : 'text-white/30'}`}
            >
              {m.label}
            </span>
          </div>
          <p className="text-white text-sm">{m.name}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
            {m.phone && (
              <span className="text-[11px] text-white/40 flex items-center gap-1">
                <Phone size={10} /> {m.phone}
              </span>
            )}
            {m.email && (
              <span className="text-[11px] text-white/40 flex items-center gap-1">
                <Mail size={10} /> {m.email}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[480px] bg-black/90 backdrop-blur-xl border border-white/20 p-0 shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/10">
          <DialogHeader>
            <DialogTitle
              className="text-white text-xl tracking-widest"
              style={{ fontFamily: "'Metal Mania'" }}
            >
              {headerTitle}
            </DialogTitle>
            <p className="text-white/40 text-xs mt-1">{headerSub}</p>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[68vh] overflow-y-auto">
          {/* ── Loading ── */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
            </div>
          )}

          {/* ── Error ── */}
          {!isLoading && teamError && (
            <div className="text-center py-6">
              <p className="text-white/50 text-sm">{teamError}</p>
            </div>
          )}

          {/* ── Success ── */}
          {!isLoading && view === 'joined' && teamInfo && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">{teamInfo.team_name}</p>
                <p className="text-white/40 text-xs mt-0.5">
                  {teamInfo.event_name}
                </p>
              </div>
              <p className="text-white/50 text-sm">
                You have successfully joined the team. Good luck!
              </p>
            </div>
          )}

          {/* ── Already in THIS team ── */}
          {!isLoading && view === 'already_this' && teamInfo && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/25 rounded-xl p-4">
                <Check size={16} className="text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-white/90 text-sm font-medium">
                    You&apos;re already in{' '}
                    <span className="text-white">{teamInfo.team_name}</span>
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">
                    {teamInfo.event_name}
                  </p>
                </div>
              </div>
              <MemberList members={teamInfo.members} />
            </div>
          )}

          {/* ── Already in ANOTHER team ── */}
          {!isLoading && view === 'already_other' && teamInfo && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/25 rounded-xl p-4">
                <AlertCircle
                  size={16}
                  className="text-yellow-400 mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-white/90 text-sm font-medium">
                    You&apos;re already part of another team for this event
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">
                    You can only be in one team per event
                  </p>
                </div>
              </div>

              {/* Other team's details */}
              {fetchingOther && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 text-white/30 animate-spin" />
                </div>
              )}
              {!fetchingOther && otherTeam && (
                <div className="space-y-3">
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    <p className="text-white font-medium">
                      {otherTeam.team_name}
                    </p>
                    <p className="text-white/40 text-xs mt-0.5">
                      {teamInfo.event_name}
                    </p>
                  </div>
                  <MemberList members={otherTeam.members} />
                </div>
              )}
            </div>
          )}

          {/* ── Normal join flow ── */}
          {!isLoading && !teamError && view === 'join' && teamInfo && (
            <>
              {/* Team info card */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-white font-medium">
                      {teamInfo.team_name}
                    </p>
                    <p className="text-white/40 text-xs mt-0.5">
                      {teamInfo.event_name}
                    </p>
                  </div>
                  <span className="text-[10px] border border-yellow-400/30 text-yellow-400 bg-yellow-400/10 rounded-full px-2.5 py-0.5 shrink-0">
                    {teamInfo.slots_available} slot
                    {teamInfo.slots_available !== 1 ? 's' : ''} open
                  </span>
                </div>

                {/* Member fill bar */}
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {Array.from({ length: teamInfo.max_team_size }).map(
                      (_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            i < teamInfo.current_members
                              ? 'bg-yellow-400'
                              : 'bg-white/10'
                          }`}
                        />
                      )
                    )}
                  </div>
                  <p className="text-white/25 text-[10px]">
                    {teamInfo.current_members} of {teamInfo.max_team_size}{' '}
                    members
                  </p>
                </div>
              </div>

              <MemberList members={teamInfo.members} />

              {/* Auth / join form */}
              {!userData ? (
                <div className="space-y-3 pt-1">
                  <p className="text-white/50 text-sm text-center">
                    Sign in to join{' '}
                    <span className="text-white">{teamInfo.team_name}</span>
                  </p>
                  <button
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-all"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </button>
                  <p className="text-white/20 text-[11px] text-center">
                    You&apos;ll be redirected back here after signing in
                  </p>
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  <p className="text-white/40 text-xs uppercase tracking-wider">
                    Your Details
                  </p>
                  {[
                    { label: 'Name', value: userData.name },
                    { label: 'Phone', value: userData.phone },
                    { label: 'Email', value: userData.email },
                  ].map(({ label, value }) => (
                    <div key={label} className="space-y-1">
                      <label className="text-white/25 text-[10px] uppercase tracking-wider">
                        {label}
                      </label>
                      <div className="w-full bg-white/3 border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white/55">
                        {value}
                      </div>
                    </div>
                  ))}
                  <div className="space-y-1">
                    <label className="text-white/25 text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <Building size={10} /> College
                    </label>
                    <input
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="Your college name"
                      className="w-full bg-white/5 border border-white/15 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 focus:outline-none text-white rounded-lg px-3 py-2.5 text-sm transition-all placeholder:text-white/20"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full text-xs border border-white/15 text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            {view === 'joined' ? 'Close' : 'Cancel'}
          </button>

          {/* Join button — only on normal join flow */}
          {!isLoading &&
            !teamError &&
            view === 'join' &&
            userData &&
            teamInfo && (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="flex-1 py-2.5 rounded-full text-xs bg-gradient-to-r from-yellow-600 to-yellow-700 text-black hover:from-yellow-500 hover:to-yellow-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                style={{ fontFamily: "'Metal Mania'" }}
              >
                {joining ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> Joining...
                  </>
                ) : (
                  <>Join {teamInfo.team_name} →</>
                )}
              </button>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

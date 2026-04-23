'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ExistingTeamData } from '@/lib/services/register';
import {
  Building,
  Check,
  Copy,
  Link2,
  Mail,
  Pencil,
  Phone,
  User,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface TeamDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamData: ExistingTeamData;
  eventId: string;
  onEdit?: () => void;
  onFindMembers?: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  active: 'text-green-400 bg-green-400/10 border-green-400/30',
  closed: 'text-red-400 bg-red-400/10 border-red-400/30',
};

export function TeamDetailsModal({
  isOpen,
  onClose,
  teamData,
  eventId,
  onEdit,
  onFindMembers,
}: TeamDetailsModalProps) {
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const copyInviteCode = () => {
    if (!teamData.invite_code) return;
    navigator.clipboard.writeText(teamData.invite_code);
    setCodeCopied(true);
    toast.success('Invite code copied!');
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const copyInviteLink = () => {
    if (!teamData.invite_code) return;
    const link = `${window.location.origin}/event/${eventId}?inv_code=${teamData.invite_code}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    toast.success('Invite link copied!');
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const statusStyle = STATUS_STYLES[teamData.team_status ?? 'pending'];

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[460px] bg-black/90 backdrop-blur-xl border border-white/20 p-0 shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/10 flex items-start justify-between gap-3">
          <DialogHeader className="flex-1 text-left">
            <DialogTitle
              className="text-white text-xl tracking-widest"
              style={{ fontFamily: "'Metal Mania'" }}
            >
              Team Details
            </DialogTitle>
            <p className="text-white/50 text-xs mt-1">Your registered team</p>
          </DialogHeader>
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/80 border border-white/10 hover:border-white/30 rounded-full px-3 py-1.5 transition-all shrink-0"
            >
              <Pencil size={11} /> Edit
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[68vh] overflow-y-auto">
          {/* Team info card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-white font-medium">
                  {teamData.team_name ?? '—'}
                </p>
                {teamData.college && (
                  <p className="text-white/40 text-xs flex items-center gap-1 mt-0.5">
                    <Building size={10} /> {teamData.college}
                  </p>
                )}
              </div>
              <span
                className={`text-[10px] border rounded-full px-2.5 py-0.5 capitalize shrink-0 ${statusStyle}`}
              >
                {teamData.team_status ?? 'pending'}
              </span>
            </div>

            {/* Invite code + share link */}
            {teamData.invite_code && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between bg-black/30 border border-white/10 rounded-lg px-3 py-2">
                  <div>
                    <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">
                      Invite Code
                    </p>
                    <p className="text-white font-mono tracking-widest text-sm">
                      {teamData.invite_code}
                    </p>
                  </div>
                  <button
                    onClick={copyInviteCode}
                    className="text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                  >
                    {codeCopied ? (
                      <Check size={14} className="text-green-400" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
                <button
                  onClick={copyInviteLink}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-white/8 text-white/40 hover:text-white/80 hover:border-white/20 hover:bg-white/5 transition-all text-[11px]"
                >
                  {linkCopied ? (
                    <>
                      <Check size={11} className="text-green-400" /> Link
                      copied!
                    </>
                  ) : (
                    <>
                      <Link2 size={11} /> Copy shareable link
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Members list */}
          <div className="space-y-2">
            <p className="text-white/40 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Users size={11} /> Members ({teamData.member_count})
            </p>

            {/* Team lead */}
            <MemberCard
              label="Team Lead"
              labelColor="text-yellow-400"
              name={teamData.team_lead_name ?? teamData.team_lead_email ?? '—'}
              phone={teamData.team_lead_phone}
              email={teamData.team_lead_email}
              college={teamData.college}
            />

            {/* Participants */}
            {teamData.participants.map((p, i) => (
              <MemberCard
                key={p.email}
                label={`Member ${i + 2}`}
                labelColor="text-white/30"
                name={p.name}
                phone={p.phone}
                email={p.email}
                college={p.college}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full text-xs border border-white/15 text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            Close
          </button>
          {onFindMembers && (
            <button
              onClick={() => {
                onClose();
                onFindMembers();
              }}
              className="flex-1 py-2.5 rounded-full text-xs bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all"
            >
              Find More Members →
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MemberCard({
  label,
  labelColor,
  name,
  phone,
  email,
  college,
}: {
  label: string;
  labelColor: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  college?: string | null;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <User size={11} className={labelColor} />
        <span className={`text-[10px] uppercase tracking-wider ${labelColor}`}>
          {label}
        </span>
      </div>
      <p className="text-white text-sm">{name}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
        {phone && (
          <span className="text-[11px] text-white/40 flex items-center gap-1">
            <Phone size={10} /> {phone}
          </span>
        )}
        {email && (
          <span className="text-[11px] text-white/40 flex items-center gap-1">
            <Mail size={10} /> {email}
          </span>
        )}
        {college && (
          <span className="text-[11px] text-white/40 flex items-center gap-1">
            <Building size={10} /> {college}
          </span>
        )}
      </div>
    </div>
  );
}

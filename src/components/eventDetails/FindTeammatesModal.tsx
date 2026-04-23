'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  addToWaitlist,
  getDiscoveryListings,
  getMyDiscoveryEntry,
  postOpenTeam,
  withdrawFromDiscovery,
  type DiscoveryListing,
} from '@/lib/services/discovery';
import { useUser } from '@/lib/stores';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Building,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Share2,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface FindTeammatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventName: string;
  registeredTeamId?: string | null;
  registeredTeamName?: string | null;
  teamStatus?: 'pending' | 'active' | 'closed' | null;
  maxTeamSize?: number;
  currentMemberCount?: number;
  defaultTab?: Tab;
  hideWaitlist?: boolean;
  onRegisterAndPost?: () => Promise<void>;
}

type Tab = 'looking' | 'open_teams';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function whatsappLink(phone: string, message: string): string {
  const clean = phone.replace(/\D/g, '');
  const num = clean.startsWith('91') ? clean : `91${clean}`;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

export function FindTeammatesModal({
  isOpen,
  onClose,
  eventId,
  eventName,
  registeredTeamId,
  registeredTeamName,
  teamStatus,
  maxTeamSize,
  currentMemberCount,
  defaultTab,
  hideWaitlist,
  onRegisterAndPost,
}: FindTeammatesModalProps) {
  const { userData } = useUser();
  const [tab, setTab] = useState<Tab>(defaultTab ?? 'looking');
  const [listings, setListings] = useState<{
    looking: DiscoveryListing[];
    open_teams: DiscoveryListing[];
  }>({ looking: [], open_teams: [] });
  const [loading, setLoading] = useState(false);
  const [myEntry, setMyEntry] = useState<DiscoveryListing | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Open team form (kept — team leads still benefit from a message)
  const [showOpenTeamForm, setShowOpenTeamForm] = useState(false);
  const [openTeamMessage, setOpenTeamMessage] = useState('');

  const canPostOpenTeam =
    registeredTeamId &&
    teamStatus !== 'closed' &&
    (currentMemberCount ?? 0) < (maxTeamSize ?? 4);

  const slotsAvailable = (maxTeamSize ?? 4) - (currentMemberCount ?? 1);

  const fetchListings = async () => {
    setLoading(true);
    const data = await getDiscoveryListings(eventId);
    setListings(data);
    if (userData?.id) {
      const mine = await getMyDiscoveryEntry(eventId, userData.id);
      setMyEntry(mine);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab ?? 'looking');
      fetchListings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, eventId]);

  // Immediately join the waitlist — no form / message needed
  const handleJoinWaitlist = async () => {
    if (!userData?.id) {
      toast.error('Please log in first');
      return;
    }
    setSubmitting(true);
    const result = await addToWaitlist(eventId, userData.id, '');
    setSubmitting(false);
    if (result) {
      toast.success("You're on the waitlist!");
      fetchListings();
    } else {
      toast.error('Failed to join waitlist. Try again.');
    }
  };

  const handlePostOpenTeam = async () => {
    if (!userData?.id || !registeredTeamId) return;
    setSubmitting(true);
    const result = await postOpenTeam(
      eventId,
      userData.id,
      registeredTeamId,
      slotsAvailable,
      openTeamMessage
    );
    setSubmitting(false);
    if (result) {
      toast.success('Your team is now visible on the board!');
      setShowOpenTeamForm(false);
      setOpenTeamMessage('');
      fetchListings();
    } else {
      toast.error('Failed to post. Try again.');
    }
  };

  const handleWithdraw = async () => {
    if (!userData?.id) return;
    const ok = await withdrawFromDiscovery(eventId, userData.id);
    if (ok) {
      toast.success('Removed from discovery board');
      setMyEntry(null);
      fetchListings();
    }
  };

  const isOnWaitlist = myEntry?.type === 'looking';
  const hasPostedOpenTeam = myEntry?.type === 'open_team';

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] bg-black/90 backdrop-blur-xl border border-white/20 p-0 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex-shrink-0 border-b border-white/10">
          <DialogHeader>
            <DialogTitle
              className="text-center text-white text-xl tracking-widest"
              style={{ fontFamily: "'Metal Mania'" }}
            >
              Find Teammates
            </DialogTitle>
            <p className="text-center text-white/50 text-xs mt-1">
              {eventName}
            </p>
          </DialogHeader>

          {/* Tabs */}
          <div className="flex mt-4 bg-white/5 rounded-xl p-1 gap-1">
            {(['looking', 'open_teams'] as Tab[]).map((t) => {
              const count =
                t === 'looking'
                  ? listings.looking.length
                  : listings.open_teams.length;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    tab === t
                      ? 'bg-white/15 text-white'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {t === 'looking' ? (
                    <>
                      <Users size={12} /> Looking for Team
                    </>
                  ) : (
                    <>
                      <Users size={12} /> Open Teams
                    </>
                  )}
                  {count > 0 && (
                    <span className="bg-yellow-400/20 text-yellow-300 text-[10px] px-1.5 py-0.5 rounded-full">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Listing Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar space-y-3">
          {loading ? (
            <div className="flex justify-center py-12">
              <RefreshCw size={20} className="text-white/30 animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {tab === 'looking' &&
                  (listings.looking.length === 0 ? (
                    <p className="text-center text-white/30 text-sm py-10 italic">
                      No one on the waitlist yet. Be the first!
                    </p>
                  ) : (
                    listings.looking.map((l) => (
                      <LookingCard
                        key={l.id}
                        listing={l}
                        eventName={eventName}
                      />
                    ))
                  ))}

                {tab === 'open_teams' &&
                  (listings.open_teams.length === 0 ? (
                    <p className="text-center text-white/30 text-sm py-10 italic">
                      No open teams yet.
                    </p>
                  ) : (
                    listings.open_teams.map((l) => (
                      <OpenTeamCard
                        key={l.id}
                        listing={l}
                        eventName={eventName}
                        eventId={eventId}
                        currentUserId={userData?.id}
                      />
                    ))
                  ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Bottom CTAs */}
        <div className="px-6 pb-6 pt-4 flex-shrink-0 border-t border-white/10 space-y-3">
          {/* My status badge */}
          {myEntry && (
            <div className="flex items-center justify-between bg-yellow-400/10 border border-yellow-400/20 rounded-xl px-4 py-2.5">
              <p className="text-yellow-300 text-xs">
                {isOnWaitlist
                  ? "You're on the waitlist"
                  : 'Your team is posted'}
              </p>
              <button
                onClick={handleWithdraw}
                className="text-white/40 hover:text-white/80 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Open team form */}
          <AnimatePresence>
            {showOpenTeamForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <p className="text-white/50 text-xs">
                  Posting{' '}
                  <span className="text-white">{registeredTeamName}</span> —{' '}
                  {slotsAvailable} slot{slotsAvailable !== 1 ? 's' : ''} open
                </p>
                <textarea
                  value={openTeamMessage}
                  onChange={(e) => setOpenTeamMessage(e.target.value)}
                  placeholder="Describe what kind of teammates you're looking for..."
                  className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/40 focus:outline-none text-white text-sm rounded-xl p-3 resize-none h-20 placeholder:text-white/25"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowOpenTeamForm(false)}
                    className="flex-1 py-2 rounded-full text-xs text-white/50 hover:text-white border border-white/10 hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePostOpenTeam}
                    disabled={submitting}
                    className="flex-1 py-2 rounded-full text-xs bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 hover:bg-yellow-400/30 transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Posting...' : 'Post Open Team'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pre-registration: team doesn't exist yet */}
          {hideWaitlist &&
            !canPostOpenTeam &&
            !showOpenTeamForm &&
            onRegisterAndPost && (
              <div className="flex items-center justify-between gap-3 bg-yellow-400/8 border border-yellow-400/20 rounded-xl px-4 py-3">
                <p className="text-yellow-300/70 text-xs leading-snug">
                  Register with your current members &amp; post as open to
                  attract more.
                </p>
                <button
                  onClick={async () => {
                    setSubmitting(true);
                    await onRegisterAndPost();
                    setSubmitting(false);
                  }}
                  disabled={submitting}
                  className="shrink-0 text-xs text-yellow-300 border border-yellow-400/30 rounded-full px-3 py-1.5 hover:bg-yellow-400/10 transition-colors whitespace-nowrap disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={11} className="animate-spin" />{' '}
                      Registering...
                    </>
                  ) : (
                    'Register & Post →'
                  )}
                </button>
              </div>
            )}

          {/* CTA buttons */}
          {!showOpenTeamForm && !(hideWaitlist && !canPostOpenTeam) && (
            <div className="flex gap-2">
              {!hideWaitlist && !isOnWaitlist && !hasPostedOpenTeam && (
                <button
                  onClick={handleJoinWaitlist}
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-full text-xs border border-white/20 text-white/70 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : '+ Join Waitlist'}
                </button>
              )}
              {canPostOpenTeam && !hasPostedOpenTeam && !isOnWaitlist && (
                <button
                  onClick={() => setShowOpenTeamForm(true)}
                  className="flex-1 py-2.5 rounded-full text-xs border border-yellow-400/30 text-yellow-300 hover:bg-yellow-400/10 transition-all"
                >
                  + Post My Open Team
                </button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LookingCard({
  listing,
  eventName,
}: {
  listing: DiscoveryListing;
  eventName: string;
}) {
  const name = listing.user?.name ?? 'Anonymous';
  const college = listing.user?.college ?? '';
  const phone = listing.user?.phone ?? '';
  const email = listing.user?.email ?? '';

  const message = `Hi ${name}! I saw you're looking for a team for *${eventName}* at TechTrix 2026. We'd love to have you join us! Let's connect.`;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 font-sans">
      <div className="flex items-start justify-between gap-2">
        <p className="text-white text-[13px] font-semibold tracking-tight">
          {name}
        </p>
        <span className="text-white/25 text-[10px] shrink-0 mt-0.5">
          {timeAgo(listing.created_at)}
        </span>
      </div>

      <div className="space-y-1.5">
        {college && (
          <p className="text-white/50 text-[11px] flex items-center gap-1.5">
            <Building size={10} className="shrink-0 text-white/30" /> {college}
          </p>
        )}
        {email && (
          <p className="text-white/50 text-[11px] flex items-center gap-1.5">
            <Mail size={10} className="shrink-0 text-white/30" /> {email}
          </p>
        )}
        {phone && (
          <p className="text-white/50 text-[11px] flex items-center gap-1.5">
            <Phone size={10} className="shrink-0 text-white/30" /> {phone}
          </p>
        )}
      </div>

      {phone && (
        <a
          href={whatsappLink(phone, message)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] text-[11px] font-medium hover:bg-[#25D366]/25 transition-all"
        >
          <MessageCircle size={12} />
          Message on WhatsApp
        </a>
      )}
    </div>
  );
}

const TOOLTIP_W = 152; // matches min-w below
const SCREEN_PAD = 10; // minimum gap from viewport edge

function MemberSlot({
  member,
  isLead,
}: {
  member: { name: string; phone: string | null };
  isLead?: boolean;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const [xShift, setXShift] = useState(0);
  const btnRef = useRef<HTMLButtonElement>(null);

  const initials = member.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const leftEdge = center - TOOLTIP_W / 2;
      const rightEdge = center + TOOLTIP_W / 2;
      let shift = 0;
      if (leftEdge < SCREEN_PAD) {
        shift = SCREEN_PAD - leftEdge; // push right
      } else if (rightEdge > window.innerWidth - SCREEN_PAD) {
        shift = window.innerWidth - SCREEN_PAD - rightEdge; // push left (negative)
      }
      setXShift(shift);
    }
    setOpen((v) => !v);
  };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={handleToggle}
        className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold tracking-wide transition-all border-2 ${
          isLead
            ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-300 hover:bg-yellow-400/30'
            : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
        }`}
      >
        {initials}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 z-20 bg-[#1a1a1a] border border-white/15 rounded-xl px-3 py-2.5 shadow-xl font-sans"
            style={{
              left: '50%',
              minWidth: TOOLTIP_W,
              transform: `translateX(calc(-50% + ${xShift}px))`,
            }}
          >
            {isLead && (
              <p className="text-yellow-400/80 text-[9px] uppercase tracking-widest mb-1 font-medium">
                Team Lead
              </p>
            )}
            <p className="text-white text-[12px] font-semibold leading-snug">
              {member.name}
            </p>
            {member.phone && (
              <p className="text-white/45 text-[11px] mt-0.5 flex items-center gap-1">
                <Phone size={9} /> {member.phone}
              </p>
            )}
            {/* arrow — shifts opposite to tooltip so it still points at the button */}
            <div
              className="absolute top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white/15"
              style={{ left: `calc(50% - ${xShift}px - 4px)` }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptySlot() {
  return (
    <div className="w-9 h-9 rounded-full border-2 border-dashed border-white/15 flex items-center justify-center text-white/20">
      <span className="text-base leading-none mb-0.5">+</span>
    </div>
  );
}

function OpenTeamCard({
  listing,
  eventName,
  eventId,
  currentUserId,
}: {
  listing: DiscoveryListing;
  eventName: string;
  eventId: string;
  currentUserId?: string;
}) {
  const [shared, setShared] = useState(false);

  const leadName = listing.user?.name ?? 'Team Lead';
  const leadPhone = listing.user?.phone ?? '';
  const teamName = listing.team?.team_name ?? 'Open Team';
  const emptySlots = listing.slots_available ?? 1;
  const participants = listing.team?.participants ?? [];
  const isMyCard = listing.user_id === currentUserId;

  // All filled members: lead first, then other participants
  const filledMembers = [
    { name: leadName, phone: leadPhone, isLead: true },
    ...participants.map((p) => ({
      name: p.name,
      phone: p.phone ?? null,
      isLead: false,
    })),
  ];
  const totalSlots = filledMembers.length + emptySlots;

  const inviteUrl = listing.team?.invite_code
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/event/${eventId}?inv_code=${listing.team.invite_code}`
    : null;

  const handleShare = async () => {
    if (!inviteUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${teamName} — ${eventName}`,
          text: `Join our team for ${eventName} at TechTrix 2026! ${emptySlots} slot${emptySlots !== 1 ? 's' : ''} open.`,
          url: inviteUrl,
        });
      } catch {
        // cancelled silently
      }
    } else {
      navigator.clipboard.writeText(inviteUrl);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const waMessage = `Hi ${leadName}! I saw *${teamName}* is looking for members for *${eventName}* at TechTrix 2026. I'd love to join! Let's connect.`;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 font-sans">
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-white text-[13px] font-semibold tracking-tight">
            {teamName}
          </p>
          <p className="text-white/40 text-[11px] mt-0.5">
            {timeAgo(listing.created_at)}
          </p>
        </div>
        <span className="bg-yellow-400/15 text-yellow-300 text-[10px] font-medium px-2.5 py-1 rounded-full shrink-0 whitespace-nowrap border border-yellow-400/20">
          {emptySlots} slot{emptySlots !== 1 ? 's' : ''} open
        </span>
      </div>

      {/* Member slots */}
      <div className="space-y-1.5">
        <p className="text-white/30 text-[10px] uppercase tracking-widest font-medium">
          Members — {filledMembers.length}/{totalSlots}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {filledMembers.map((m, i) => (
            <MemberSlot key={i} member={m} isLead={m.isLead} index={i} />
          ))}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <EmptySlot key={`empty-${i}`} />
          ))}
        </div>
      </div>

      {/* Optional message from team lead */}
      {listing.message && (
        <p className="text-white/45 text-[11px] italic leading-relaxed border-t border-white/5 pt-2.5">
          "{listing.message}"
        </p>
      )}

      {/* CTA */}
      {isMyCard
        ? inviteUrl && (
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-full bg-white/8 border border-white/20 text-white/70 text-[11px] font-medium hover:bg-white/15 hover:text-white transition-all"
            >
              <Share2 size={12} />
              {shared ? 'Link copied!' : 'Share Invite Link'}
            </button>
          )
        : leadPhone && (
            <a
              href={whatsappLink(leadPhone, waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] text-[11px] font-medium hover:bg-[#25D366]/25 transition-all"
            >
              <MessageCircle size={12} />
              Request to Join via WhatsApp
            </a>
          )}
    </div>
  );
}

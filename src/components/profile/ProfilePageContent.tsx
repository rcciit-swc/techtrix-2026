'use client';

import EventsCard from '@/components/profile/EventCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useEvents, useUser } from '@/lib/stores';
import { supabase } from '@/lib/supabase/client';
import type { events } from '@/lib/types';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import EditCommunityDialog from './EditCommunityDialog';
import EditEvangelistDialog from './EditEvangelistDialog';
import EditProfileDialog from './EditProfileDialog';
import GoogleFormDialog from './GoogleFormDialog';
import ProfileSkeleton from './ProfileSkeleton';

export default function ProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGoogleFormOpen, setIsGoogleFormOpen] = useState(false);
  const [isCommunityEditOpen, setIsCommunityEditOpen] = useState(false);
  const [isEvangelistEditOpen, setIsEvangelistEditOpen] = useState(false);
  const {
    userData,
    communityData,
    evangelistData,
    setCommunityData,
    setEvangelistData,
    userLoading,
    updateUserData,
    clearUserData,
  } = useUser();
  const { eventsData } = useEvents();
  const [profileImage, setProfileImage] = useState<string>();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [name, setName] = useState<string>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOnboarding = searchParams.get('onboarding') === 'true';
  const [registeredEvents, setRegisteredEvents] = useState<events[]>([]);

  useEffect(() => {
    if (searchParams.get('onboarding') === 'true') {
      setIsEditModalOpen(true);
      toast.info('Finish your profile first');
    }
    const readUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user.user_metadata) {
        setName(data.session.user.user_metadata.full_name);
        setProfileImage(data.session.user.user_metadata.avatar_url);
      }
    };
    readUserSession();
  }, [searchParams, router]);

  useEffect(() => {
    if (eventsData.length > 0)
      setRegisteredEvents(eventsData.filter((event) => event.registered));
  }, [eventsData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('sb-session');
    clearUserData();
    router.push('/');
  };

  const handleProfileSave = async (formData: FormData) => {
    if (isOnboarding) {
      setIsGoogleFormOpen(true);
      return;
    }
    const next = searchParams.get('next');
    if (next) {
      router.replace(next);
    }
  };

  const handleGoogleFormProceed = () => {
    setIsGoogleFormOpen(false);
    const next = searchParams.get('next');
    if (next) {
      router.replace(next);
    } else if (isOnboarding) {
      router.replace('/');
    }
  };

  if (userLoading)
    return (
      <>
        <ProfileSkeleton />
        <EditProfileDialog
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          userData={userData}
          profileImage={profileImage}
          onSave={handleProfileSave}
          name={name}
        />
      </>
    );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/profile/profilebg.jpeg')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Animated Background Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(250, 204, 21, 0.1) 0%, transparent 70%)',
          animation: 'pulse 8s infinite',
        }}
      />

      <main className="pt-8 pb-10 relative z-10">
        <h1
          className="text-center font-bold text-[32px] md:text-[48px] text-white mb-2 tracking-wider uppercase"
          style={{ fontFamily: "'Metal Mania'" }}
        >
          <span>Innovator Profile</span>
        </h1>

        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-md rounded-[40px] p-6 relative overflow-hidden border border-white/10 bg-black/40 group scale-100 hover:scale-[1.01] transition-transform duration-300"
          >
            {/* Animated Border Glow */}
            <motion.div
              className="absolute inset-0 rounded-[40px] pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(250, 204, 21, 0.5), transparent)',
              }}
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
                repeatDelay: 1,
              }}
            />

            {/* Profile Info Section - Responsive Layout */}
            <motion.div
              className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Avatar */}
              <motion.div variants={itemVariants} className="relative shrink-0">
                <div className="rounded-full shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                  <Avatar className="w-[160px] h-[160px] border-2 border-yellow-400/30">
                    {!imageLoaded && (
                      <Skeleton className="w-full h-full rounded-full absolute inset-0" />
                    )}
                    <AvatarImage
                      src={profileImage || '/default-avatar.png'}
                      alt={userData?.name || 'Profile'}
                      onLoad={() => setImageLoaded(true)}
                      className={imageLoaded ? 'block object-cover' : 'hidden'}
                    />
                    <AvatarFallback
                      className="bg-black/60 text-yellow-400 text-4xl"
                      style={{ fontFamily: "'Metal Mania'" }}
                    >
                      {userData?.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Community Badge */}
                {communityData && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                    className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[9px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-yellow-500/30 uppercase tracking-wider border-2 border-black flex items-center gap-1"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Partner
                  </motion.div>
                )}

                {/* Evangelist Badge */}
                {evangelistData && !communityData && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                    className="absolute -bottom-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black text-[9px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-cyan-500/30 uppercase tracking-wider border-2 border-black flex items-center gap-1"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Evangelist
                  </motion.div>
                )}
              </motion.div>

              {/* User Details */}
              <div className="flex flex-col gap-6 items-center md:items-start w-full">
                <motion.div
                  className="text-white text-center md:text-left space-y-1"
                  variants={itemVariants}
                >
                  <h2
                    className="font-bold text-[28px] md:text-[36px] uppercase leading-tight text-yellow-400 tracking-wider"
                    style={{ fontFamily: "'Metal Mania'" }}
                  >
                    {userData?.name || name}
                  </h2>
                  <p className="font-medium text-lg text-white/70 font-[Maname]">
                    {userData?.email}
                  </p>
                  <p className="font-medium text-lg text-white/70 font-[Maname]">
                    {userData?.phone}
                  </p>

                  {/* Community Partner Info */}
                  {communityData && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-3 flex flex-col gap-3"
                    >
                      <div className="flex flex-col sm:flex-row items-center md:items-start gap-2">
                        <div className="bg-white/5 border border-yellow-500/20 rounded-xl px-4 py-2 inline-flex items-center gap-2">
                          <span className="text-yellow-400/70 text-xs uppercase tracking-wider">
                            Community:
                          </span>
                          <span className="text-white font-semibold text-sm">
                            {communityData.community_name}
                          </span>
                        </div>
                        <div className="bg-white/5 border border-yellow-500/20 rounded-xl px-4 py-2 inline-flex items-center gap-2">
                          <span className="text-yellow-400/70 text-xs uppercase tracking-wider">
                            Code:
                          </span>
                          <span className="text-yellow-400 font-mono font-bold text-sm">
                            {communityData.referral_code}
                          </span>
                        </div>
                      </div>

                      {/* Referral Link Segment */}
                      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
                        <span className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">
                          Your Referral Link
                        </span>
                        <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-xl px-3 py-2">
                          <code className="text-yellow-400/90 text-xs font-mono truncate flex-1 leading-none">
                            {`https://techtrix.rcciit.org.in/?ref=${communityData.referral_code}`}
                          </code>
                          <button
                            onClick={() => {
                              const url = `https://techtrix.rcciit.org.in/?ref=${communityData.referral_code}`;
                              navigator.clipboard.writeText(url);
                              toast.success('Referral link copied!');
                            }}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-yellow-400"
                            title="Copy Link"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Evangelist Info */}
                  {evangelistData && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-3 flex flex-col gap-3"
                    >
                      <div className="flex flex-col sm:flex-row items-center md:items-start gap-2">
                        <div className="bg-white/5 border border-cyan-500/20 rounded-xl px-4 py-2 inline-flex items-center gap-2">
                          <span className="text-cyan-400/70 text-xs uppercase tracking-wider">
                            Evangelist:
                          </span>
                          <span className="text-white font-semibold text-sm">
                            {evangelistData.name}
                          </span>
                        </div>
                        <div className="bg-white/5 border border-cyan-500/20 rounded-xl px-4 py-2 inline-flex items-center gap-2">
                          <span className="text-cyan-400/70 text-xs uppercase tracking-wider">
                            Code:
                          </span>
                          <span className="text-cyan-400 font-mono font-bold text-sm">
                            {evangelistData.referral_code}
                          </span>
                        </div>
                      </div>

                      {/* Referral Link Segment */}
                      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
                        <span className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">
                          Your Referral Link
                        </span>
                        <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-xl px-3 py-2">
                          <code className="text-cyan-400/90 text-xs font-mono truncate flex-1 leading-none">
                            {`https://techtrix.rcciit.org.in/?ref=${evangelistData.referral_code}`}
                          </code>
                          <button
                            onClick={() => {
                              const url = `https://techtrix.rcciit.org.in/?ref=${evangelistData.referral_code}`;
                              navigator.clipboard.writeText(url);
                              toast.success('Referral link copied!');
                            }}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-cyan-400"
                            title="Copy Link"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Actions */}
                <motion.div
                  className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
                  variants={itemVariants}
                >
                  <Button
                    onClick={() => setIsEditModalOpen(true)}
                    className="h-[44px] px-8 bg-yellow-400 hover:bg-yellow-300 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.3)] font-bold text-black text-base uppercase tracking-wider relative overflow-hidden group/btn"
                    style={{ fontFamily: "'Metal Mania'" }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500" />
                    <span className="relative z-10">EDIT</span>
                  </Button>

                  {communityData && (
                    <Button
                      onClick={() => setIsCommunityEditOpen(true)}
                      className="h-[44px] px-8 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-yellow-500/30 hover:border-yellow-400/60 hover:from-amber-500/30 hover:to-yellow-500/30 rounded-full font-bold text-yellow-400 text-base uppercase tracking-wider relative overflow-hidden group/btn"
                      style={{ fontFamily: "'Metal Mania'" }}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500" />
                      <span className="relative z-10 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Community
                      </span>
                    </Button>
                  )}

                  {evangelistData && (
                    <Button
                      onClick={() => setIsEvangelistEditOpen(true)}
                      className="h-[44px] px-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 hover:border-cyan-400/60 hover:from-cyan-500/30 hover:to-blue-500/30 rounded-full font-bold text-cyan-400 text-base uppercase tracking-wider relative overflow-hidden group/btn"
                      style={{ fontFamily: "'Metal Mania'" }}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500" />
                      <span className="relative z-10 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Evangelist
                      </span>
                    </Button>
                  )}

                  <Button
                    onClick={handleLogout}
                    className="h-[44px] px-8 bg-white/10 border border-white/30 hover:bg-white/20 rounded-full font-bold text-white text-base uppercase tracking-wider relative overflow-hidden group/btn"
                    style={{ fontFamily: "'Metal Mania'" }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500" />
                    <span className="relative z-10">LOG OUT</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Registered Events Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <h2
              className="text-center font-bold text-[32px] md:text-[48px] text-white mb-6 relative inline-block w-full uppercase tracking-wider"
              style={{ fontFamily: "'Metal Mania'" }}
            >
              Registered Events
              <div className="absolute bottom-0 left-1/2 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-[60%] -translate-x-1/2" />
            </h2>

            {registeredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
                {registeredEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="w-full max-w-[340px]"
                  >
                    <EventsCard
                      event_id={event.event_id!}
                      name={event.name}
                      image_url={event.image_url}
                      registration_fees={event.registration_fees}
                      registered={event.registered}
                      schedule={event.schedule}
                      team_details={event.team_details ?? null}
                      transaction_screenshot={
                        event.transaction_screenshot ?? null
                      }
                      transaction_verified={event.transaction_verified}
                      event_category_id={event.event_category_id}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-white mt-10">
                <p className="text-lg md:text-xl mb-6 text-white/70 animate-pulse font-[Maname]">
                  You have not registered for any event. Register now!
                </p>
                <div className="inline-block transition-transform hover:scale-105 active:scale-95">
                  <Button
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-lg px-8 py-3 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.3)] relative overflow-hidden uppercase tracking-wider group/browse"
                    style={{ fontFamily: "'Metal Mania'" }}
                    onClick={() => router.push('/#events')}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite_linear]" />
                    <span className="relative z-10">Browse Events</span>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <EditProfileDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        userData={userData}
        profileImage={profileImage}
        onSave={handleProfileSave}
        name={name}
      />

      <GoogleFormDialog
        open={isGoogleFormOpen}
        onProceed={handleGoogleFormProceed}
      />

      {communityData && (
        <EditCommunityDialog
          open={isCommunityEditOpen}
          onOpenChange={setIsCommunityEditOpen}
          communityData={communityData}
          onSaved={(updated) => setCommunityData(updated)}
        />
      )}

      {evangelistData && (
        <EditEvangelistDialog
          open={isEvangelistEditOpen}
          onOpenChange={setIsEvangelistEditOpen}
          evangelistData={evangelistData}
          onSaved={(updated) => setEvangelistData(updated)}
        />
      )}
    </div>
  );
}

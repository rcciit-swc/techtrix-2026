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
import EditProfileDialog from './EditProfileDialog';
import GoogleFormDialog from './GoogleFormDialog';
import ProfileSkeleton from './ProfileSkeleton';

export default function ProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGoogleFormOpen, setIsGoogleFormOpen] = useState(false);
  const { userData, userLoading, updateUserData, clearUserData } = useUser();
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
    </div>
  );
}

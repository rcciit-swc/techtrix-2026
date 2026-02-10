'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser, useEvents } from '@/lib/stores';
import { supabase } from '@/lib/supabase/client';
import { EditProfileDialog } from './EditProfileDialog';
import type { events } from '@/lib/types';
import EventsCard from '@/components/profile/EventCard';
import { toast } from 'sonner';
import { handleSaveChanges } from '@/lib/services/user';
import ProfileSkeleton from './ProfileSkeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { userData, userLoading, updateUserData, clearUserData } = useUser();
  const { eventsData } = useEvents();
  const [profileImage, setProfileImage] = useState<string>();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [name, setName] = useState<string>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [registeredEvents, setRegisteredEvents] = useState<events[]>([]);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.7]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const cb = searchParams.get('callback');
    const onboarding = searchParams.get('onboarding');
    if (cb && onboarding !== 'true') {
      router.replace(cb);
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (eventsData.length > 0) {
      setRegisteredEvents(eventsData.filter((event) => event.registered));
    }
  }, [eventsData]);

  useEffect(() => {
    if (searchParams.get('onboarding') === 'true') {
      setIsEditModalOpen(true);
      toast.info('Finish your profile first');
    }
  }, [searchParams]);

  useEffect(() => {
    const readUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user.user_metadata) {
        const meta = data.session.user.user_metadata;
        setName(meta.full_name);
        setProfileImage(meta.avatar_url);
      }
    };
    readUserSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('sb-session');
    clearUserData();
    router.push('/');
  };

  const handleProfileSave = async (formData: FormData) => {
    await handleSaveChanges(formData, userData, updateUserData, () => {
      setIsEditModalOpen(false);
      const cb = searchParams.get('callback');
      if (cb) {
        router.replace(cb);
      }
    });
  };

  if (userLoading) return <ProfileSkeleton />;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const cardHoverVariants = {
    rest: { scale: 1, rotateY: 0 },
    hover: {
      scale: 1.02,
      rotateY: 2,
      transition: {
        duration: 0.3,
      },
    },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
    tap: { scale: 0.95 },
  };

  return (
    <div
      className="min-h-screen relative rajdhanifont overflow-hidden"
      style={{
        backgroundImage: "url('/about/playerprofilebg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll',
      }}
    >
      {/* Animated Background Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(221, 91, 27, 0.1) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />

      <main className="pt-40 md:pt-32 pb-2 relative z-10">
        {/* Player Profile Title with Enhanced Animation */}
        <motion.h1
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
          }}
          style={{ opacity, scale }}
          className="text-center rajdhanifont font-bold text-[32px] md:text-[48px] text-white mb-6 md:mb-8 tracking-[-2px]"
        >
          <motion.span
            animate={{
              textShadow: [
                '0px 0px 20px rgba(221, 91, 27, 0.8)',
                '0px 0px 40px rgba(221, 91, 27, 0.6)',
                '0px 0px 20px rgba(221, 91, 27, 0.8)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            Player Profile
          </motion.span>
        </motion.h1>

        {/* Profile Card Container */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 60, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{
              duration: 0.8,
            }}
            whileHover="hover"
            variants={cardHoverVariants}
            className="backdrop-blur-[12.95px] rounded-[20px] p-5 md:p-6 relative overflow-hidden"
            style={{
              backgroundImage:
                'linear-gradient(168deg, rgba(0, 0, 0, 0.25) 5%, rgba(255, 255, 255, 0.25) 95%)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Animated Border Glow */}
            <motion.div
              className="absolute inset-0 rounded-[24px] pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(221, 91, 27, 0.5), transparent)',
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

            {/* Desktop Layout */}
            <motion.div
              className="hidden md:flex items-start gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Avatar with Pulse Animation */}
              <motion.div className="relative shrink-0" variants={itemVariants}>
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(221, 91, 27, 0.3)',
                      '0 0 40px rgba(221, 91, 27, 0.6)',
                      '0 0 20px rgba(221, 91, 27, 0.3)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="rounded-full"
                >
                  <Avatar className="w-[160px] h-[160px] border-3 border-white/10">
                    {!imageLoaded && (
                      <Skeleton className="w-full h-full rounded-full absolute inset-0" />
                    )}
                    <AvatarImage
                      src={profileImage || '/default-avatar.png'}
                      alt={userData?.name || 'Profile'}
                      onLoad={() => setImageLoaded(true)}
                      className={imageLoaded ? 'block object-cover' : 'hidden'}
                    />
                    <AvatarFallback className="bg-muted text-white text-4xl rajdhanifont">
                      {userData?.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              </motion.div>

              {/* User Info */}
              <div className="flex flex-col gap-6 items-start">
                <motion.div
                  className="flex flex-col gap-[7px] text-white text-center md:text-left"
                  variants={itemVariants}
                >
                  <motion.h2
                    className="rajdhanifont font-bold text-[28px] md:text-[36px] uppercase leading-tight"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    {userData?.name || name}
                  </motion.h2>
                  <motion.p
                    className="rajdhanifont font-medium text-[16px] md:text-[18px]"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {userData?.email}
                  </motion.p>
                  <motion.p
                    className="rajdhanifont font-medium text-[16px] md:text-[18px]"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    {userData?.phone}
                  </motion.p>
                </motion.div>

                {/* Buttons with Enhanced Animations */}
                <motion.div className="flex gap-4" variants={itemVariants}>
                  <motion.button
                    onClick={() => setIsEditModalOpen(true)}
                    className="h-[44px] w-[120px] bg-[#dd5b1b] rounded-[12px] shadow-[0px_4px_15px_rgba(0,0,0,0.25)] rajdhanifont font-semibold text-[#f2efe9] text-[18px] uppercase transition-colors relative overflow-hidden"
                    variants={buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                    <span className="relative z-10">EDIT</span>
                  </motion.button>
                  <motion.button
                    onClick={handleLogout}
                    className="h-[44px] w-[120px] bg-[#f2efe9] rounded-[12px] shadow-[0px_4px_15px_rgba(0,0,0,0.25)] rajdhanifont font-semibold text-black text-[18px] uppercase transition-colors relative overflow-hidden"
                    variants={buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                    <span className="relative z-10">LOG OUT</span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>

            {/* Mobile Layout */}
            <motion.div
              className="flex flex-col items-center md:hidden gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Avatar */}
              <motion.div variants={itemVariants}>
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(221, 91, 27, 0.3)',
                      '0 0 40px rgba(221, 91, 27, 0.6)',
                      '0 0 20px rgba(221, 91, 27, 0.3)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="rounded-full"
                >
                  <Avatar className="w-[160px] h-[160px] border-3 border-white/10">
                    {!imageLoaded && (
                      <Skeleton className="w-full h-full rounded-full absolute inset-0" />
                    )}
                    <AvatarImage
                      src={profileImage || '/default-avatar.png'}
                      alt={userData?.name || 'Profile'}
                      onLoad={() => setImageLoaded(true)}
                      className={imageLoaded ? 'block object-cover' : 'hidden'}
                    />
                    <AvatarFallback className="bg-muted text-white text-4xl rajdhanifont">
                      {userData?.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              </motion.div>

              {/* User Info */}
              <motion.div
                className="flex flex-col gap-[7px] text-white text-center w-full max-w-[321px]"
                variants={itemVariants}
              >
                <h2 className="rajdhanifont font-bold text-[26px] md:text-[32px] uppercase leading-tight">
                  {userData?.name || name}
                </h2>
                <p className="rajdhanifont font-medium text-[16px] md:text-[18px]">
                  {userData?.email}
                </p>
                <p className="rajdhanifont font-medium text-[16px] md:text-[18px]">
                  {userData?.phone}
                </p>
              </motion.div>

              {/* Buttons */}
              <motion.div
                className="flex flex-col gap-3 w-full max-w-[287px]"
                variants={itemVariants}
              >
                <motion.button
                  onClick={() => setIsEditModalOpen(true)}
                  className="h-[42px] w-full bg-[#dd5b1b] rounded-[12px] shadow-[0px_4px_15px_rgba(0,0,0,0.25)] rajdhanifont font-semibold text-[#f2efe9] text-[18px] uppercase transition-colors relative overflow-hidden"
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative z-10">EDIT</span>
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  className="h-[42px] w-full bg-[#f2efe9] rounded-[12px] shadow-[0px_4px_15px_rgba(0,0,0,0.25)] rajdhanifont font-semibold text-black text-[18px] uppercase transition-colors relative overflow-hidden"
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative z-10">LOG OUT</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Registered Events Section */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 md:mt-4"
          >
            {/* Section Title with Animated Underline */}
            <motion.h2
              className="text-center rajdhanifont font-bold text-[32px] md:text-[48px] text-white mb-8 md:mb-10 relative inline-block w-full"
              style={{
                textShadow: '0px 0px 15px #b60302, 0px 3px 0px #ff003c',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Registered Events
              <motion.span
                className="absolute bottom-0 left-1/2 h-1 bg-gradient-to-r from-transparent via-[#dd5b1b] to-transparent"
                initial={{ width: 0, x: '-50%' }}
                animate={{ width: '60%', x: '-50%' }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </motion.h2>

            {/* Events Grid */}
            {registeredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
                {registeredEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.6 + index * 0.1,
                    }}
                    whileHover={{
                      scale: 1.05,
                      y: -10,
                    }}
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
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                className="text-center text-white rajdhanifont mt-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.p
                  className="text-lg md:text-xl mb-6"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  You have not registered for any event. Register now!
                </motion.p>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="bg-[#dd5b1b] hover:bg-[#c94f15] text-[#f2efe9] rajdhanifont font-semibold text-lg px-8 py-3 rounded-[15px] relative overflow-hidden"
                    onClick={() => router.push('/events')}
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                        repeatDelay: 0.5,
                      }}
                    />
                    <span className="relative z-10">Browse Events</span>
                  </Button>
                </motion.div>
              </motion.div>
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
    </div>
  );
}
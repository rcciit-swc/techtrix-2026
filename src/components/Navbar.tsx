'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FloatingDock } from '@/components/ui/floating-dock';
import { login } from '@/lib/services/auth';
import { useUser } from '@/lib/stores';
import { supabase } from '@/lib/supabase/client';
import {
  IconCalendarEvent,
  IconHome,
  IconLogin,
  IconMessageCircle,
  IconPhoto,
  IconUsers,
} from '@tabler/icons-react';
import { Music, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMusicStore } from '@/lib/stores/useMusicStore';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { userData } = useUser();
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { isPlaying, toggleMusic } = useMusicStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user session only once on mount
  useEffect(() => {
    const readUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user.user_metadata?.avatar_url) {
        setProfileImage(data.session.user.user_metadata.avatar_url);
      }
    };
    readUserSession();
  }, []);

  const handleUserClick = () => {
    if (userData) {
      // If logged in, go to profile
      router.push('/profile');
    } else {
      // If not logged in, login
      login();
    }
  };

  const links = [
    {
      title: 'Home',
      icon: <IconHome className="h-full w-full text-[#00f7ff]" />,
      href: '/',
    },
    {
      title: 'Events',
      icon: <IconCalendarEvent className="h-full w-full text-[#00f7ff]" />,
      href: '/events',
    },
    {
      title: 'Gallery',
      icon: <IconPhoto className="h-full w-full text-[#00f7ff]" />,
      href: '/gallery',
    },
    {
      title: 'Teams',
      icon: <IconUsers className="h-full w-full text-[#00f7ff]" />,
      href: '/teams',
    },
    // {
    //   title: 'Partners',
    //   icon: <IconStar className="h-full w-full text-[#00f7ff]" />,
    //   href: '/#partners',
    // },
    {
      title: 'Contact',
      icon: <IconMessageCircle className="h-full w-full text-[#00f7ff]" />,
      href: '/contact',
    },
    {
      title: userData ? 'Profile' : 'Login',
      icon: userData ? (
        <Avatar className="h-full w-full">
          <AvatarImage src={profileImage || ''} alt="Profile" />
          <AvatarFallback className="bg-neutral-500 text-white text-xs">
            {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
      ) : (
        <IconLogin className="h-full w-full text-[#00f7ff]" />
      ),
      onClick: handleUserClick,
    },
  ];

  return (
    <>
      <button
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm border border-white/20 transition-all duration-300 group"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {mounted ? (
          isPlaying ? (
            <Music className="w-4 h-4 animate-pulse text-[#00f7ff]" />
          ) : (
            <VolumeX className="w-4 h-4 text-gray-400" />
          )
        ) : (
          <Music className="w-4 h-4 text-gray-400" />
        )}
      </button>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center w-full max-w-fit z-50">
        <div style={{ fontFamily: '"Exo-Black", sans-serif' }}>
          <FloatingDock items={links} />
        </div>
      </div>
    </>
  );
}

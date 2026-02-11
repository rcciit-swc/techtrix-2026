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
  IconUsers,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export function Navbar() {
  const { userData } = useUser();
  const [profileImage, setProfileImage] = useState<string | null>(null);

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
      window.location.href = '/profile';
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
      title: 'Teams',
      icon: <IconUsers className="h-full w-full text-[#00f7ff]" />,
      href: '/teams',
    },
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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center w-full max-w-fit z-50">
      <div style={{ fontFamily: '"Exo-Black", sans-serif' }}>
        <FloatingDock items={links} />
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { FloatingDock } from '@/components/ui/floating-dock';
import {
  IconHome,
  IconCalendarEvent,
  IconUsers,
  IconMessageCircle,
  IconLogin,
} from '@tabler/icons-react';
import { useUser } from '@/lib/stores';
import { supabase } from '@/lib/supabase/client';
import { login } from '@/lib/services/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '#',
    },
    {
      title: 'Events',
      icon: (
        <IconCalendarEvent className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '#',
    },
    {
      title: 'Teams',
      icon: (
        <IconUsers className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '#',
    },
    {
      title: 'Contact',
      icon: (
        <IconMessageCircle className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '#',
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
        <IconLogin className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: handleUserClick,
    },
  ];

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center w-full max-w-fit z-50">
      <div style={{ fontFamily: '"Exo-Black", sans-serif' }}>
        <FloatingDock mobileClassName="translate-y-20" items={links} />
      </div>
    </div>
  );
}

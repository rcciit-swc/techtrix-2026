'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FloatingDock } from '@/components/ui/floating-dock';
import { login } from '@/lib/services/auth';
import { useUser, useAuth } from '@/lib/stores';
import {
  IconCalendarEvent,
  IconHome,
  IconLogin,
  IconMessageCircle,
  IconPhoto,
  IconUsers,
} from '@tabler/icons-react';
import { Music, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function Navbar() {
  const { userData } = useUser();
  const { profileImage: authProfileImage } = useAuth();
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and handle audio playback
  useEffect(() => {
    audioRef.current = new Audio('/Theme.mp3');
    audioRef.current.loop = true;

    // Attempt to autoplay
    const playAudio = async () => {
      try {
        await audioRef.current?.play();
        setIsPlaying(true);
      } catch {
        // Autoplay was blocked
        setIsPlaying(false);
      }
    };

    playAudio();

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

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
      title: 'Gallery',
      icon: <IconPhoto className="h-full w-full text-[#00f7ff]" />,
      href: '/gallery',
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
          <AvatarImage src={authProfileImage || ''} alt="Profile" />
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
        {isPlaying ? (
          <Music className="w-4 h-4 animate-pulse text-[#00f7ff]" />
        ) : (
          <VolumeX className="w-4 h-4 text-gray-400" />
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

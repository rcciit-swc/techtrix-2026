'use client';

import { useMusicStore } from '@/lib/stores/useMusicStore';
import { useEffect, useRef, useState } from 'react';

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isPlaying } = useMusicStore();
  const [hasInteracted, setHasInteracted] = useState(false);

  // Handle initial interaction for autoplay restrictions
  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && hasInteracted) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Playback prevented:', error);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, hasInteracted]);

  return <audio ref={audioRef} src="/Theme.mp3" loop />;
}

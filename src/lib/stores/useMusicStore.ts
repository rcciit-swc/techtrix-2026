import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MusicState {
  isPlaying: boolean;
  toggleMusic: () => void;
  setPlaying: (playing: boolean) => void;
}

export const useMusicStore = create<MusicState>()(
  persist(
    (set) => ({
      isPlaying: false,
      toggleMusic: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setPlaying: (playing: boolean) => set({ isPlaying: playing }),
    }),
    {
      name: 'music-storage',
    }
  )
);

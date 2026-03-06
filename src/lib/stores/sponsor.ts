import { create } from 'zustand';

interface SponsorState {
  isVerified: boolean;
  isChecked: boolean;
  hasBeenShown: boolean;
}

interface SponsorActions {
  setVerified: (verified: boolean) => void;
  setChecked: (checked: boolean) => void;
  markShown: () => void;
}

export const useSponsor = create<SponsorState & SponsorActions>((set) => ({
  isVerified: false,
  isChecked: false,
  hasBeenShown: false,
  setVerified: (verified: boolean) => set({ isVerified: verified }),
  setChecked: (checked: boolean) => set({ isChecked: checked }),
  markShown: () => set({ hasBeenShown: true }),
}));

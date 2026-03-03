import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  profileImage: string | null;
  displayName: string | null;
  setAuth: (data: {
    userId: string;
    email: string;
    profileImage: string | null;
    displayName: string | null;
  }) => void;
  clearAuth: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  email: null,
  profileImage: null,
  displayName: null,
  setAuth: (data) =>
    set({
      isAuthenticated: true,
      userId: data.userId,
      email: data.email,
      profileImage: data.profileImage,
      displayName: data.displayName,
    }),
  clearAuth: () =>
    set({
      isAuthenticated: false,
      userId: null,
      email: null,
      profileImage: null,
      displayName: null,
    }),
}));

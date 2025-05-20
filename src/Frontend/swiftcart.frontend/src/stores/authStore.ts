import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthResponse } from '@/types/auth';

interface AuthState {
  token: string | null;
  user: AuthResponse['user'] | null;
  isAuthenticated: boolean;
  setAuth: (auth: AuthResponse | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (auth) =>
        set({
          token: auth?.token || null,
          user: auth?.user || null,
          isAuthenticated: !!auth,
        }),
      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
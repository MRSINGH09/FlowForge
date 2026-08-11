import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthSession, User } from "@/types";
import { STORAGE_KEYS } from "@/constants";
import { authApi } from "@/features/auth/api/authApi";

interface AuthState {
  session: AuthSession | null;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      isLoading: false,
      error: null,
      isHydrated: false,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const session = await authApi.login(email, password);
          set({ session, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      signup: async (name, email, password, confirmPassword) => {
        set({ isLoading: true, error: null });
        try {
          const session = await authApi.signup(name, email, password, confirmPassword);
          set({ session, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Signup failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => set({ session: null, error: null }),
      clearError: () => set({ error: null }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: STORAGE_KEYS.AUTH,
      partialize: (state) => ({ session: state.session }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

export const selectUser = (state: AuthState): User | null => state.session?.user ?? null;
export const selectIsAuthenticated = (state: AuthState): boolean => !!state.session;

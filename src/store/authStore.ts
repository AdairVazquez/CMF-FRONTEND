import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/auth";
import { getUserRole } from "@/types/auth";

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requires2FA: boolean;
  twoFactorToken: string | null;
}

interface AuthActions {
  setAuth: (user: User, token: string) => void;
  setRequires2FA: (twoFactorToken: string) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      requires2FA: false,
      twoFactorToken: null,

      setAuth: (user, token) => {
        setCookie("cmf_token", token);
        setCookie("cmf_role", getUserRole(user));
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          requires2FA: false,
          twoFactorToken: null,
        });
      },

      setRequires2FA: (twoFactorToken) =>
        set({
          requires2FA: true,
          twoFactorToken,
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      clearAuth: () => {
        deleteCookie("cmf_token");
        deleteCookie("cmf_role");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          requires2FA: false,
          twoFactorToken: null,
        });
      },
    }),
    { name: "cmf-auth" }
  )
);

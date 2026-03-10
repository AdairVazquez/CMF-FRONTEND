"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import apiClient from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { getRedirectByRole } from "@/types/auth";
import type {
  LoginRequest,
  LoginResponse,
  TwoFactorVerifyRequest,
  User,
} from "@/types/auth";
import type { ApiResponse } from "@/types/api";

/** Persiste el token 2FA en sessionStorage para sobrevivir la navegación client-side */
function save2FAToken(token: string) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("cmf_2fa_token", token);
  }
}

/** Lee el token 2FA: primero del store (in-memory), luego sessionStorage (fallback) */
function read2FAToken(): string {
  const storeToken = useAuthStore.getState().twoFactorToken;
  if (storeToken) return storeToken;
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("cmf_2fa_token") ?? "";
  }
  return "";
}

/** Limpia el token temporal tras verificación exitosa */
function clear2FAToken() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("cmf_2fa_token");
  }
}

export function useLogin() {
  const router = useRouter();
  const { setAuth, setRequires2FA } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) =>
      apiClient.post<never, ApiResponse<LoginResponse>>("/auth/login", data),
    onSuccess: (response) => {
      // ── DEBUG TEMPORAL ────────────────────────────────────────────
      console.log("LOGIN RESPONSE RAW:", response);
      console.log("LOGIN response.data:", response?.data);
      const data = response.data;
      console.log("requires_2fa:", data?.requires_2fa);
      console.log("requires_2fa_setup:", data?.requires_2fa_setup);
      console.log("token:", data?.token ? `${String(data.token).slice(0, 12)}...` : "(null/undefined)");
      console.log("user:", data?.user?.email ?? "(null)");
      // ── FIN DEBUG ─────────────────────────────────────────────────
      if ((data.requires_2fa_setup || data.requires_2fa) && data.token) {
        // Guardar ANTES del redirect — garantiza disponibilidad aunque Zustand tarde en hidratar
        save2FAToken(data.token);
        setRequires2FA(data.token);
        router.push("/two-factor");
      } else if (data.user && data.token) {
        setAuth(data.user, data.token);
        router.push(getRedirectByRole(data.user));
      }
    },
  });
}

export function useVerify2FA() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (code: string) => {
      // Leer token desde store (in-memory) o sessionStorage (fallback de hidratación)
      const token = read2FAToken();
      return apiClient.post<never, ApiResponse<LoginResponse>>(
        "/auth/two-factor/verify",
        { token, code } satisfies TwoFactorVerifyRequest
      );
    },
    onSuccess: (response) => {
      const data = response.data;
      if (data.user && data.token) {
        clear2FAToken(); // Limpiar el token temporal tras verificación exitosa
        setAuth(data.user, data.token);
        if (!data.is_setup) {
          toast.success("Verificación exitosa");
          router.push(getRedirectByRole(data.user));
        }
        // When is_setup=true, TwoFactorForm handles animation + redirect
      }
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { clearAuth, token } = useAuthStore();

  return useMutation({
    mutationFn: (): Promise<unknown> =>
      token ? apiClient.post("/auth/logout") : Promise.resolve(),
    onSettled: () => {
      clearAuth();
      router.push("/login");
    },
  });
}

export function useMe() {
  const { setAuth, token } = useAuthStore();

  return useMutation({
    mutationFn: () =>
      apiClient.get<never, ApiResponse<{ user: User }>>("/auth/me"),
    onSuccess: (response) => {
      if (response.data.user && token) {
        setAuth(response.data.user, token);
      }
    },
    onError: () => {
      useAuthStore.getState().clearAuth();
    },
  });
}

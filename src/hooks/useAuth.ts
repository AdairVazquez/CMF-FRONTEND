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

export function useLogin() {
  const router = useRouter();
  const { setAuth, setRequires2FA } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) =>
      apiClient.post<never, ApiResponse<LoginResponse>>("/auth/login", data),
    onSuccess: (response) => {
      const data = response.data;
      if (data.requires_2fa && data.token) {
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
  const { twoFactorToken, setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (code: string) =>
      apiClient.post<never, ApiResponse<LoginResponse>>(
        "/auth/two-factor/verify",
        { token: twoFactorToken ?? "", code } satisfies TwoFactorVerifyRequest
      ),
    onSuccess: (response) => {
      const data = response.data;
      if (data.user && data.token) {
        setAuth(data.user, data.token);
        toast.success("Verificación exitosa");
        router.push(getRedirectByRole(data.user));
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

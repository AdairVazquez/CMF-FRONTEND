"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import type {
  LoginRequest,
  LoginResponse,
  TwoFactorRequest,
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
      if (data.requires_2fa && data.two_factor_token) {
        setRequires2FA(data.two_factor_token);
        router.push("/two-factor");
      } else if (data.user && data.token) {
        setAuth(data.user, data.token);
        router.push("/dashboard");
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
        {
          code,
          two_factor_token: twoFactorToken ?? "",
        } satisfies TwoFactorRequest
      ),
    onSuccess: (response) => {
      const data = response.data;
      if (data.user && data.token) {
        setAuth(data.user, data.token);
        router.push("/dashboard");
      }
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { clearAuth, token } = useAuthStore();

  return useMutation({
    mutationFn: (): Promise<unknown> =>
      token
        ? apiClient.post("/auth/logout")
        : Promise.resolve(),
    onSettled: () => {
      clearAuth();
      router.push("/login");
    },
  });
}

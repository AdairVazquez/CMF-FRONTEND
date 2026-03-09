import axios from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const status = error.response?.status;
    const message: string =
      error.response?.data?.message ?? error.message ?? "Error de conexión";

    switch (status) {
      case 401:
        useAuthStore.getState().clearAuth();
        toast.error("Sesión expirada. Inicia sesión nuevamente.");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        break;
      case 403:
        toast.error("Sin permisos para realizar esta acción.");
        break;
      case 422: {
        const errors = error.response?.data?.errors as
          | Record<string, string[]>
          | undefined;
        const firstError = errors
          ? (Object.values(errors).flat()[0] as string)
          : message;
        return Promise.reject(new Error(firstError));
      }
      case 429:
        toast.warning("Demasiadas solicitudes. Espera un momento.");
        break;
      case 500:
        toast.error("Error del servidor. Intenta de nuevo.");
        break;
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;

/** Cliente sin Authorization (para endpoints públicos como /system/health) */
export const axiosPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1",
  timeout: 10000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

axiosPublic.interceptors.response.use(
  (response) => response.data,
  (error: unknown) => Promise.reject(error)
);

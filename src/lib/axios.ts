import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    if (error.response?.status === 422) {
      const errors = error.response.data?.errors;
      const firstError = errors
        ? Object.values(errors).flat()[0]
        : error.response.data?.message;
      return Promise.reject(new Error(firstError as string));
    }

    const message =
      error.response?.data?.message ??
      error.message ??
      "Error de conexión con el servidor";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;

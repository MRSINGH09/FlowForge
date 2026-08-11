import axios from "axios";
import { toast } from "sonner";
import { env } from "@/config/env";
import { ROUTES, STORAGE_KEYS } from "@/constants";

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const AUTH_PUBLIC_PATHS = ["/api/v1/auth/signIn", "/api/v1/auth/signup"];

let isHandlingUnauthorized = false;

function isAuthPublicRequest(url?: string): boolean {
  if (!url) return false;
  return AUTH_PUBLIC_PATHS.some((path) => url.includes(path));
}

async function handleUnauthorized() {
  if (typeof window === "undefined" || isHandlingUnauthorized) return;

  const path = window.location.pathname;
  if (path === ROUTES.LOGIN || path === ROUTES.SIGNUP) return;

  isHandlingUnauthorized = true;

  try {
    const { useAuthStore } = await import("@/store/authStore");
    useAuthStore.getState().logout();
  } catch {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  }

  toast.error("Session expired. Please sign in again.");
  window.location.assign(ROUTES.LOGIN);
}

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          state?: { session?: { token?: string } | null };
        };
        const token = parsed.state?.session?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // ignore malformed auth storage
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const requestUrl = String(error.config?.url ?? "");

    if (status === 401 && !isAuthPublicRequest(requestUrl)) {
      await handleUnauthorized();
    }

    return Promise.reject(error);
  }
);

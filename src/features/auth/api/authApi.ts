import axios from "axios";
import { api } from "@/services/api";
import type { AuthSession, User } from "@/types";

interface AuthApiUser {
  id?: string;
  name: string;
  email: string;
}

interface AuthApiResponse {
  message: string;
  user: AuthApiUser;
  token: string;
}

function toSession(data: AuthApiResponse): AuthSession {
  const user: User = {
    id: data.user.id ?? data.user.email,
    name: data.user.name,
    email: data.user.email,
  };

  return { user, token: data.token };
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { error?: string | { issues?: Array<{ message?: string }> }; message?: string }
      | undefined;

    if (typeof data?.error === "string") {
      return data.error;
    }

    const firstIssue = data?.error && typeof data.error === "object"
      ? data.error.issues?.[0]?.message
      : undefined;
    if (firstIssue) {
      return firstIssue;
    }

    if (typeof data?.message === "string") {
      return data.message;
    }

    return error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthSession> {
    try {
      const { data } = await api.post<AuthApiResponse>("/api/v1/auth/signIn", {
        email,
        password,
      });
      return toSession(data);
    } catch (error) {
      throw new Error(getErrorMessage(error, "Invalid email or password"));
    }
  },

  async signup(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<AuthSession> {
    try {
      const { data } = await api.post<AuthApiResponse>("/api/v1/auth/signup", {
        name,
        email,
        password,
        confirmPassword,
      });
      return toSession(data);
    } catch (error) {
      throw new Error(getErrorMessage(error, "Signup failed"));
    }
  },
};

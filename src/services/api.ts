import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const auth = localStorage.getItem("flowforge_auth");
    if (auth) {
      const session = JSON.parse(auth) as { token: string };
      config.headers.Authorization = `Bearer ${session.token}`;
    }
  }
  return config;
});

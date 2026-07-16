"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants";
import { selectIsAuthenticated, useAuthStore } from "@/store/authStore";
import { PageLoading } from "@/components/loading-spinner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated) {
    return <PageLoading />;
  }

  if (!isAuthenticated) {
    return <PageLoading label="Redirecting..." />;
  }

  return <>{children}</>;
}

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace(ROUTES.WORKFLOWS);
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated) {
    return <PageLoading />;
  }

  if (isAuthenticated) {
    return <PageLoading label="Redirecting..." />;
  }

  return <>{children}</>;
}

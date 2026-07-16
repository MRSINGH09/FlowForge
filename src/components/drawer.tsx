"use client";

import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose?: () => void;
  side?: "left" | "right";
  children: React.ReactNode;
  className?: string;
}

export function Drawer({ open, side = "right", children, className }: DrawerProps) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" />
      <div
        className={cn(
          "fixed inset-y-0 z-50 flex w-full max-w-sm flex-col border-border bg-card shadow-xl transition-transform lg:relative lg:z-auto lg:max-w-none lg:shadow-none",
          side === "right" ? "right-0 border-l" : "left-0 border-r",
          className
        )}
      >
        {children}
      </div>
    </>
  );
}

export function DrawerHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between border-b border-border px-4 py-3", className)}>
      {children}
    </div>
  );
}

export function DrawerContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex-1 overflow-y-auto p-4", className)}>{children}</div>;
}

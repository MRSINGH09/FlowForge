import { cn } from "@/lib/utils";

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function Sidebar({ children, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-64 shrink-0 flex-col border-r border-border bg-card",
        className
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({ children, className }: SidebarProps) {
  return (
    <div className={cn("flex h-14 items-center border-b border-border px-4", className)}>
      {children}
    </div>
  );
}

export function SidebarContent({ children, className }: SidebarProps) {
  return <div className={cn("flex-1 overflow-y-auto p-4", className)}>{children}</div>;
}

export function SidebarFooter({ children, className }: SidebarProps) {
  return (
    <div className={cn("border-t border-border p-4", className)}>{children}</div>
  );
}

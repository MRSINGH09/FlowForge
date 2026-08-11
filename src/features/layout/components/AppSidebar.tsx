"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Workflow as WorkflowIcon } from "lucide-react";
import { UserProfileMenu } from "@/features/auth/components/UserProfileMenu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { APP_NAME, ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Workflows",
    href: ROUTES.WORKFLOWS,
    icon: WorkflowIcon,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href={ROUTES.WORKFLOWS} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <WorkflowIcon className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold">{APP_NAME}</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start", !isActive && "text-muted-foreground")}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <UserProfileMenu />
      </SidebarFooter>
    </Sidebar>
  );
}

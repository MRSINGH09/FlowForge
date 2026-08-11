"use client";

import { useRouter } from "next/navigation";
import { ChevronsUpDown, LogOut, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/constants";
import { getUserInitials } from "@/lib/user";
import { selectUser, useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export function UserProfileMenu({ className }: { className?: string }) {
  const router = useRouter();
  const user = useAuthStore(selectUser);
  const logout = useAuthStore((s) => s.logout);

  if (!user) {
    return null;
  }

  const initials = getUserInitials(user.name, user.email);

  const handleLogout = () => {
    logout();
    router.replace(ROUTES.LOGIN);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-auto w-full justify-start gap-3 px-2 py-2 hover:bg-accent",
            className
          )}
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-sm font-medium leading-none">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-56" sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(ROUTES.PROFILE)}>
          <UserRound className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

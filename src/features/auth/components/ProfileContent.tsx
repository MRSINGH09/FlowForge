"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";
import { ROUTES } from "@/constants";
import { getUserInitials } from "@/lib/user";
import { selectUser, useAuthStore } from "@/store/authStore";

export function ProfileContent() {
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
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Profile"
        description="Manage your personal account details"
        className="mb-6"
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Full name</Label>
              <p className="text-sm font-medium">{user.name}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-muted-foreground">Email</Label>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-muted-foreground">User ID</Label>
              <p className="text-sm font-mono text-muted-foreground">{user.id}</p>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

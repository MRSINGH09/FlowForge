import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { ProfileContent } from "@/features/auth/components/ProfileContent";
import { AppShell } from "@/features/layout/components/AppShell";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <AppShell>
        <ProfileContent />
      </AppShell>
    </AuthGuard>
  );
}

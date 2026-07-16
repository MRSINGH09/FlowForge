import { GuestGuard } from "@/features/auth/components/AuthGuard";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <GuestGuard>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <LoginForm />
      </div>
    </GuestGuard>
  );
}

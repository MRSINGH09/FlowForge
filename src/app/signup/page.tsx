import { GuestGuard } from "@/features/auth/components/AuthGuard";
import { SignupForm } from "@/features/auth/components/SignupForm";

export default function SignupPage() {
  return (
    <GuestGuard>
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <SignupForm />
      </div>
    </GuestGuard>
  );
}

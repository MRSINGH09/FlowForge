import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { WorkflowDashboard } from "@/features/workflow/components/WorkflowDashboard";

export default function WorkflowsPage() {
  return (
    <AuthGuard>
      <WorkflowDashboard />
    </AuthGuard>
  );
}

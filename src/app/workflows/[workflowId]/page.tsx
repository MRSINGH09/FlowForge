"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { WorkflowEditor } from "@/features/canvas/components/WorkflowEditor";

export default function WorkflowEditorPage() {
  return (
    <AuthGuard>
      <ReactFlowProvider>
        <WorkflowEditor />
      </ReactFlowProvider>
    </AuthGuard>
  );
}

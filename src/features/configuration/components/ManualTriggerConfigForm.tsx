"use client";

import { z } from "zod";
import type { FlowNode } from "@/types";
import { ConfigForm, FormField, Textarea } from "@/features/configuration/components/ConfigForm";
import type { ManualTriggerConfig } from "@/types";

const schema = z.object({
  description: z.string(),
});

export function ManualTriggerConfigForm({ node }: { node: FlowNode }) {
  const config = node.data.config as ManualTriggerConfig;

  return (
    <ConfigForm nodeId={node.id} schema={schema} defaultValues={config}>
      {(form) => (
        <FormField label="Description" error={form.formState.errors.description?.message}>
          <Textarea
            {...form.register("description")}
            placeholder="Describe when to run this workflow..."
            rows={3}
          />
        </FormField>
      )}
    </ConfigForm>
  );
}

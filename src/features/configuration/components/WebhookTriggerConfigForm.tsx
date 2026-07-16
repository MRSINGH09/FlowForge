"use client";

import { z } from "zod";
import type { FlowNode, WebhookTriggerConfig } from "@/types";
import { ConfigForm, FormField, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/configuration/components/ConfigForm";

const schema = z.object({
  path: z.string().min(1, "Path is required"),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]),
});

export function WebhookTriggerConfigForm({ node }: { node: FlowNode }) {
  const config = node.data.config as WebhookTriggerConfig;

  return (
    <ConfigForm nodeId={node.id} schema={schema} defaultValues={config}>
      {(form) => (
        <>
          <FormField label="Webhook Path" error={form.formState.errors.path?.message}>
            <Input {...form.register("path")} placeholder="/webhook/my-flow" />
          </FormField>
          <FormField label="HTTP Method">
            <Select
              value={form.watch("method")}
              onValueChange={(v) => form.setValue("method", v as WebhookTriggerConfig["method"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["GET", "POST", "PUT", "DELETE"].map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </>
      )}
    </ConfigForm>
  );
}

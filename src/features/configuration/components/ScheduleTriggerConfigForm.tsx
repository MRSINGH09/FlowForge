"use client";

import { z } from "zod";
import type { FlowNode, ScheduleTriggerConfig } from "@/types";
import { ConfigForm, FormField, Input } from "@/features/configuration/components/ConfigForm";

const schema = z.object({
  cron: z.string().min(1, "Cron expression is required"),
  timezone: z.string().min(1, "Timezone is required"),
});

export function ScheduleTriggerConfigForm({ node }: { node: FlowNode }) {
  const config = node.data.config as ScheduleTriggerConfig;

  return (
    <ConfigForm nodeId={node.id} schema={schema} defaultValues={config}>
      {(form) => (
        <>
          <FormField label="Cron Expression" error={form.formState.errors.cron?.message}>
            <Input {...form.register("cron")} placeholder="0 * * * *" />
          </FormField>
          <FormField label="Timezone" error={form.formState.errors.timezone?.message}>
            <Input {...form.register("timezone")} placeholder="UTC" />
          </FormField>
        </>
      )}
    </ConfigForm>
  );
}

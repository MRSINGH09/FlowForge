"use client";

import { z } from "zod";
import type { FlowNode, NotificationConfig } from "@/types";
import {
  ConfigForm,
  FormField,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/configuration/components/ConfigForm";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string(),
  channel: z.enum(["email", "slack", "webhook"]),
});

export function NotificationConfigForm({ node }: { node: FlowNode }) {
  const config = node.data.config as NotificationConfig;

  return (
    <ConfigForm nodeId={node.id} schema={schema} defaultValues={config}>
      {(form) => (
        <>
          <FormField label="Title" error={form.formState.errors.title?.message}>
            <Input {...form.register("title")} />
          </FormField>
          <FormField label="Message">
            <Textarea {...form.register("message")} rows={4} />
          </FormField>
          <FormField label="Channel">
            <Select
              value={form.watch("channel")}
              onValueChange={(v) => form.setValue("channel", v as NotificationConfig["channel"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["email", "slack", "webhook"] as const).map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </>
      )}
    </ConfigForm>
  );
}

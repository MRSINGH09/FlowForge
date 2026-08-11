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
  channel: z.enum(["email", "slack", "webhook"]),
  title: z.string(),
  subject: z.string().optional(),
  message: z.string(),
  to: z.string().optional(),
  slackWebhookUrl: z.string().optional(),
  slackChannel: z.string().optional(),
  url: z.string().optional(),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]).optional(),
  headers: z.string().optional(),
  body: z.string().optional(),
});

export function NotificationConfigForm({ node }: { node: FlowNode }) {
  const config = node.data.config as NotificationConfig;

  return (
    <ConfigForm nodeId={node.id} schema={schema} defaultValues={config}>
      {(form) => {
        const channel = form.watch("channel");

        return (
          <>
            <FormField label="Channel">
              <Select
                value={channel}
                onValueChange={(v) =>
                  form.setValue("channel", v as NotificationConfig["channel"], {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["email", "slack", "webhook"] as const).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {channel === "email" && (
              <>
                <FormField label="To" error={form.formState.errors.to?.message}>
                  <Input
                    type="email"
                    {...form.register("to")}
                    placeholder="recipient@example.com"
                  />
                </FormField>
                <FormField label="Subject" error={form.formState.errors.subject?.message}>
                  <Input {...form.register("subject")} placeholder="Email subject" />
                </FormField>
                <FormField label="Message">
                  <Textarea
                    {...form.register("message")}
                    placeholder="Email body..."
                    rows={4}
                  />
                </FormField>
              </>
            )}

            {channel === "slack" && (
              <>
                <FormField label="Webhook URL">
                  <Input
                    {...form.register("slackWebhookUrl")}
                    placeholder="https://hooks.slack.com/services/..."
                  />
                </FormField>
                <FormField label="Channel">
                  <Input
                    {...form.register("slackChannel")}
                    placeholder="#general"
                  />
                </FormField>
                <FormField label="Title">
                  <Input {...form.register("title")} placeholder="Alert title" />
                </FormField>
                <FormField label="Message">
                  <Textarea
                    {...form.register("message")}
                    placeholder="Slack message..."
                    rows={4}
                  />
                </FormField>
              </>
            )}

            {channel === "webhook" && (
              <>
                <FormField label="URL">
                  <Input
                    {...form.register("url")}
                    placeholder="https://api.example.com/notify"
                  />
                </FormField>
                <FormField label="Method">
                  <Select
                    value={form.watch("method") ?? "POST"}
                    onValueChange={(v) =>
                      form.setValue(
                        "method",
                        v as NonNullable<NotificationConfig["method"]>,
                        { shouldDirty: true }
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["GET", "POST", "PUT", "PATCH", "DELETE"] as const).map(
                        (m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Headers (JSON)">
                  <Textarea
                    {...form.register("headers")}
                    placeholder='{"Content-Type": "application/json"}'
                    rows={3}
                  />
                </FormField>
                <FormField label="Body">
                  <Textarea
                    {...form.register("body")}
                    placeholder='{"event": "notification"}'
                    rows={4}
                  />
                </FormField>
              </>
            )}
          </>
        );
      }}
    </ConfigForm>
  );
}

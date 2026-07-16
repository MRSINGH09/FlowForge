"use client";

import { z } from "zod";
import type { FlowNode, HttpConfig } from "@/types";
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
  url: z.string().url("Please enter a valid URL"),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  headers: z.string(),
  body: z.string(),
  timeout: z.coerce.number().min(1000).max(120000),
});

export function HttpConfigForm({ node }: { node: FlowNode }) {
  const config = node.data.config as HttpConfig;

  return (
    <ConfigForm nodeId={node.id} schema={schema} defaultValues={config}>
      {(form) => (
        <>
          <FormField label="URL" error={form.formState.errors.url?.message}>
            <Input {...form.register("url")} placeholder="https://api.example.com" />
          </FormField>
          <FormField label="Method">
            <Select
              value={form.watch("method")}
              onValueChange={(v) => form.setValue("method", v as HttpConfig["method"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Headers (JSON)">
            <Textarea {...form.register("headers")} placeholder='{"Content-Type": "application/json"}' rows={3} />
          </FormField>
          <FormField label="Body">
            <Textarea {...form.register("body")} placeholder="Request body..." rows={4} />
          </FormField>
          <FormField label="Timeout (ms)" error={form.formState.errors.timeout?.message}>
            <Input type="number" {...form.register("timeout")} />
          </FormField>
        </>
      )}
    </ConfigForm>
  );
}

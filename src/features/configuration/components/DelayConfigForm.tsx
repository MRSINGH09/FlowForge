"use client";

import { z } from "zod";
import type { DelayConfig, FlowNode } from "@/types";
import {
  ConfigForm,
  FormField,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/configuration/components/ConfigForm";

const schema = z.object({
  duration: z.coerce.number().min(1, "Duration must be at least 1"),
  unit: z.enum(["seconds", "minutes", "hours"]),
});

export function DelayConfigForm({ node }: { node: FlowNode }) {
  const config = node.data.config as DelayConfig;

  return (
    <ConfigForm nodeId={node.id} schema={schema} defaultValues={config}>
      {(form) => (
        <>
          <FormField label="Duration" error={form.formState.errors.duration?.message}>
            <Input type="number" {...form.register("duration")} min={1} />
          </FormField>
          <FormField label="Unit">
            <Select
              value={form.watch("unit")}
              onValueChange={(v) => form.setValue("unit", v as DelayConfig["unit"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["seconds", "minutes", "hours"] as const).map((u) => (
                  <SelectItem key={u} value={u}>{u}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </>
      )}
    </ConfigForm>
  );
}

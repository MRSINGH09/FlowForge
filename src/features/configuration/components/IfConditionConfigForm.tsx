"use client";

import { z } from "zod";
import type { FlowNode, IfConditionConfig } from "@/types";
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
  field: z.string().min(1, "Field is required"),
  operator: z.enum(["equals", "not_equals", "contains", "greater_than", "less_than"]),
  value: z.string(),
});

const operatorLabels: Record<IfConditionConfig["operator"], string> = {
  equals: "Equals",
  not_equals: "Not equals",
  contains: "Contains",
  greater_than: "Greater than",
  less_than: "Less than",
};

export function IfConditionConfigForm({ node }: { node: FlowNode }) {
  const config = node.data.config as IfConditionConfig;

  return (
    <ConfigForm nodeId={node.id} schema={schema} defaultValues={config}>
      {(form) => (
        <>
          <FormField label="Field" error={form.formState.errors.field?.message}>
            <Input {...form.register("field")} placeholder="data.status" />
          </FormField>
          <FormField label="Operator">
            <Select
              value={form.watch("operator")}
              onValueChange={(v) =>
                form.setValue("operator", v as IfConditionConfig["operator"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(operatorLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Value">
            <Input {...form.register("value")} placeholder="active" />
          </FormField>
        </>
      )}
    </ConfigForm>
  );
}

"use client";

import { useEffect } from "react";
import { useForm, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { NodeConfig, NodeType } from "@/types";
import { useCanvasStore } from "@/store/canvasStore";

interface ConfigFormProps<T extends NodeConfig> {
  nodeId: string;
  schema: z.ZodType<T>;
  defaultValues: T;
  children: (form: ReturnType<typeof useForm<T>>) => React.ReactNode;
}

export function ConfigForm<T extends NodeConfig>({
  nodeId,
  schema,
  defaultValues,
  children,
}: ConfigFormProps<T>) {
  const updateNodeConfig = useCanvasStore((s) => s.updateNodeConfig);

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [nodeId, defaultValues, form]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      updateNodeConfig(nodeId, values as NodeConfig);
    });
    return () => subscription.unsubscribe();
  }, [form, nodeId, updateNodeConfig]);

  return <form className="space-y-4">{children(form)}</form>;
}

export function FormField({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export { Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
export type { NodeType };

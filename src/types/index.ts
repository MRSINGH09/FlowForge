import type { Edge, Node, Viewport } from "@xyflow/react";

export type NodeCategory = "trigger" | "action" | "logic";

export type NodeType =
  | "manualTrigger"
  | "webhookTrigger"
  | "scheduleTrigger"
  | "http"
  | "delay"
  | "notification"
  | "ifCondition";

export interface FlowNodeData extends Record<string, unknown> {
  label: string;
  type: NodeType;
  config: NodeConfig;
}

export type FlowNode = Node<FlowNodeData>;
export type FlowEdge = Edge;

export interface ViewportState extends Viewport {
  x: number;
  y: number;
  zoom: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  viewport: ViewportState;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

/* Node configuration types */

export interface ManualTriggerConfig {
  description: string;
}

export interface WebhookTriggerConfig {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
}

export interface ScheduleTriggerConfig {
  cron: string;
  timezone: string;
}

export interface HttpConfig {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers: string;
  body: string;
  timeout: number;
}

export interface DelayConfig {
  duration: number;
  unit: "seconds" | "minutes" | "hours";
}

export interface NotificationConfig {
  channel: "email" | "slack" | "webhook";
  title: string;
  message: string;
  /** Email subject line (used by backend email channel) */
  subject?: string;
  /** Email recipient */
  to?: string;
  /** Slack incoming webhook URL or channel */
  slackWebhookUrl?: string;
  slackChannel?: string;
  /** Webhook / HTTP-style delivery */
  url?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: string;
  body?: string;
}

export interface IfConditionConfig {
  field: string;
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than";
  value: string;
}

export type NodeConfig =
  | ManualTriggerConfig
  | WebhookTriggerConfig
  | ScheduleTriggerConfig
  | HttpConfig
  | DelayConfig
  | NotificationConfig
  | IfConditionConfig;

export interface NodeDefinition {
  type: NodeType;
  label: string;
  description: string;
  category: NodeCategory;
  icon: string;
  defaultConfig: NodeConfig;
  hasInput: boolean;
  hasOutput: boolean;
  maxOutputs?: number;
}

export interface HistoryEntry {
  nodes: FlowNode[];
  edges: FlowEdge[];
  timestamp: number;
}

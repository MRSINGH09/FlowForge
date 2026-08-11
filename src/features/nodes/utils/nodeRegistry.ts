import type {
  DelayConfig,
  HttpConfig,
  IfConditionConfig,
  ManualTriggerConfig,
  NodeConfig,
  NodeDefinition,
  NodeType,
  NotificationConfig,
  ScheduleTriggerConfig,
  WebhookTriggerConfig,
} from "@/types";
import { NODE_CATEGORIES } from "@/constants";

export const nodeDefinitions: Record<NodeType, NodeDefinition> = {
  manualTrigger: {
    type: "manualTrigger",
    label: "Manual Trigger",
    description: "Start workflow manually",
    category: NODE_CATEGORIES.TRIGGER,
    icon: "Play",
    defaultConfig: { description: "" } satisfies ManualTriggerConfig,
    hasInput: false,
    hasOutput: true,
  },
  webhookTrigger: {
    type: "webhookTrigger",
    label: "Webhook Trigger",
    description: "Start on HTTP webhook",
    category: NODE_CATEGORIES.TRIGGER,
    icon: "Webhook",
    defaultConfig: { path: "/webhook", method: "POST" } satisfies WebhookTriggerConfig,
    hasInput: false,
    hasOutput: true,
  },
  scheduleTrigger: {
    type: "scheduleTrigger",
    label: "Schedule Trigger",
    description: "Run on a cron schedule",
    category: NODE_CATEGORIES.TRIGGER,
    icon: "Clock",
    defaultConfig: { cron: "0 * * * *", timezone: "UTC" } satisfies ScheduleTriggerConfig,
    hasInput: false,
    hasOutput: true,
  },
  http: {
    type: "http",
    label: "HTTP Request",
    description: "Make an HTTP request",
    category: NODE_CATEGORIES.ACTION,
    icon: "Globe",
    defaultConfig: {
      url: "https://api.example.com",
      method: "GET",
      headers: "{}",
      body: "",
      timeout: 30000,
    } satisfies HttpConfig,
    hasInput: true,
    hasOutput: true,
  },
  delay: {
    type: "delay",
    label: "Delay",
    description: "Wait before continuing",
    category: NODE_CATEGORIES.ACTION,
    icon: "Timer",
    defaultConfig: { duration: 5, unit: "seconds" } satisfies DelayConfig,
    hasInput: true,
    hasOutput: true,
  },
  notification: {
    type: "notification",
    label: "Notification",
    description: "Send a notification",
    category: NODE_CATEGORIES.ACTION,
    icon: "Bell",
    defaultConfig: {
      channel: "email",
      title: "Notification",
      subject: "",
      message: "",
      to: "",
      slackWebhookUrl: "",
      slackChannel: "",
      url: "https://api.example.com/notify",
      method: "POST",
      headers: '{"Content-Type": "application/json"}',
      body: "",
    } satisfies NotificationConfig,
    hasInput: true,
    hasOutput: true,
  },
  ifCondition: {
    type: "ifCondition",
    label: "If Condition",
    description: "Branch based on condition",
    category: NODE_CATEGORIES.LOGIC,
    icon: "GitBranch",
    defaultConfig: {
      field: "",
      operator: "equals",
      value: "",
    } satisfies IfConditionConfig,
    hasInput: true,
    hasOutput: true,
    maxOutputs: 2,
  },
};

export function getNodeDefinition(type: NodeType): NodeDefinition {
  return nodeDefinitions[type];
}

export function getNodesByCategory(category: NodeDefinition["category"]): NodeDefinition[] {
  return Object.values(nodeDefinitions).filter((def) => def.category === category);
}

export function getDefaultConfig(type: NodeType): NodeConfig {
  return structuredClone(nodeDefinitions[type].defaultConfig);
}

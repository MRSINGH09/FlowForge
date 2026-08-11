export const STORAGE_KEYS = {
  AUTH: "flowforge_auth",
  THEME: "flowforge_theme",
} as const;

export const APP_NAME = "FlowForge";

export const ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  WORKFLOWS: "/workflows",
  PROFILE: "/profile",
  WORKFLOW_EDITOR: (id: string) => `/workflows/${id}`,
} as const;

export const NODE_CATEGORIES = {
  TRIGGER: "trigger",
  ACTION: "action",
  LOGIC: "logic",
} as const;

export const DEFAULT_VIEWPORT = {
  x: 0,
  y: 0,
  zoom: 1,
} as const;

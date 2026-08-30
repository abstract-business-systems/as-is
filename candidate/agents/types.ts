export const ROLE_IDS = [
  "implementer",
  "worker",
  "planning-adviser",
  "external-adviser",
] as const;

export type RoleId = (typeof ROLE_IDS)[number];

export const THINKING_LEVELS = [
  "off",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
] as const;

export type ThinkingLevel = (typeof THINKING_LEVELS)[number];

export const REQUIRED_TOOLS: Readonly<Record<RoleId, readonly string[]>> = {
  implementer: ["read", "grep", "find", "ls", "bash", "edit", "write"],
  worker: ["read", "grep", "find", "ls", "edit", "write"],
  "planning-adviser": [],
  "external-adviser": [],
};

export interface AgentContract {
  readonly role: RoleId;
  readonly description: string;
  readonly modelSpec: string;
  readonly model: string;
  readonly thinking: ThinkingLevel;
  readonly tools: readonly string[];
  readonly systemPrompt: string;
}

export interface RuntimeConfig {
  readonly schemaVersion?: number;
  readonly defaultProvider: string;
  readonly aliases: Readonly<Record<string, string>>;
}

export interface RouteEntry {
  readonly role: RoleId;
  readonly provider: string;
  readonly model: string;
  readonly supportedThinkingLevels: readonly ThinkingLevel[];
  readonly maximumBudgetReserve?: number;
}

export interface RoutePolicy {
  readonly version: string;
  readonly routes: readonly RouteEntry[];
}

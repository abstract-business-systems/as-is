import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import type { RuntimeConfig } from "./types";

export const DEFAULT_CONFIG: RuntimeConfig = {
  schemaVersion: 1,
  defaultProvider: "openrouter",
  aliases: {
    implementer: "google/gemini-3.7-flash",
    worker: "z-ai/glm-5.3-flash",
    "planning-adviser": "openai/gpt-5.6-sol",
    "external-adviser": "moonshotai/kimi-k3",
  },
};

/**
 * Load runtime configuration from a JSON file.
 */
export async function loadRuntimeConfig(configPath?: string): Promise<RuntimeConfig> {
  const target = configPath ? resolve(configPath) : join(import.meta.dir, "config.json");
  try {
    const raw = await readFile(target, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    return parseRuntimeConfig(parsed);
  } catch (error) {
    if (!configPath && error instanceof Error && "code" in error && error.code === "ENOENT") {
      return DEFAULT_CONFIG;
    }
    throw error;
  }
}

/**
 * Parse and validate runtime configuration.
 */
export function parseRuntimeConfig(data: unknown): RuntimeConfig {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("runtime config must be a JSON object");
  }
  const obj = data as Record<string, unknown>;
  const rawAliases = (obj.aliases ?? obj.models ?? {}) as Record<string, unknown>;
  if (typeof rawAliases !== "object" || rawAliases === null || Array.isArray(rawAliases)) {
    throw new Error("runtime config aliases must be an object");
  }
  const aliases: Record<string, string> = {};
  for (const [key, value] of Object.entries(rawAliases)) {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`invalid model alias target for '${key}'`);
    }
    aliases[key.trim()] = value.trim();
  }
  return {
    schemaVersion: typeof obj.schemaVersion === "number" ? obj.schemaVersion : 1,
    defaultProvider:
      typeof obj.defaultProvider === "string" && obj.defaultProvider.trim()
        ? obj.defaultProvider.trim()
        : "openrouter",
    aliases,
  };
}

/**
 * Resolve a model identifier from a model name or alias.
 */
export function resolveModelFromConfig(
  modelOrAlias: string,
  config: RuntimeConfig = DEFAULT_CONFIG
): string {
  const trimmed = modelOrAlias.trim();
  if (config.aliases[trimmed]) {
    return config.aliases[trimmed];
  }
  if (isExactOpenRouterModel(trimmed)) {
    return trimmed;
  }
  throw new Error(`unrecognized model identifier or alias: '${trimmed}'`);
}

export function isExactOpenRouterModel(value: string): boolean {
  return /^[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._-]*$/.test(value);
}

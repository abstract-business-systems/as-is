import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { DEFAULT_CONFIG, loadRuntimeConfig, resolveModelFromConfig } from "./config";
import {
  ROLE_IDS,
  THINKING_LEVELS,
  REQUIRED_TOOLS,
  type RoleId,
  type ThinkingLevel,
  type AgentContract,
  type RuntimeConfig,
  type RoutePolicy,
} from "./types";

const CONTRACT_FIELDS = ["name", "description", "model", "thinking", "tools"] as const;

function parseTools(toolsLine: string): readonly string[] {
  const trimmed = toolsLine.trim();
  if (!trimmed) return [];
  return trimmed
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function sameValues(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  return b.every((item) => setA.has(item));
}

/**
 * Parse agent.md frontmatter and markdown body into an AgentContract.
 */
export function parseRoleContract(
  source: string,
  expectedRole?: RoleId,
  config: RuntimeConfig = DEFAULT_CONFIG
): AgentContract {
  const normalized = source.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) {
    throw new Error("role contract must start with frontmatter");
  }
  const closingDelimiter = normalized.indexOf("\n---\n", 4);
  if (closingDelimiter < 0) {
    throw new Error("role contract frontmatter is not terminated");
  }

  const fields = new Map<string, string>();
  for (const line of normalized.slice(4, closingDelimiter).split("\n")) {
    const match = /^([a-z]+):(?: ?(.*))?$/.exec(line);
    if (!match) throw new Error("invalid role contract frontmatter line");
    const [, key, value = ""] = match;
    if (!(CONTRACT_FIELDS as readonly string[]).includes(key)) {
      throw new Error(`unknown role contract field: ${key}`);
    }
    if (fields.has(key)) throw new Error(`duplicate role contract field: ${key}`);
    fields.set(key, value);
  }

  for (const key of CONTRACT_FIELDS) {
    if (!fields.has(key)) throw new Error(`missing role contract field: ${key}`);
  }

  const role = fields.get("name")!;
  if (!ROLE_IDS.includes(role as RoleId)) {
    throw new Error(`unknown role contract name: ${role}`);
  }
  if (expectedRole && role !== expectedRole) {
    throw new Error(`role contract name '${role}' does not match expected role '${expectedRole}'`);
  }

  const description = fields.get("description")!;
  if (!description.trim()) throw new Error("role contract description is empty");

  const modelSpec = fields.get("model")!;
  const model = resolveModelFromConfig(modelSpec, config);

  const thinking = fields.get("thinking")!;
  if (!THINKING_LEVELS.includes(thinking as ThinkingLevel)) {
    throw new Error(`invalid role contract thinking level: ${thinking}`);
  }

  const tools = parseTools(fields.get("tools")!);
  const typedRole = role as RoleId;
  if (!sameValues(tools, REQUIRED_TOOLS[typedRole])) {
    throw new Error(`role contract tools violate ${typedRole} boundary`);
  }

  const systemPrompt = normalized.slice(closingDelimiter + "\n---\n".length).trim();
  if (!systemPrompt) throw new Error("role contract system prompt is empty");

  return {
    role: typedRole,
    description,
    modelSpec,
    model,
    thinking: thinking as ThinkingLevel,
    tools,
    systemPrompt,
  };
}

/**
 * Load one named contract from its canonical agents/<role>/agent.md path.
 */
export async function loadRoleContract(
  agentsDirectory: string,
  role: RoleId,
  config?: RuntimeConfig
): Promise<AgentContract> {
  if (!ROLE_IDS.includes(role)) throw new Error(`unknown role contract name: ${role}`);
  const root = resolve(agentsDirectory);
  const path = resolve(root, role, "agent.md");
  if (!path.startsWith(`${root}/`)) throw new Error("invalid role contract path");
  const effectiveConfig = config ?? (await loadRuntimeConfig(resolve(root, "config.json")));
  return parseRoleContract(await readFile(path, "utf8"), role, effectiveConfig);
}

/**
 * Load and validate the complete locked role-contract set.
 */
export async function loadRoleContracts(
  agentsDirectory: string,
  config?: RuntimeConfig
): Promise<ReadonlyMap<RoleId, AgentContract>> {
  const root = resolve(agentsDirectory);
  const effectiveConfig = config ?? (await loadRuntimeConfig(resolve(root, "config.json")));
  const contracts = new Map<RoleId, AgentContract>();
  for (const role of ROLE_IDS) {
    contracts.set(role, await loadRoleContract(agentsDirectory, role, effectiveConfig));
  }
  return contracts;
}

/**
 * Build a RoutePolicy from an iterable of AgentContracts.
 */
export function routePolicyFromContracts(
  contracts: Iterable<AgentContract>,
  version = "candidate-route-v1"
): RoutePolicy {
  return {
    version,
    routes: [...contracts].map((contract) => ({
      role: contract.role,
      provider: "openrouter",
      model: contract.model,
      supportedThinkingLevels: [contract.thinking],
      maximumBudgetReserve: 1,
    })),
  };
}

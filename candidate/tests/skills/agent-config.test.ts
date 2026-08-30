import { describe, it, expect } from "bun:test";
import { resolve } from "node:path";
import {
  DEFAULT_CONFIG,
  loadRuntimeConfig,
  parseRuntimeConfig,
  resolveModelFromConfig,
  parseRoleContract,
  loadRoleContract,
  loadRoleContracts,
  routePolicyFromContracts,
  ROLE_IDS,
  type AgentContract,
} from "../../agents";

describe("Candidate Agent Contracts and Configuration", () => {
  const agentsDir = resolve(import.meta.dir, "../../agents");

  it("loads and parses the default runtime config", async () => {
    const config = await loadRuntimeConfig(resolve(agentsDir, "config.json"));
    expect(config.defaultProvider).toBe("openrouter");
    expect(config.aliases.implementer).toBe("google/gemini-3.7-flash");
    expect(config.aliases.worker).toBe("z-ai/glm-5.3-flash");
    expect(config.aliases["planning-adviser"]).toBe("openai/gpt-5.6-sol");
    expect(config.aliases["external-adviser"]).toBe("moonshotai/kimi-k3");
  });

  it("resolves model aliases to exact OpenRouter model strings", () => {
    expect(resolveModelFromConfig("implementer", DEFAULT_CONFIG)).toBe("google/gemini-3.7-flash");
    expect(resolveModelFromConfig("worker", DEFAULT_CONFIG)).toBe("z-ai/glm-5.3-flash");
    expect(resolveModelFromConfig("planning-adviser", DEFAULT_CONFIG)).toBe("openai/gpt-5.6-sol");
    expect(resolveModelFromConfig("external-adviser", DEFAULT_CONFIG)).toBe("moonshotai/kimi-k3");
    // Direct exact model name should pass through
    expect(resolveModelFromConfig("anthropic/claude-3.7-sonnet", DEFAULT_CONFIG)).toBe(
      "anthropic/claude-3.7-sonnet"
    );
  });

  it("loads and validates all four locked agent role contracts from candidate/agents/", async () => {
    const contracts = await loadRoleContracts(agentsDir);
    expect(contracts.size).toBe(4);

    for (const roleId of ROLE_IDS) {
      const contract = contracts.get(roleId);
      expect(contract).toBeDefined();
      expect(contract!.role).toBe(roleId);
      expect(contract!.thinking).toBe("high");
      expect(contract!.model).toBeTruthy();
    }

    // Check specific tools
    const implementer = contracts.get("implementer")!;
    expect(implementer.tools).toEqual(["read", "grep", "find", "ls", "bash", "edit", "write"]);
    expect(implementer.model).toBe("google/gemini-3.7-flash");

    const worker = contracts.get("worker")!;
    expect(worker.tools).toEqual(["read", "grep", "find", "ls", "edit", "write"]);
    expect(worker.model).toBe("z-ai/glm-5.3-flash");

    const planningAdviser = contracts.get("planning-adviser")!;
    expect(planningAdviser.tools).toEqual([]);
    expect(planningAdviser.model).toBe("openai/gpt-5.6-sol");

    const externalAdviser = contracts.get("external-adviser")!;
    expect(externalAdviser.tools).toEqual([]);
    expect(externalAdviser.model).toBe("moonshotai/kimi-k3");
  });

  it("builds a valid RoutePolicy from contracts", async () => {
    const contracts = await loadRoleContracts(agentsDir);
    const policy = routePolicyFromContracts(contracts.values(), "candidate-v1");

    expect(policy.version).toBe("candidate-v1");
    expect(policy.routes.length).toBe(4);
    const implementerRoute = policy.routes.find((r) => r.role === "implementer");
    expect(implementerRoute?.provider).toBe("openrouter");
    expect(implementerRoute?.model).toBe("google/gemini-3.7-flash");
    expect(implementerRoute?.supportedThinkingLevels).toEqual(["high"]);
  });

  it("fails validation when role contract has missing frontmatter or invalid fields", () => {
    expect(() => parseRoleContract("No frontmatter here")).toThrow(
      "role contract must start with frontmatter"
    );

    const invalidRole = `---
name: unknown-role
description: test
model: google/gemini-3.7-flash
thinking: high
tools: read
---
Prompt`;
    expect(() => parseRoleContract(invalidRole)).toThrow("unknown role contract name");

    const invalidThinking = `---
name: implementer
description: test
model: google/gemini-3.7-flash
thinking: ultra-extreme
tools: read, grep, find, ls, bash, edit, write
---
Prompt`;
    expect(() => parseRoleContract(invalidThinking)).toThrow("invalid role contract thinking level");

    const toolViolation = `---
name: worker
description: test
model: z-ai/glm-5.3-flash
thinking: high
tools: read, bash
---
Prompt`;
    expect(() => parseRoleContract(toolViolation)).toThrow("role contract tools violate worker boundary");
  });
});

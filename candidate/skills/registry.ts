import type { AgentContract } from "../agents/types";
import type {
  CapabilityValidationResult,
  CompositionVariant,
  MasterSkill,
  ReusableSkill,
  ToolName,
} from "./types";

export class SkillRegistry {
  private readonly reusableSkills = new Map<string, ReusableSkill>();
  private readonly masterSkills = new Map<string, MasterSkill>();

  registerReusable(skill: ReusableSkill): void {
    if (this.reusableSkills.has(skill.name)) {
      throw new Error(`Reusable skill '${skill.name}' is already registered`);
    }
    this.reusableSkills.set(skill.name, skill);
  }

  registerMaster(skill: MasterSkill): void {
    if (this.masterSkills.has(skill.name)) {
      throw new Error(`Master skill '${skill.name}' is already registered`);
    }
    this.masterSkills.set(skill.name, skill);
  }

  getReusable<TInput = unknown, TOutput = unknown>(
    name: string
  ): ReusableSkill<TInput, TOutput> | undefined {
    return this.reusableSkills.get(name) as ReusableSkill<TInput, TOutput> | undefined;
  }

  getMaster<TInput = unknown, TOutput = unknown>(
    name: string
  ): MasterSkill<TInput, TOutput> | undefined {
    return this.masterSkills.get(name) as MasterSkill<TInput, TOutput> | undefined;
  }

  listReusableSkills(): readonly ReusableSkill[] {
    return Array.from(this.reusableSkills.values());
  }

  listMasterSkills(): readonly MasterSkill[] {
    return Array.from(this.masterSkills.values());
  }

  /**
   * Validate that an agent's declared toolset satisfies all required tools of a skill or composition.
   */
  validateAgentCapabilities(
    agent: AgentContract,
    target: ReusableSkill | MasterSkill | CompositionVariant
  ): CapabilityValidationResult {
    let requiredTools: readonly ToolName[] = [];

    if ("skillClass" in target && target.skillClass === "reusable") {
      requiredTools = target.requiredTools;
    } else if ("skillClass" in target && target.skillClass === "master") {
      const defaultVar = target.variants[target.defaultVariant];
      requiredTools = defaultVar ? defaultVar.requiredTools : [];
    } else if ("steps" in target) {
      requiredTools = target.requiredTools;
    }

    const agentToolSet = new Set(agent.tools);
    const missing = requiredTools.filter((t) => !agentToolSet.has(t));

    if (missing.length > 0) {
      return {
        eligible: false,
        missingTools: missing,
        reason: `Agent '${agent.role}' lacks required tools: [${missing.join(", ")}]`,
      };
    }

    return {
      eligible: true,
      missingTools: [],
    };
  }
}

import type { AgentContract } from "../agents/types";
import type {
  CapabilityValidationResult,
  CompositionVariant,
  MasterSkill,
  ReusableSkill,
  ToolName,
} from "./types";

import { buildingContextSkill } from "./reusable/building-context";
import { contextBuildingSkill } from "./reusable/context-building";
import { resolvingScopesSkill } from "./reusable/resolving-scopes";
import { identifyingOwnersSkill } from "./reusable/identifying-owners";
import { locatingChangelogsSkill } from "./reusable/locating-changelogs";
import { choosingNamesSkill } from "./reusable/choosing-names";
import { namingSoftwareConceptsSkill } from "./reusable/naming-software-concepts";
import { structuringContentSkill } from "./reusable/structuring-content";
import { draftingContentSkill } from "./reusable/drafting-content";
import { writingCodeSkill } from "./reusable/writing-code";
import { applyingBoundedEditsSkill } from "./reusable/applying-bounded-edits";
import { writingTestsSkill } from "./reusable/writing-tests";
import { runningTestsSkill } from "./reusable/running-tests";
import { validatingChangesSkill } from "./reusable/validating-changes";
import { verificationDisciplineSkill } from "./reusable/verification-discipline";
import { recordingEvidenceSkill } from "./reusable/recording-evidence";
import { designingDiagramsSkill } from "./reusable/designing-diagrams";
import { renderingDiagramsSkill } from "./reusable/rendering-diagrams";
import { inspectingExecutionEvidenceSkill } from "./reusable/inspecting-execution-evidence";
import { assessingDeterminismSkill } from "./reusable/assessing-determinism";
import { recordingBacklogItemsSkill } from "./reusable/recording-backlog-items";
import { draftingChangelogEntriesSkill } from "./reusable/drafting-changelog-entries";
import { delegatingBoundedWorkSkill } from "./reusable/delegating-bounded-work";
import { observingDelegatedWorkSkill } from "./reusable/observing-delegated-work";
import { preparingScopedCommitsSkill } from "./reusable/preparing-scoped-commits";
import { presentingDecisionsSkill } from "./reusable/presenting-decisions";
import { choosingChangeMethodsSkill } from "./reusable/choosing-change-methods";

import { makingChangesMasterSkill } from "./compositions/making-changes";
import { buildingComponentsMasterSkill } from "./compositions/building-components";
import { implementingTasksMasterSkill } from "./compositions/implementing-tasks";
import { maintainingComponentsMasterSkill } from "./compositions/maintaining-components";
import { managingAsIsRecordsMasterSkill } from "./compositions/managing-as-is-records";
import { designingMermaidDiagramsMasterSkill } from "./compositions/designing-mermaid-diagrams";
import { managingBacklogsMasterSkill } from "./compositions/managing-backlogs";
import { managingChangelogsMasterSkill } from "./compositions/managing-changelogs";
import { spawningSubagentsMasterSkill } from "./compositions/spawning-subagents";
import { exploringExecutionEvidenceMasterSkill } from "./compositions/exploring-execution-evidence";
import { consultingHumansMasterSkill } from "./compositions/consulting-humans";
import { committingCompletedWorkMasterSkill } from "./compositions/committing-completed-work";

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

/**
 * Create a SkillRegistry pre-populated with all reusable skills and master skills.
 */
export function createDefaultSkillRegistry(): SkillRegistry {
  const registry = new SkillRegistry();

  const reusableSkills: ReusableSkill[] = [
    buildingContextSkill,
    resolvingScopesSkill,
    identifyingOwnersSkill,
    locatingChangelogsSkill,
    choosingNamesSkill,
    structuringContentSkill,
    draftingContentSkill,
    writingCodeSkill,
    applyingBoundedEditsSkill,
    writingTestsSkill,
    runningTestsSkill,
    validatingChangesSkill,
    recordingEvidenceSkill,
    designingDiagramsSkill,
    renderingDiagramsSkill,
    inspectingExecutionEvidenceSkill,
    assessingDeterminismSkill,
    recordingBacklogItemsSkill,
    draftingChangelogEntriesSkill,
    delegatingBoundedWorkSkill,
    observingDelegatedWorkSkill,
    preparingScopedCommitsSkill,
    presentingDecisionsSkill,
    choosingChangeMethodsSkill,
  ];
  for (const skill of reusableSkills) {
    registry.registerReusable(skill);
  }

  const masterSkills: MasterSkill[] = [
    makingChangesMasterSkill,
    buildingComponentsMasterSkill,
    implementingTasksMasterSkill,
    maintainingComponentsMasterSkill,
    managingAsIsRecordsMasterSkill,
    designingMermaidDiagramsMasterSkill,
    managingBacklogsMasterSkill,
    managingChangelogsMasterSkill,
    spawningSubagentsMasterSkill,
    exploringExecutionEvidenceMasterSkill,
    consultingHumansMasterSkill,
    committingCompletedWorkMasterSkill,
  ];
  for (const master of masterSkills) {
    registry.registerMaster(master);
  }

  return registry;
}

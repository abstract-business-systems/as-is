/**
 * Candidate Test Fixtures - Plan Builder
 */

import type {
  PlanEnvelope,
  ChildPlanEntry,
  DependencyGraph,
  PlanFreshness,
  NonGoalEntry,
} from "../execution-control/types";
import {
  ACCEPTED_TARGET_DESIGN_SHA256,
  ACCEPTED_TARGET_PACKET_DIGEST,
} from "../execution-control/admission";
import type { RepositoryContext } from "../execution-control/admission";

export function createValidChildEntry(
  id: string,
  componentKey: string,
  overrides?: Partial<ChildPlanEntry>
): ChildPlanEntry {
  return {
    id,
    childAnchor: `${componentKey}/as-is.md`,
    componentKey,
    boundedOutcome: `Implement bounded functionality for ${componentKey}`,
    scopeAllowlist: [`${componentKey}/src/**`, `${componentKey}/tests/**`],
    dependencies: [],
    protectedInputs: ["core/contracts/**", "AGENTS.md"],
    worker: {
      role: "worker",
      model: "z-ai/glm-5.3-flash",
      capabilities: ["read", "grep", "find", "ls", "edit", "write"],
    },
    budget: {
      allocatedUnits: 10,
      maxWallClockSeconds: 300,
      reserveUnits: 2,
    },
    acceptance: ["All unit tests pass", "Zero regressions"],
    validation: ["bun test"],
    recovery: ["Revert worktree on failure"],
    escalation: ["Escalate to implementer on ambiguous contract"],
    integrationDeclaration: {
      strategy: "worktree-merge",
      expectedParentBase: "git-commit-base-001",
    },
    ...overrides,
  };
}

export function createValidPlanEnvelope(overrides?: Partial<PlanEnvelope>): PlanEnvelope {
  const children = overrides?.children ?? [
    createValidChildEntry("child-task-control", "core/modules/task-control"),
    createValidChildEntry("child-process-adapter", "core/adapters/process"),
  ];

  const defaultDepGraph: DependencyGraph = overrides?.dependencyGraph ?? {
    nodes: children.map((c) => c.id),
    edges: [],
    independenceClassification: Object.fromEntries(
      children.map((c) => [c.id, "independent"])
    ),
  };

  const defaultFreshness: PlanFreshness = overrides?.freshness ?? {
    parentRecordRevision: "parent-rev-1",
    childRecordRevisions: Object.fromEntries(
      children.map((c) => [c.componentKey, "rev-10"])
    ),
    expectedParentBase: "git-commit-base-001",
  };

  const defaultNonGoals: NonGoalEntry[] = [
    {
      id: "ng-1",
      description: "Distributed cluster scheduling",
      disposition: "deferred",
    },
  ];

  return {
    planRevision: "plan-rev-20260830-001",
    acceptedEnvelope: {
      targetPacketDigest: ACCEPTED_TARGET_PACKET_DIGEST,
      targetDesignSha256: ACCEPTED_TARGET_DESIGN_SHA256,
    },
    parent: {
      componentKey: "core",
      anchorPath: "core/as-is.md",
      taskRevision: "parent-task-rev-1",
      boundedOutcome: "Realize core candidate execution control slice",
    },
    children,
    dependencyGraph: defaultDepGraph,
    freshness: defaultFreshness,
    nonGoals: defaultNonGoals,
    planDigest: "digest-candidate-plan-001",
    ...overrides,
  };
}

export function createValidContext(overrides?: Partial<RepositoryContext>): RepositoryContext {
  return {
    currentParentBase: "git-commit-base-001",
    currentRecordRevisions: {
      "core/modules/task-control": "rev-10",
      "core/adapters/process": "rev-10",
    },
    verifiedWorkerRoles: ["implementer", "worker", "planning-adviser", "external-adviser"],
    parentAvailableUnits: 50,
    ...overrides,
  };
}

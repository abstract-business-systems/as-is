import { describe, it, expect } from "bun:test";
import { ExecutionTracer } from "../../skills/trace";
import type { SkillExecutionContext } from "../../skills/types";
import type { AgentContract } from "../../agents/types";

// Import all 24 reusable skills
import { buildingContextSkill } from "../../skills/reusable/building-context";
import { resolvingScopesSkill } from "../../skills/reusable/resolving-scopes";
import { identifyingOwnersSkill } from "../../skills/reusable/identifying-owners";
import { locatingChangelogsSkill } from "../../skills/reusable/locating-changelogs";
import { choosingNamesSkill } from "../../skills/reusable/choosing-names";
import { structuringContentSkill } from "../../skills/reusable/structuring-content";
import { draftingContentSkill } from "../../skills/reusable/drafting-content";
import { writingCodeSkill } from "../../skills/reusable/writing-code";
import { applyingBoundedEditsSkill } from "../../skills/reusable/applying-bounded-edits";
import { writingTestsSkill } from "../../skills/reusable/writing-tests";
import { runningTestsSkill } from "../../skills/reusable/running-tests";
import { validatingChangesSkill } from "../../skills/reusable/validating-changes";
import { recordingEvidenceSkill } from "../../skills/reusable/recording-evidence";
import { designingDiagramsSkill } from "../../skills/reusable/designing-diagrams";
import { renderingDiagramsSkill } from "../../skills/reusable/rendering-diagrams";
import { inspectingExecutionEvidenceSkill } from "../../skills/reusable/inspecting-execution-evidence";
import { assessingDeterminismSkill } from "../../skills/reusable/assessing-determinism";
import { recordingBacklogItemsSkill } from "../../skills/reusable/recording-backlog-items";
import { draftingChangelogEntriesSkill } from "../../skills/reusable/drafting-changelog-entries";
import { delegatingBoundedWorkSkill } from "../../skills/reusable/delegating-bounded-work";
import { observingDelegatedWorkSkill } from "../../skills/reusable/observing-delegated-work";
import { preparingScopedCommitsSkill } from "../../skills/reusable/preparing-scoped-commits";
import { presentingDecisionsSkill } from "../../skills/reusable/presenting-decisions";
import { choosingChangeMethodsSkill } from "../../skills/reusable/choosing-change-methods";

const mockAgent: AgentContract = {
  role: "worker",
  description: "Mock worker",
  modelSpec: "z-ai/glm-5.3-flash",
  model: "z-ai/glm-5.3-flash",
  thinking: "high",
  tools: ["read", "grep", "find", "ls", "edit", "write"],
  systemPrompt: "Mock prompt",
};

function createContext(allowlist = ["core/**", "candidate/**", "drafts/**"], protectedInputs = ["core/contracts/**"]): SkillExecutionContext {
  return {
    taskRevision: "task-test-rev1",
    componentKey: "candidate/skills",
    scopeAllowlist: allowlist,
    protectedInputs,
    assignedAgent: mockAgent,
    state: new Map(),
    tracer: new ExecutionTracer(allowlist, protectedInputs),
    budgetRemaining: { units: 50, wallClockSeconds: 300 },
  };
}

describe("Candidate 24 Reusable Skills Catalog", () => {
  it("1. executes building-context skill", async () => {
    const ctx = createContext();
    const res = await buildingContextSkill.execute(ctx, {
      anchorPath: "candidate/skills/as-is.md",
      question: "How are skills composed?",
    });
    expect(res.status).toBe("completed");
    expect(res.data?.facts.length).toBeGreaterThan(0);
  });

  it("2. executes resolving-scopes skill", async () => {
    const ctx = createContext();
    const res = await resolvingScopesSkill.execute(ctx, {
      targetPath: "core/modules/task-control/as-is.md",
      requestedOutcome: "Harden admission checks",
    });
    expect(res.status).toBe("completed");
    expect(res.data?.scopeType).toBe("component");
    expect(res.data?.componentKey).toBe("core/modules/task-control");
  });

  it("3. executes identifying-owners skill", async () => {
    const ctx = createContext();
    const res = await identifyingOwnersSkill.execute(ctx, {
      scope: {
        scopeType: "component",
        componentKey: "core/modules/task-control",
        scopeAllowlist: ["core/modules/task-control/**"],
        requiresComponentTask: true,
      },
    });
    expect(res.status).toBe("completed");
    expect(res.data?.implementationOwner).toBe("worker");
    expect(res.data?.taskAuthority).toBe("implementer");
  });

  it("4. executes locating-changelogs skill", async () => {
    const ctx = createContext();
    const res = await locatingChangelogsSkill.execute(ctx, {
      scope: {
        scopeType: "component",
        componentKey: "core/modules/task-control",
        scopeAllowlist: ["core/modules/task-control/**"],
        requiresComponentTask: true,
      },
      taskContractRequiresHistory: true,
    });
    expect(res.status).toBe("completed");
    expect(res.data?.changelogPath).toBe("core/modules/task-control/changelog.md");
  });

  it("5. executes choosing-names skill", async () => {
    const ctx = createContext();
    const res = await choosingNamesSkill.execute(ctx, {
      conceptDescription: "Component reservation manager",
      parentContextPath: "candidate/execution-control",
      candidateAlternatives: ["component-reservation", "component-res-mgr", "InvalidName"],
    });
    expect(res.status).toBe("completed");
    expect(res.data?.selectedName).toBe("component-reservation");
    expect(res.data?.isKebabCase).toBe(true);
  });

  it("6. executes structuring-content skill", async () => {
    const ctx = createContext();
    const res = await structuringContentSkill.execute(ctx, {
      documentPurpose: "Skill Architecture",
      sections: ["Overview", "Design"],
      readerRetrievalGoal: "Understand reusable skills",
    });
    expect(res.status).toBe("completed");
    expect(res.data?.outline).toContain("Purpose");
    expect(res.data?.outline).toContain("Design");
  });

  it("7. executes drafting-content skill", async () => {
    const ctx = createContext();
    const res = await draftingContentSkill.execute(ctx, {
      topic: "Composable Architecture",
      draftPurpose: "Propose composite skills",
      proposedContent: "Draft proposal content",
    });
    expect(res.status).toBe("completed");
    expect(res.data?.isExplicitDraft).toBe(true);
  });

  it("8. executes writing-code skill", async () => {
    const ctx = createContext();
    const res = await writingCodeSkill.execute(ctx, {
      requirement: "Add helper",
      targetFilePath: "candidate/skills/helper.ts",
      interfaces: [],
      scopeAllowlist: ["candidate/skills/**"],
    });
    expect(res.status).toBe("completed");
    expect(res.data?.generatedFiles).toContain("candidate/skills/helper.ts");
  });

  it("9. executes applying-bounded-edits skill", async () => {
    const ctx = createContext();
    const res = await applyingBoundedEditsSkill.execute(ctx, {
      filePath: "candidate/skills/helper.ts",
      edits: [{ oldText: "old", newText: "new" }],
      scopeAllowlist: ["candidate/skills/**"],
    });
    expect(res.status).toBe("completed");
    expect(res.data?.collateralDiffClean).toBe(true);
  });

  it("10. executes writing-tests skill", async () => {
    const ctx = createContext();
    const res = await writingTestsSkill.execute(ctx, {
      targetBehavior: "Verify helper",
      testFilePath: "candidate/skills/helper.test.ts",
      acceptanceCriteria: ["Must pass check"],
    });
    expect(res.status).toBe("completed");
    expect(res.data?.coveredCriteria).toContain("Must pass check");
  });

  it("11. executes running-tests skill", async () => {
    const ctx = createContext();
    const res = await runningTestsSkill.execute(ctx, {
      testCommand: "bun test",
      testFilePath: "candidate/skills/helper.test.ts",
    });
    expect(res.status).toBe("completed");
    expect(res.data?.passed).toBe(true);
  });

  it("12. executes validating-changes skill", async () => {
    const ctx = createContext();
    const testRes = {
      passed: true,
      passedCount: 5,
      failedCount: 0,
      skippedCount: 0,
      durationMs: 50,
      rawOutput: "all passed",
    };
    const res = await validatingChangesSkill.execute(ctx, {
      acceptanceCriteria: ["Criterion A", "Criterion B"],
      testResults: [testRes],
      diff: "mock diff",
    });
    expect(res.status).toBe("completed");
    expect(res.data?.allPassed).toBe(true);
    expect(res.data?.commitReady).toBe(true);
  });

  it("13. executes recording-evidence skill", async () => {
    const ctx = createContext();
    const testReport = { passed: true, passedCount: 5, failedCount: 0, skippedCount: 0, durationMs: 50, rawOutput: "" };
    const valReport = { allPassed: true, matrix: [{ criterion: "A", status: "passed" as const, evidence: "ok" }], residualRisk: "none", commitReady: true };
    const res = await recordingEvidenceSkill.execute(ctx, {
      outcome: "Feature realized",
      testReport,
      validationReport: valReport,
    });
    expect(res.status).toBe("completed");
    expect(res.data?.provenanceDigest).toBeDefined();
  });

  it("14. executes designing-diagrams skill", async () => {
    const ctx = createContext();
    const res = await designingDiagramsSkill.execute(ctx, {
      readerQuestion: "How does data flow?",
      nodes: [{ id: "A", label: "Start" }, { id: "B", label: "End" }],
      edges: [{ from: "A", to: "B", label: "flows to" }],
    });
    expect(res.status).toBe("completed");
    expect(res.data?.mermaidSource).toContain("flowchart TD");
  });

  it("15. executes rendering-diagrams skill", async () => {
    const ctx = createContext();
    const res = await renderingDiagramsSkill.execute(ctx, {
      mermaidSource: "flowchart TD\n  A --> B",
      expectedHrefs: [],
    });
    expect(res.status).toBe("completed");
    expect(res.data?.syntaxValid).toBe(true);
  });

  it("16. executes inspecting-execution-evidence skill", async () => {
    const ctx = createContext();
    ctx.tracer.record({
      type: "step_complete",
      details: { step: "init" },
    });
    const res = await inspectingExecutionEvidenceSkill.execute(ctx, {
      traceSelector: "step_complete",
      question: "Did init step finish?",
    });
    expect(res.status).toBe("completed");
    expect(res.data?.matchedEvents.length).toBeGreaterThan(0);
  });

  it("17. executes assessing-determinism skill", async () => {
    const ctx = createContext();
    const run1 = { passed: true, passedCount: 1, failedCount: 0, skippedCount: 0, durationMs: 10, rawOutput: "" };
    const run2 = { passed: true, passedCount: 1, failedCount: 0, skippedCount: 0, durationMs: 12, rawOutput: "" };
    const res = await assessingDeterminismSkill.execute(ctx, {
      executionRuns: [run1, run2],
    });
    expect(res.status).toBe("completed");
    expect(res.data?.isDeterministic).toBe(true);
    expect(res.data?.varianceScore).toBe(0);
  });

  it("18. executes recording-backlog-items skill", async () => {
    const ctx = createContext();
    const res = await recordingBacklogItemsSkill.execute(ctx, {
      backlogPath: "drafts/backlog.md",
      itemTitle: "Next bounded feature",
      purpose: "Add caching",
      scope: "core/cache",
      acceptanceCriteria: ["Fast read"],
      dependencies: [],
    });
    expect(res.status).toBe("completed");
    expect(res.data?.registered).toBe(true);
  });

  it("19. executes drafting-changelog-entries skill", async () => {
    const ctx = createContext();
    const res = await draftingChangelogEntriesSkill.execute(ctx, {
      taskOutcome: "Realized 24 reusable skills",
      completedCriteria: ["All 24 implemented", "Unit tests added"],
      evidenceLinks: ["candidate/evidence/milestone-2.md"],
      residualRisk: "none",
    });
    expect(res.status).toBe("completed");
    expect(res.data?.isStandardFormat).toBe(true);
  });

  it("20. executes delegating-bounded-work skill", async () => {
    const ctx = createContext();
    const res = await delegatingBoundedWorkSkill.execute(ctx, {
      childComponentKey: "core/modules/task-control",
      assignedPlan: {
        id: "child-1",
        childAnchor: "core/modules/task-control/as-is.md",
        componentKey: "core/modules/task-control",
        boundedOutcome: "Realize kernel",
        scopeAllowlist: ["core/modules/task-control/**"],
        dependencies: [],
        protectedInputs: [],
        worker: { role: "worker", model: "z-ai/glm-5.3-flash", capabilities: ["read", "write"] },
        budget: { allocatedUnits: 10, maxWallClockSeconds: 60, reserveUnits: 2 },
        acceptance: [],
        validation: [],
        recovery: [],
        escalation: [],
        integrationDeclaration: { strategy: "direct-apply", expectedParentBase: "base" },
      },
      parentTaskId: "parent-1",
    });
    expect(res.status).toBe("completed");
    expect(res.data?.admitted).toBe(true);
  });

  it("21. executes observing-delegated-work skill", async () => {
    const ctx = createContext();
    const res = await observingDelegatedWorkSkill.execute(ctx, {
      delegationEnvelopeId: "del_task_001",
    });
    expect(res.status).toBe("completed");
    expect(res.data?.progressPercent).toBe(100);
  });

  it("22. executes preparing-scoped-commits skill", async () => {
    const ctx = createContext();
    const res = await preparingScopedCommitsSkill.execute(ctx, {
      declaredFiles: ["candidate/skills/index.ts"],
      changelogEntry: "feat: add skills",
      commitMessage: "feat(candidate): add 24 reusable skills",
    });
    expect(res.status).toBe("completed");
    expect(res.data?.readyToCommit).toBe(true);
  });

  it("23. executes presenting-decisions skill", async () => {
    const ctx = createContext();
    const res = await presentingDecisionsSkill.execute(ctx, {
      decisionTitle: "Select Adapter Architecture",
      evidence: ["Process adapter passed latency benchmark"],
      options: [
        { label: "Option A", tradeOff: "Simpler but blocking" },
        { label: "Option B", tradeOff: "Non-blocking with slight memory overhead" },
      ],
      authorityHolder: "Implementer",
    });
    expect(res.status).toBe("completed");
    expect(res.data?.pendingHumanChoice).toBe(true);
  });

  it("24. executes choosing-change-methods skill", async () => {
    const ctx = createContext();
    const res = await choosingChangeMethodsSkill.execute(ctx, {
      changeDescription: "Create new adapter file",
      isNewFile: true,
      isRefactor: false,
    });
    expect(res.status).toBe("completed");
    expect(res.data?.changeMethod).toBe("writing-code");
  });
});

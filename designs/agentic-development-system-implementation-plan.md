# Agentic Development System — Comprehensive Realization & Alignment Plan

## Purpose

This document is the authoritative implementation plan, candidate contract specification, and alignment contract for realizing the candidate agentic development system on branch `implementing-composable-skills`. It establishes complete contract fidelity to the source design documents (`drafts/composable-skills.md`, `drafts/agentic-development-system-cutover/high-level-design-draft11/target-design.md (historical cutover-folder path; content recoverable via tag `adoption-evidence-f9-confirm` @ `f48dd00` after the folder drops at merge)`, `drafts/agentic-development-system-cutover/executable-realization-plan-draft6.md (historical cutover-folder path; content recoverable via tag `adoption-evidence-f9-confirm` @ `f48dd00` after the folder drops at merge)`, and `drafts/multi-model-development-orchestration.md`), defines the hardened execution-control kernel, details all 24 reusable skills and 12 master compositions with per-skill contracts and test matrices, establishes the candidate migration ledger, and specifies the pre-registered Section 13 comparative benchmark against pinned `master` commit `9a77e37bebbce0d802d4debb6b54e6df2d223208`.

---

## 1. Multi-Model Advisory Review Dispositions

| # | Adviser Recommendation | Source | Disposition | Implementation Location & Contract Details |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Scorer & Benchmark Self-Grading Isolation** | Sol / Kimi (C1) | **Accepted** | §4.2: Relocate benchmark scorer and rubric to protected location (`candidate/benchmark/protected/scorer.ts`); implementer writes benchmark runner but cannot modify scorer or rubric; runner executes against isolated ephemeral worktrees copied from clean seed. |
| 2 | **Fencing Tokens & Monotonic Lease Generations** | Sol / Kimi (C3) | **Accepted** | §2.2: Add `leaseGeneration: number` and `fencingToken: string` to `ComponentReservation`; require downstream write/integration validation against current fencing token to prevent stale-holder writes. |
| 3 | **RFC 8785 JSON Canonicalization Scheme (JCS)** | Sol / Kimi (C4) | **Accepted** | §2.1: Use RFC 8785 JCS canonicalization for computing `targetPacketDigest` and constant-time string comparison against trusted immutable admission records. |
| 4 | **Surgical Re-entrant Rollback & Layer Separation** | Sol / Kimi (C2) | **Accepted** | §2.2: Explicitly separate admission-time conflict detection from reservation-layer atomic acquisition rollback; unit tests in `component-reservation.test.ts` test collision rollback with pre-existing leases preserved. |
| 5 | **Parent Closure State Machine** | Sol / Kimi (C4) | **Accepted** | §2.3: Explicitly define terminal parent transitions (`completed`, `failed`, `cancelled`), requiring 100% child terminal accounting, child integration proof for completed children, and rollback compensation for failed/cancelled children. |
| 6 | **Tool Authority & Worker Test Runner Boundary** | Sol / Kimi (H2, H3) | **Accepted** | §1.2, §3.2, §5: Worker has zero `bash` tools and authors code/tests; Implementer executes `bun test` suites to verify worker deliverables before advancing task packets. `running-tests` uses structured argv execution. |
| 7 | **Commit Preparation vs Execution Authority** | Sol / Kimi (H4) | **Accepted** | §3.2, §3.3: `preparing-scoped-commits` produces a structured commit plan; `committing-completed-work` requires explicit human authorization before executing Git commit commands. |
| 8 | **Pinned Candidate Commit & 3-Run Aggregation** | Sol / Kimi (H6, H7) | **Accepted** | §4.1, §4.3: Pin baseline commit `9a77e37bebbce0d802d4debb6b54e6df2d223208` and record candidate commit SHA at benchmark start; execute 3 iterations with mean $\mu$, standard deviation $\sigma$, and 100% hard safety gates. |

---

## 2. Candidate Boundary, Authority Separation & Migration Ledger

### 2.1 Candidate Isolation Principle
- All candidate code, schemas, skills, agents, benchmarks, and evidence are isolated under `candidate/`.
- Live contracts under `core/`, existing skills under `skills/`, and component `as-is.md` records remain unmodified baseline until a separate, human-authorized adoption milestone.
- Candidate realization is evaluated as an experimental candidate system, not an unverified in-place replacement.

### 2.2 Canonical Agent Roster & Tool Allowlist

| Canonical Role | OpenRouter Model | Thinking Level | Declared Tools | Architectural Authority & Responsibility |
| :--- | :--- | :--- | :--- | :--- |
| **`implementer`** | `google/gemini-3.7-flash` | `high` | `read,grep,find,ls,bash,edit,write` | User-facing owner of task planning, delegation, validation, integration, benchmark execution, and delivery. |
| **`worker`** | `z-ai/glm-5.3-flash` | `high` | `read,grep,find,ls,edit,write` | Scoped code implementation in admitted component worktrees (no bash). |
| **`planning-adviser`** | `openai/gpt-5.6-sol` | `high` | *(none / read-only)* | Bounded architectural, design, and risk advice to the Implementer. |
| **`external-adviser`** | `moonshotai/kimi-k3` | `high` | *(none / read-only)* | Independent audit and blind-spot challenge when consulted. |

### 2.3 Candidate Migration Ledger

| Candidate Capability | Live Predecessor / Baseline | Consumer / Target | Compatibility Mechanism | Migration Sequencing | Behavior Parity Evidence | Fallback & Recovery Path |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Execution-Control Kernel** (`candidate/execution-control/`) | `core/modules/task-control/` | Orchestration & Control Plane | Dual-mode adapter; preserves existing `core/` interfaces | Milestone 1 (Hardening in Packet 1) | 24/24 unit & integration tests (`candidate/tests/execution-control/`) | Execute baseline task control in clean worktree |
| **Composable Skills Engine** (`candidate/skills/runner.ts`) | Direct procedural `SKILL.md` execution | Realization Plane | Master-first composition runner with tool-capability gating | Milestone 2 (In Progress) | Deterministic composition test suite (`candidate/tests/skills/`) | Fall back to monolithic `SKILL.md` scripts |
| **24 Reusable Skills** (`candidate/skills/reusable/`) | 17 monolithic live skills in `skills/` | Composable Skills Engine & Admitted Agents | Standalone functional modules with strict I/O contracts | Milestone 2 | Per-skill contract tests (24/24) | Retain legacy skill procedures |
| **12 Master Skills** (`candidate/skills/compositions/`) | Ad-hoc agent prompts and implicit steps | Realization Plane | Multi-variant compositions (component & non-component) | Milestone 2 | 12 master composition lifecycle tests | Direct agent procedural execution |
| **Section 13 Benchmark** (`candidate/benchmark/`) | None (no prior controlled benchmark) | Assurance Plane | Controlled comparative runner on `validation-fixtures/dummy-delegation` | Milestone 3 | Pre-registered comparative report against pinned `master` (`9a77e37`) | Retain baseline benchmark harness |

---

## 3. Hardened Execution-Control Kernel Specification (`candidate/execution-control/`)

### 3.1 Plan Admission Engine (`admission.ts`)
- **Strict Frozen-Envelope Schema & RFC 8785 JCS:**
  - `targetDesignSha256`: Expected exact SHA256 hex string (`abc4d367d6e7f314454c6510e4574f49d9b1e8a5f03ffb90ff2d3b0ca65e1836`) matching `drafts/agentic-development-system-cutover/high-level-design-draft11/target-design.md (historical cutover-folder path; content recoverable via tag `adoption-evidence-f9-confirm` @ `f48dd00` after the folder drops at merge)`.
  - `targetPacketDigest`: Canonical SHA256 hash computed via RFC 8785 JSON Canonicalization Scheme (JCS) over the plan envelope excluding transport wrappers.
  - Fail-closed validation at admission and dequeue: Reject missing, malformed, non-hex, byte-different, or substituted envelope values using constant-time string equality.
- **DAG Acyclicity & Dependency Graph Validation:**
  - Execute Kahn's algorithm over the child dependency graph.
  - Reject circular dependency cycles, self-references, and missing dependency keys.
- **Component Reservation Conflict Prevention:**
  - Validate that independent sibling children do not request identical `componentKey` identifiers.
  - Validate that sibling `scopeAllowlist` paths do not overlap or intersect.
- **Budget Reserve Enforcement & Arithmetic Safety:**
  - Validate that budget fields are positive finite integers: $\sum (\text{child.allocatedUnits}) \le \text{parent.allocatedUnits} - \text{parent.reserveUnits}$, with $\text{reserveUnits} \ge 0$. Reject negative, fractional, NaN, or overflowing values.
- **Protected Input Shielding:**
  - Reject admission if any child's `scopeAllowlist` intersects with protected repository paths (`core/contracts/**`, root configuration files, or active test fixtures).

### 3.2 Component Reservation Manager (`reservation.ts`)
- **Reservation Record Schema with Fencing:**
  ```typescript
  export interface ComponentReservation {
    readonly reservationId: string;
    readonly componentKey: string;
    readonly ownerTaskId: string;
    readonly planRevision: string;
    readonly attempt: number;
    readonly acquiredAt: number; // epoch ms
    readonly leaseExpiresAt: number; // epoch ms
    readonly leaseGeneration: number; // monotonic generation counter
    readonly fencingToken: string; // unique token verified at write time
    disposition: 'active' | 'released' | 'reclaimed' | 'orphan' | 'rolled_back';
    reclaimReason?: string;
    releasedAt?: number;
  }
  ```
- **Sorted Atomic Acquisition & Contention Rollback:**
  - Sort requested keys lexicographically prior to acquisition to guarantee global deadlock prevention.
  - **Surgical Rollback for Re-entrant Claims:** When an attempt that already holds pre-existing leases requests a new batch of keys and encounters a contention conflict, the rollback mechanism releases *only the freshly acquired keys in that specific batch*, preserving the caller's pre-existing leases intact.
- **Lease TTL & Stale-Lock Reclamation:**
  - Enforce millisecond lease TTLs (default 30,000 ms) with injectable clock support for deterministic testing.
  - Reclaim stale locks only when: (1) `clock.now() > leaseExpiresAt`, and (2) verified dead owner confirmation (no active heartbeat within TTL window).
  - Increment `leaseGeneration` and issue a new `fencingToken` upon reclamation so stale owners fail closed on write attempts.
  - Record audit log entries detailing the exact reclamation reason, prior owner, and new claimant.
- **Orphan Sweeps:**
  - Periodic sweep of abandoned leases when TTL elapses without active heartbeat renewal.

### 3.3 Parent Closure Evaluator (`closure.ts`)
- **Parent State Machine & 100% Terminal Child Accounting:**
  - `status: 'completed'`: Every admitted child is explicitly accounted for as `completed`, with verified integration evidence, declared scope adherence, and clean integration.
  - `status: 'failed'`: One or more admitted children failed or violated scope; parent fails closed, cleans uncommitted artifacts, and triggers rollback compensation for any integrated siblings.
  - `status: 'cancelled'`: Parent or child execution was cancelled; all active child leases are released and partial work preserved at safe recovery checkpoints.
- **Child Integration Proof & Scope Validation:**
  - Verify that each completed child build reported valid integration evidence binding child ID, plan revision, attempt, and tree digest.
  - Verify that child modifications strictly adhered to the child's declared `scopeAllowlist`.
  - Fail closed if any child modified protected inputs or caused dirty scope pollution.
- **Traceability & Residual Risk:**
  - Emit a comprehensive closure record containing full lineage back to the parent task and target design, recording unaddressed non-blocking questions as residual risk.

---

## 4. Composable Skills Catalog Specification (`candidate/skills/`)

### 4.1 Standard Repeatable Skill Contract Model
Every reusable skill and master composition implements a standard TypeScript interface matching `candidate/skills/types.ts`:
```typescript
export interface ReusableSkill<TInput = unknown, TOutput = unknown> {
  readonly name: string;
  readonly description: string;
  readonly skillClass: 'reusable';
  readonly requiredTools: readonly ToolName[];
  execute(context: SkillExecutionContext, input: TInput): Promise<StepResult<TOutput>>;
}

export interface MasterSkill<TInput = unknown, TOutput = unknown> {
  readonly name: string;
  readonly description: string;
  readonly skillClass: 'master';
  readonly variants: Readonly<Record<string, CompositionVariant>>;
  readonly defaultVariant: string;
  execute(
    context: SkillExecutionContext,
    variantName?: string,
    input?: TInput
  ): Promise<CompositionExecutionResult<TOutput>>;
}
```

### 4.2 Tool-Access & Capability Matrix

| Skill / Composition | Category | Required Tools | Permitted Agent Roles |
| :--- | :--- | :--- | :--- |
| `building-context` | Reusable | `read` | `implementer`, `worker` |
| `resolving-scopes` | Reusable | `read` | `implementer`, `worker` |
| `identifying-owners` | Reusable | `read` | `implementer`, `worker` |
| `locating-changelogs` | Reusable | `read` | `implementer`, `worker` |
| `choosing-names` | Reusable | `read,edit` | `implementer`, `worker` |
| `structuring-content` | Reusable | `read,edit,write` | `implementer`, `worker` |
| `drafting-content` | Reusable | `read,write` | `implementer`, `worker` |
| `writing-code` | Reusable | `read,write` | `implementer`, `worker` |
| `applying-bounded-edits` | Reusable | `read,edit` | `implementer`, `worker` |
| `writing-tests` | Reusable | `read,write` | `implementer`, `worker` |
| `running-tests` | Reusable | `read,grep,find,ls` | `implementer`, `worker` (via bounded runner) |
| `validating-changes` | Reusable | `read` | `implementer`, `worker` |
| `recording-evidence` | Reusable | `read,write` | `implementer`, `worker` |
| `designing-diagrams` | Reusable | `read,write` | `implementer`, `worker` |
| `rendering-diagrams` | Reusable | `read` | `implementer` |
| `inspecting-execution-evidence` | Reusable | `read` | `implementer`, `worker` |
| `assessing-determinism` | Reusable | `read` | `implementer` |
| `recording-backlog-items` | Reusable | `read,edit,write` | `implementer` |
| `drafting-changelog-entries` | Reusable | `read,write` | `implementer`, `worker` |
| `delegating-bounded-work` | Reusable | `read,write` | `implementer` |
| `observing-delegated-work` | Reusable | `read` | `implementer` |
| `preparing-scoped-commits` | Reusable | `read,edit,write` | `implementer` |
| `presenting-decisions` | Reusable | `read,write` | `implementer` |
| `choosing-change-methods` | Reusable | `read` | `implementer`, `worker` |
| `making-changes` (Component) | Master | `read,grep,find,ls,edit,write` | `implementer`, `worker` |
| `making-changes` (Non-Comp) | Master | `read,grep,find,ls,edit,write` | `implementer`, `worker` |
| `building-components` | Master | `read,grep,find,ls,bash,edit,write` | `implementer` |
| `implementing-tasks` | Master | `read,grep,find,ls,edit,write` | `worker` |
| `maintaining-components` | Master | `read,grep,find,ls,edit,write` | `implementer`, `worker` |
| `managing-as-is-records` | Master | `read,grep,find,ls,edit,write` | `implementer` |
| `designing-mermaid-diagrams`| Master | `read,grep,find,ls,write` | `implementer` |
| `managing-backlogs` | Master | `read,grep,find,ls,edit,write` | `implementer` |
| `managing-changelogs` | Master | `read,grep,find,ls,edit,write` | `implementer`, `worker` |
| `spawning-subagents` | Master | `read,grep,find,ls,bash` | `implementer` |
| `exploring-execution-evidence`| Master | `read,grep,find,ls` | `implementer` |
| `consulting-humans` | Master | `read,write` | `implementer` |
| `committing-completed-work` | Master | `read,grep,find,ls,bash` | `implementer` |

### 4.3 Catalog of 24 Reusable Skills (`candidate/skills/reusable/`)

```typescript
// 1. building-context
export interface BuildingContextInput { readonly anchorPath: string; readonly question: string; readonly literalLinks?: readonly string[]; }
export interface BuildingContextOutput { readonly contextSummary: string; readonly facts: readonly string[]; readonly assumptions: readonly string[]; readonly unknowns: readonly string[]; readonly links: readonly string[]; }

// 2. resolving-scopes
export interface ResolvingScopesInput { readonly targetPath: string; readonly requestedOutcome: string; }
export interface ResolvingScopesOutput { readonly scopeType: 'component' | 'artifact' | 'project' | 'root'; readonly componentKey?: string; readonly scopeAllowlist: readonly string[]; readonly requiresComponentTask: boolean; }

// 3. identifying-owners
export interface IdentifyingOwnersInput { readonly scope: ResolvingScopesOutput; }
export interface IdentifyingOwnersOutput { readonly implementationOwner: string; readonly taskAuthority: string; readonly historyOwner: string; readonly validator: string; }

// 4. locating-changelogs
export interface LocatingChangelogsInput { readonly scope: ResolvingScopesOutput; readonly taskContractRequiresHistory: boolean; }
export interface LocatingChangelogsOutput { readonly changelogPath?: string; readonly historyRequired: boolean; readonly rationale: string; }

// 5. choosing-names
export interface ChoosingNamesInput { readonly conceptDescription: string; readonly parentContextPath: string; readonly candidateAlternatives: readonly string[]; }
export interface ChoosingNamesOutput { readonly selectedName: string; readonly semanticRationale: string; readonly isKebabCase: boolean; readonly referenceReplacements?: ReadonlyArray<{ readonly file: string; readonly oldText: string; readonly newText: string }>; }

// 6. structuring-content
export interface StructuringContentInput { readonly documentPurpose: string; readonly sections: readonly string[]; readonly readerRetrievalGoal: string; }
export interface StructuringContentOutput { readonly outline: readonly string[]; readonly durablePath: string; readonly navigationLinks: readonly string[]; }

// 7. drafting-content
export interface DraftingContentInput { readonly topic: string; readonly draftPurpose: string; readonly proposedContent: string; }
export interface DraftingContentOutput { readonly draftArtifactPath: string; readonly isExplicitDraft: boolean; readonly openDecisions: readonly string[]; }

// 8. writing-code
export interface WritingCodeInput { readonly requirement: string; readonly targetFilePath: string; readonly interfaces: readonly string[]; readonly scopeAllowlist: readonly string[]; }
export interface WritingCodeOutput { readonly code: string; readonly generatedFiles: readonly string[]; readonly diff: string; }

// 9. applying-bounded-edits
export interface ApplyingBoundedEditsInput { readonly filePath: string; readonly edits: ReadonlyArray<{ readonly oldText: string; readonly newText: string }>; readonly scopeAllowlist: readonly string[]; }
export interface ApplyingBoundedEditsOutput { readonly modifiedFiles: readonly string[]; readonly patchSummary: string; readonly collateralDiffClean: boolean; }

// 10. writing-tests
export interface WritingTestsInput { readonly targetBehavior: string; readonly testFilePath: string; readonly acceptanceCriteria: readonly string[]; }
export interface WritingTestsOutput { readonly testCode: string; readonly coveredCriteria: readonly string[]; readonly residualGaps: readonly string[]; }

// 11. running-tests
export interface RunningTestsInput { readonly testCommand: string; readonly testFilePath: string; }
export interface RunningTestsOutput { readonly passed: boolean; readonly passedCount: number; readonly failedCount: number; readonly skippedCount: number; readonly durationMs: number; readonly rawOutput: string; }

// 12. validating-changes
export interface ValidatingChangesInput { readonly acceptanceCriteria: readonly string[]; readonly testResults: readonly RunningTestsOutput[]; readonly diff: string; }
export interface ValidatingChangesOutput { readonly allPassed: boolean; readonly matrix: ReadonlyArray<{ readonly criterion: string; readonly status: 'passed' | 'failed' | 'blocked' | 'untested'; readonly evidence: string }>; readonly residualRisk: string; readonly commitReady: boolean; }

// 13. recording-evidence
export interface RecordingEvidenceInput { readonly outcome: string; readonly testReport: RunningTestsOutput; readonly validationReport: ValidatingChangesOutput; }
export interface RecordingEvidenceOutput { readonly evidenceRecordPath: string; readonly provenanceDigest: string; readonly timestamp: number; }

// 14. designing-diagrams
export interface DesigningDiagramsInput { readonly readerQuestion: string; readonly nodes: ReadonlyArray<{ readonly id: string; readonly label: string }>; readonly edges: ReadonlyArray<{ readonly from: string; readonly to: string; readonly label?: string }>; }
export interface DesigningDiagramsOutput { readonly mermaidSource: string; readonly isElkCompatible: boolean; readonly expectedHrefs: readonly string[]; }

// 15. rendering-diagrams
export interface RenderingDiagramsInput { readonly mermaidSource: string; readonly expectedHrefs: readonly string[]; }
export interface RenderingDiagramsOutput { readonly rendered: boolean; readonly syntaxValid: boolean; readonly hrefsVerified: boolean; readonly rendererStatus: 'rendered' | 'renderer_unavailable' | 'syntax_error'; }

// 16. inspecting-execution-evidence
export interface InspectingExecutionEvidenceInput { readonly traceSelector: string; readonly question: string; }
export interface InspectingExecutionEvidenceOutput { readonly matchedEvents: readonly string[]; readonly correlationFindings: readonly string[]; readonly observedAnomalies: readonly string[]; }

// 17. assessing-determinism
export interface AssessingDeterminismInput { readonly executionRuns: readonly RunningTestsOutput[]; }
export interface AssessingDeterminismOutput { readonly isDeterministic: boolean; readonly varianceScore: number; readonly flakyTestNames: readonly string[]; }

// 18. recording-backlog-items
export interface RecordingBacklogItemsInput { readonly backlogPath: string; readonly itemTitle: string; readonly purpose: string; readonly scope: string; readonly acceptanceCriteria: readonly string[]; readonly dependencies: readonly string[]; }
export interface RecordingBacklogItemsOutput { readonly itemId: string; readonly formattedRow: string; readonly registered: boolean; }

// 19. drafting-changelog-entries
export interface DraftingChangelogEntriesInput { readonly taskOutcome: string; readonly completedCriteria: readonly string[]; readonly evidenceLinks: readonly string[]; readonly residualRisk: string; }
export interface DraftingChangelogEntriesOutput { readonly formattedEntry: string; readonly isStandardFormat: boolean; }

// 20. delegating-bounded-work
export interface DelegatingBoundedWorkInput { readonly childComponentKey: string; readonly assignedPlan: ChildPlanEntry; readonly parentTaskId: string; }
export interface DelegatingBoundedWorkOutput { readonly delegationEnvelopeId: string; readonly admitted: boolean; readonly scopeBounded: boolean; }

// 21. observing-delegated-work
export interface ObservingDelegatedWorkInput { readonly delegationEnvelopeId: string; }
export interface ObservingDelegatedWorkOutput { readonly status: 'running' | 'completed' | 'failed' | 'blocked' | 'cancelled'; readonly progressPercent: number; readonly spentUnits: number; readonly terminalReport?: ChildTerminalResult; }

// 22. preparing-scoped-commits
export interface PreparingScopedCommitsInput { readonly declaredFiles: readonly string[]; readonly changelogEntry: string; readonly commitMessage: string; }
export interface PreparingScopedCommitsOutput { readonly stagedFiles: readonly string[]; readonly cachedDiffValid: boolean; readonly whitespaceClean: boolean; readonly readyToCommit: boolean; }

// 23. presenting-decisions
export interface PresentingDecisionsInput { readonly decisionTitle: string; readonly evidence: readonly string[]; readonly options: ReadonlyArray<{ readonly label: string; readonly tradeOff: string }>; readonly authorityHolder: string; }
export interface PresentingDecisionsOutput { readonly formattedDecisionBrief: string; readonly pendingHumanChoice: boolean; }

// 24. choosing-change-methods
export interface ChoosingChangeMethodsInput { readonly changeDescription: string; readonly isNewFile: boolean; readonly isRefactor: boolean; }
export interface ChoosingChangeMethodsOutput { readonly changeMethod: 'writing-code' | 'applying-bounded-edits' | 'drafting-content' | 'delegating-bounded-work'; readonly rationale: string; }
```

### 4.4 Catalog of 12 Master Skills (`candidate/skills/compositions/`)

1. **`making-changes` (Multi-Variant Master Composition):**
   - **Variant A (Component-Based Change):** `resolving-scopes` $\to$ `identifying-owners` $\to$ `building-context` $\to$ `choosing-change-methods` $\to$ `implementing-tasks` $\to$ `writing-code` / `applying-bounded-edits` $\to$ `writing-tests` $\to$ `validating-changes` $\to$ `locating-changelogs` $\to$ `managing-changelogs`.
     - *Invariants:* Strict component task protocol, descendant closure, owning changelog, backlog reconciliation, task cleanup, and scoped completion handoff.
   - **Variant B (Non-Component Change):** `resolving-scopes` $\to$ `identifying-owners` $\to$ `building-context` $\to$ `choosing-change-methods` $\to$ `writing-code` / `applying-bounded-edits` $\to$ `writing-tests` (when useful) $\to$ `validating-changes` $\to$ `locating-changelogs` $\to$ `managing-changelogs` (when required).
     - *Invariants:* Does not create unnecessary component tasks; enforces scope allowlist and validation.
2. **`building-components`:** Full component realization lifecycle: context building, plan admission, atomic component reservation, child task delegation, child integration verification, fail-closed parent closure, changelog update, and scoped commit preparation.
3. **`implementing-tasks`:** Worker implementation lifecycle: task verification, progress tracking, code edits, test writing, check execution, and validation handoff.
4. **`maintaining-components`:** Evidence-based component housekeeping, auditing records against conventions, applying surgical fixes, running regression checks, and recording retained exceptions.
5. **`managing-as-is-records`:** Canonical `as-is.md` record lifecycle: Purpose, Components, Design, Relationships, navigation validation, and parity verification.
6. **`designing-mermaid-diagrams`:** Diagram design, syntax validation, and local rendering verification.
7. **`managing-backlogs`:** Backlog maintenance, priority calculation, dependency sorting, and changelog-evidence-gated cleanup.
8. **`managing-changelogs`:** Durable history resolution, concise evidence recording, and explicit `no history required` handling.
9. **`spawning-subagents`:** Isolated subagent process lifecycle, admission gating, progress monitoring, budget enforcement, and recovery.
10. **`exploring-execution-evidence`:** Execution trace and session exploration, event correlation, and budget analysis without execution authority.
11. **`consulting-humans`:** Human-centered decision framing, trade-off presentation, uncertainty identification, and human authority gating.
12. **`committing-completed-work`:** Verified, closure-gated Git staging, whitespace checks, and single atomic commit creation (gated on explicit human turn authorization).

---

## 5. Section 13 Pre-Registered Empirical Comparative Benchmark (`candidate/benchmark/`)

### 5.1 Benchmark Target & Seed Configuration
- **Consuming Project Seed:** `validation-fixtures/dummy-delegation` isolated test fixture.
- **Baseline Revision (Immutable):** `9a77e37bebbce0d802d4debb6b54e6df2d223208` (pinned `master` commit).
- **Candidate Revision:** Exact commit SHA recorded at benchmark initialization.
- **Protected Scorer & Rubric:** `candidate/benchmark/protected/scorer.ts` and `validation-fixtures/dummy-delegation/benchmark-rubric.json` (outside worker write scope).
- **Controlled Feature Task Specification:** Realize a multi-component feature requiring:
  1. Setup and dependency initialization in isolated worktree.
  2. Scope resolution and component ownership mapping.
  3. A concise human-facing design record.
  4. Bounded code implementation across two sibling components (`producer` and `consumer`).
  5. Focused unit and integration test generation.
  6. Deterministic check execution and validation reporting.
  7. Parallel child integration and contention detection.
  8. Fail-closed parent closure and status handoff.
- **Model Parameters & Execution Settings:**
  - `temperature: 0.0`, `seed: 42`, deterministic tool calling.
  - Token budget: 50,000 units per attempt; Wall-clock timeout: 120 seconds.
- **Fault-Injection Test Cases:**
  - *Fault 1 (Contention Collision Rollback):* Unit test in `component-reservation.test.ts` where multi-key acquisition encounters conflict; verify 100% rollback of fresh keys and retention of pre-existing leases.
  - *Fault 2 (Security Boundary Violation):* Task attempts to write to `core/contracts/architecture-vocabulary.md`; verify 100% security interception.
  - *Fault 3 (Child Failure & Recovery):* Child task throws runtime error; verify parent fail-closed closure and state preservation.

### 5.2 Evaluation Metrics & Pass/Fail Thresholds

| Metric Dimension | Evaluation Method | Baseline Target | Candidate Target | Pass / Fail Threshold |
| :--- | :--- | :--- | :--- | :--- |
| **1. Setup Overhead** | Wall-clock time & disk footprint to initialize | $\le 5.0\text{ s}$ | $\le 1.0\text{ s}$ | Candidate $\le 2.0\text{ s}$ |
| **2. Correctness & Check Pass Rate** | % of deterministic checks passed | $\ge 90\%$ | $100\%$ | $100\%$ pass rate required |
| **3. Scope Discipline & Protection** | Interceptions of unauthorized path mutations | $100\%$ caught | $100\%$ caught | Zero unauthorized mutations allowed |
| **4. Contention & Deadlock Safety** | Detection and non-corrupting rollback under simulated lock collision | Baseline fails/deadlocks | $100\%$ rollback | $100\%$ atomic rollback |
| **5. Fail-Closed Parent Closure** | Detection of missing/unintegrated child tasks | Variable | $100\%$ detected | Zero unintegrated closures allowed |
| **6. Fault Recovery** | State preservation & clean rollback on simulated child failure | Partial | Clean recovery | Zero orphaned locks or dirty state |
| **7. Agent Spend Efficiency** | Total tokens & latency per completed feature | Baseline spend | $\ge 20\%$ lower tokens | Non-inferiority vs baseline required |
| **8. Human Effort & Interruptions** | Count of manual interventions required | $\ge 2$ interventions | $0$ interventions | Zero manual intervention on happy path |
| **9. Evidence & Traceability** | Completeness of validation & closure reports | Basic | 100% trace coverage | Full provenance & residual risk |

### 5.3 Repeatability & Scoring Protocol
- The benchmark executes 3 independent iterations for both baseline and candidate to measure variance and assess determinism.
- The results are compiled into `candidate/evidence/section-13-benchmark-report.md`.

---

## 6. Itemized Implementation Task Packets for Worker Delegation

Implementation proceeds in strict linear dependency order: Packet 1 $\to$ Packet 2 $\to$ Packet 3 $\to$ Packet 4.

### Task Packet 1: Kernel Hardening (`candidate/execution-control/`)
- **Assigned Worker:** `worker` (`z-ai/glm-5.3-flash`, tools: `read,grep,find,ls,edit,write`)
- **Scope Allowlist:** `candidate/execution-control/**`, `candidate/tests/execution-control/**`
- **Protected Inputs:** `core/**`, `candidate/agents/**`, `candidate/skills/**`, `candidate/benchmark/**`
- **Dependencies:** None (Baseline Milestone 1 code)
- **Concrete Deliverables & Acceptance Criteria:**
  - Harden `admission.ts`: Strict 64-character hex target-design SHA256 validation (`abc4d367d6e7f314454c6510e4574f49d9b1e8a5f03ffb90ff2d3b0ca65e1836`), RFC 8785 JCS canonicalization, budget arithmetic safety, and dequeue revalidation.
  - Harden `reservation.ts`: Fencing token generation, monotonic lease generation counter, surgical re-entrant rollback preserving pre-existing leases, lease ownership record binding, and verified dead owner check for stale lock reclamation.
  - Harden `closure.ts`: 100% terminal child accounting, scope pollution rejection, and sibling rollback on failed/cancelled child.
  - Implementer runs `bun test candidate/tests/execution-control/` to verify all tests pass.

### Task Packet 2: 24 Reusable Skills (`candidate/skills/reusable/`)
- **Assigned Worker:** `worker` (`z-ai/glm-5.3-flash`, tools: `read,grep,find,ls,edit,write`)
- **Scope Allowlist:** `candidate/skills/reusable/**`, `candidate/skills/types.ts`, `candidate/tests/skills/reusable/**`
- **Protected Inputs:** `core/**`, `candidate/execution-control/**`, `candidate/agents/**`, `candidate/benchmark/**`
- **Dependencies:** Task Packet 1
- **Concrete Deliverables & Acceptance Criteria:**
  - Implement all 24 standalone reusable skills matching Section 4.2 and Section 4.3.
  - Unit test suite testing each skill's input validation, execution, stopping rules, and error conditions in `candidate/tests/skills/reusable/`.
  - Implementer runs `bun test candidate/tests/skills/reusable/` to verify all 24 skill unit tests pass.

### Task Packet 3: 12 Master Skills & Tool Gate Runner (`candidate/skills/compositions/`)
- **Assigned Worker:** `worker` (`z-ai/glm-5.3-flash`, tools: `read,grep,find,ls,edit,write`)
- **Scope Allowlist:** `candidate/skills/compositions/**`, `candidate/skills/runner.ts`, `candidate/skills/registry.ts`, `candidate/skills/index.ts`, `candidate/tests/skills/compositions/**`
- **Protected Inputs:** `core/**`, `candidate/execution-control/**`, `candidate/agents/**`, `candidate/benchmark/**`
- **Dependencies:** Task Packet 2
- **Concrete Deliverables & Acceptance Criteria:**
  - Implement all 12 master compositions including both variants of `making-changes`.
  - Tool-access gating and capability validation in `runner.ts` enforcing the Section 4.2 Tool Matrix.
  - Positive and negative tool gating test suite in `candidate/tests/skills/compositions/`.
  - Implementer runs `bun test candidate/tests/skills/` to verify all tests pass.

### Task Packet 4: Section 13 Benchmark Execution & Evidence (`candidate/benchmark/`)
- **Assigned Worker / Orchestrator:** `implementer` (`google/gemini-3.7-flash`, tools: `read,grep,find,ls,bash,edit,write`)
- **Scope Allowlist:** `candidate/benchmark/**`, `candidate/tests/benchmark/**`, `candidate/evidence/**`
- **Protected Inputs:** `core/**`, `validation-fixtures/dummy-delegation/**`
- **Dependencies:** Task Packet 3
- **Concrete Deliverables & Acceptance Criteria:**
  - Section 13 comparative benchmark runner comparing pinned `master` (`9a77e37bebbce0d802d4debb6b54e6df2d223208`) against candidate on `validation-fixtures/dummy-delegation`.
  - Execute 3-run empirical benchmark and compile `candidate/evidence/section-13-benchmark-report.md`.
  - Implementer runs `bun test candidate/tests/benchmark/` to verify all tests pass.

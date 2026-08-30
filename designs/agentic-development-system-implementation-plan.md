# Agentic Development System — Implementation Plan & Alignment Checklist

## Purpose

This document locks the complete implementation plan and itemized alignment checklist for realizing the candidate agentic development system on branch `implementing-composable-skills`. It bridges the accepted architectural foundation directly into executable TypeScript code, automated test suites, composable skill procedures, and comparative benchmark evidence without ungrounded assumptions or scope compression.

## Authoritative Design References

1. **System Architecture (5-Plane Design):** `drafts/agentic-development-system-high-level-design-draft11/target-design.md` (Human Intent, Orchestration & Control, Realization, Assurance, Host/Consumption planes).
2. **Composable Skills Architecture:** `drafts/composable-skills.md` (24 reusable procedure skills, 12 master outcome-oriented compositions, and composition runner).
3. **Multi-Model Strategy:** `drafts/multi-model-development-orchestration.md` (Role separation, OpenRouter model bindings, and `thinking: high` defaults).
4. **Execution-Control Specification:** `drafts/agentic-development-system-executable-realization-plan-draft6.md` (Plan admission, atomic multi-reservation, stale-lock recovery, and fail-closed parent closure).
5. **Evaluation Protocol:** `drafts/agentic-development-system-high-level-design-draft11/target-design.md` Section 13 ("First proof and setup-inclusive evaluation" against `validation-fixtures/dummy-delegation` and pinned `master`).

## Canonical Agent Roster

| Role | Canonical name | OpenRouter model | Thinking | Tools | Execution responsibility |
| --- | --- | --- | --- | --- | --- |
| Implementer | `implementer` (Terra) | `google/gemini-3.7-flash` | `high` | `read,grep,find,ls,bash,edit,write` | User-facing owner of task planning, delegation, validation, integration, and delivery. |
| Worker | `worker` (Luna) | `z-ai/glm-5.3-flash` | `high` | `read,grep,find,ls,edit,write` | Scoped code implementation in admitted component worktrees (no bash). |
| Planning Adviser | `planning-adviser` (Sol) | `openai/gpt-5.6-sol` | `high` | (none) | Bounded architectural, design, and risk advice to the Implementer. |
| External Adviser | `external-adviser` (Kimi) | `moonshotai/kimi-k3` | `high` | (none) | Read-only challenge and blind-spot reduction when consulted. |

## Itemized Alignment Checklist

### 1. Execution-Control Kernel (`candidate/execution-control/`) [COMPLETED]
- [x] Schema & Types (`types.ts`): Envelopes, DAGs, admissions, component reservations, validation/integration evidence, closure outcomes.
- [x] Plan Admission Engine (`admission.ts`): Kahn's DAG acyclicity check, component collision checks, scope allowlist overlap checks, budget reserve checks, and protected input enforcement.
- [x] Component Reservation Manager (`reservation.ts`): Sorted-key atomic acquisition, collision rollback, lease TTLs, re-entrancy, stale-lock reclamation, and orphan sweeps.
- [x] Parent Closure Evaluator (`closure.ts`): Fail-closed closure requiring 100% child terminal accounting, validation evidence, clean scope, and unmodified protected inputs.
- [x] Deterministic Unit & Integration Test Suites (`candidate/tests/execution-control/`, 24/24 passed).

### 2. Full Composable Skills Catalog (`candidate/skills/`) [IN PROGRESS]
- [x] Skills Engine Core (`types.ts`, `trace.ts`, `registry.ts`, `runner.ts`).
- [ ] **All 24 Reusable Skills (`candidate/skills/reusable/`)**:
  - [x] `context-building` (`building-context`): Assemble smallest authoritative context from anchors and literal links.
  - [ ] `resolving-scopes`: Resolve component, artifact, project, or root scope without assuming a component task.
  - [ ] `identifying-owners`: Identify component/artifact owners and authoritative decision holders.
  - [ ] `locating-changelogs`: Resolve owning changelog without proximity assumptions.
  - [x] `naming-software-concepts` (`choosing-names`): Semantic accuracy and lowercase kebab-case validation.
  - [ ] `structuring-content`: Durable knowledge-work artifact structuring.
  - [ ] `drafting-content`: Drafting documentation and non-code artifacts.
  - [ ] `writing-code`: Substantial new implementation generation from bounded requirements.
  - [ ] `applying-bounded-edits`: Surgical, non-destructive file modifications within scope allowlists.
  - [ ] `writing-tests`: Generating deterministic test assertions.
  - [ ] `running-tests`: Executing test commands and parsing test outcomes.
  - [x] `verification-discipline` (`validating-changes`): Deterministic check execution, test reporting, residual risk logging.
  - [ ] `recording-evidence`: Packaging validation and integration evidence records.
  - [ ] `designing-diagrams`: Formulating architecture and workflow diagram models.
  - [ ] `rendering-diagrams`: Rendering Mermaid diagrams and verifying href preservation.
  - [ ] `inspecting-execution-evidence`: Reading structured execution traces and audit events.
  - [ ] `assessing-determinism`: Evaluating flaky vs deterministic failure modes.
  - [ ] `recording-backlog-items`: Recording work in nearest common ancestor backlog.
  - [ ] `drafting-changelog-entries`: Formatting concise owning changelog summaries.
  - [ ] `delegating-bounded-work`: Preparing child task envelopes with strict allowlists and budgets.
  - [ ] `observing-delegated-work`: Monitoring child progress and timeout limits.
  - [ ] `preparing-scoped-commits`: Scoped staging and commit message preparation.
  - [ ] `presenting-decisions`: Formatting concise human decision briefs.
  - [ ] `choosing-change-methods`: Selecting appropriate change pattern (component task vs non-component).
- [ ] **All 12 Master Skills (`candidate/skills/compositions/`)**:
  - [ ] `making-changes`: Master composition for general scoped changes.
  - [x] `building-components`: Master composition for component realization, child delegation, and closure.
  - [x] `implementing-tasks`: Master composition for worker task implementation, edits, and verification.
  - [ ] `maintaining-components`: Master composition for evidence-based component housekeeping and maintenance.
  - [ ] `managing-as-is-records`: Master composition for creating and updating `as-is.md` canonical architecture records.
  - [ ] `designing-mermaid-diagrams`: Master composition for end-to-end Mermaid diagram creation and rendering verification.
  - [ ] `managing-backlogs`: Master composition for backlog maintenance and prioritization.
  - [ ] `managing-changelogs`: Master composition for durable changelog reconciliation.
  - [ ] `spawning-subagents`: Master composition for isolated Pi subagent process lifecycle.
  - [ ] `exploring-execution-evidence`: Master composition for execution trace exploration and budget analysis.
  - [ ] `consulting-humans`: Master composition for human-centered design clarification and decision gating.
  - [ ] `committing-completed-work`: Master composition for verified, closure-gated Git commits.

### 3. Section 13 Setup-Inclusive Benchmark Protocol [PLANNED]
- [ ] Set up isolated mock consuming fixture (`validation-fixtures/dummy-delegation`).
- [ ] Compare Baseline Workflow (pinned `master`) vs Candidate Workflow (`implementing-composable-skills`).
- [ ] Measure Section 13 metrics:
  - Setup time and configuration overhead.
  - Correctness and deterministic check completion.
  - Scope discipline and protected-input isolation (zero mutations on `core/contracts/**`).
  - Human effort (number of interventions/interruptions).
  - Agent operation and spend efficiency.
  - Integration and fail-closed closure accounting.
  - Recovery and rollback under simulated failure.
- [ ] Document comparative benchmark report in `candidate/evidence/section-13-benchmark-report.md`.

### 4. Model Consultation & Verification Audits [PLANNED]
- [ ] Dispatch bounded, read-only audit subagent to **Sol** (`planning-adviser` / `openai/gpt-5.6-sol`): Audit candidate skills catalog against `drafts/composable-skills.md`.
- [ ] Dispatch bounded, read-only audit subagent to **Kimi** (`external-adviser` / `moonshotai/kimi-k3`): Audit Section 13 benchmark results and residual risks.

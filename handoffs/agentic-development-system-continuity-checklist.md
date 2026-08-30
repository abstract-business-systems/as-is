# Agentic Development System — Continuity Checklist

Purpose: Itemized verification checklist tracking candidate realization, skills catalog coverage, benchmark execution, and multi-model review alignment.

## 1. Multi-Agent Collaboration & Review Gate
- [x] Human Review Acceptance: High-level design envelope accepted (Draft 11).
- [x] Implementer Plan Formulation: Comprehensive realization plan authored in `designs/agentic-development-system-implementation-plan.md`.
- [x] Planning Adviser Review: Dispatched plan to Planning Adviser (`candidate/agents/planning-adviser/agent.md` running `openai/gpt-5.6-sol`, `thinking: high`) via Pi subagent launcher.
- [x] External Adviser Blind-Spot Audit: Consulted External Adviser (`candidate/agents/external-adviser/agent.md` running `moonshotai/kimi-k3`, `thinking: high`) for independent blind-spot challenge.
- [x] Review Findings Disposition: Incorporated all adviser findings (fencing tokens, JCS canonicalization, protected scorer isolation, worker tool boundary, parent closure state machine) into `designs/agentic-development-system-implementation-plan.md`.
- [ ] Alignment Confirmation: Human confirmation to proceed with worker delegation.
- [ ] Worker Delegation: Implementer delegates scoped implementation packets to `worker` (`candidate/agents/worker/agent.md` running `z-ai/glm-5.3-flash`).

## 2. Candidate Kernel Hardening (`candidate/execution-control/`)
- [x] Schema & Types (`types.ts`): Envelopes, DAGs, admissions, component reservations, validation/integration evidence, closure outcomes.
- [ ] Plan Admission Engine (`admission.ts`):
  - [ ] Strict target design SHA256 validation (no bypass overrides).
  - [ ] Strict target packet digest matching.
  - [ ] Parent and child record revision freshness validation.
  - [ ] Kahn's DAG acyclicity and dependency graph edge validation.
  - [ ] Budget reserve enforcement and allowable scope prefix checks.
- [ ] Component Reservation Manager (`reservation.ts`):
  - [ ] Sorted-key atomic acquisition and collision rollback.
  - [ ] Fix re-entrant reservation rollback (do not evict pre-existing leases owned by same attempt).
  - [ ] Lease TTL enforcement, stale-lock reclamation, and orphan sweeps.
- [ ] Parent Closure Evaluator (`closure.ts`):
  - [ ] 100% terminal accounting for all admitted children (no premature closure).
  - [ ] Integration proof validation (clean scope and protected inputs unmodified).
  - [ ] Traceability to target design and residual risk recording.
- [x] Test Suite: Unit & integration tests in `candidate/tests/execution-control/`.

## 3. Composable Skills Catalog (`candidate/skills/`)
### Reusable Skills (24 total — 100% faithful to `drafts/composable-skills.md`)
- [ ] `building-context`: Smallest authoritative context from anchors and literal links.
- [ ] `resolving-scopes`: Component, artifact, project, or root scope resolution.
- [ ] `identifying-owners`: Concern-to-owner mapping across authority, consultation, and implementation.
- [ ] `locating-changelogs`: Owning changelog resolution from explicit contracts.
- [ ] `choosing-names`: Semantic accuracy, parent/sibling vocabulary inspection, alternative evaluation, and atomic rename reference updates.
- [ ] `structuring-content`: Durable knowledge-work artifact structuring.
- [ ] `drafting-content`: Bounded proposal creation without claiming adoption.
- [ ] `writing-code`: Substantial new implementation generation with tool capability gating.
- [ ] `applying-bounded-edits`: Surgical, non-destructive file replacements within allowlists.
- [ ] `writing-tests`: Focused unit, integration, boundary, and negative test generation.
- [ ] `running-tests`: Test command execution and structured observation reporting.
- [ ] `validating-changes`: Acceptance-to-evidence matrix, diff inspection, pass/fail/blocked/untested condition mapping, commit readiness, and residual risk.
- [ ] `recording-evidence`: Reproducible observations, provenance, and limitation recording.
- [ ] `designing-diagrams`: Elk-compatible Mermaid diagram model formulation.
- [ ] `rendering-diagrams`: Local Mermaid rendering and navigation href preservation verification.
- [ ] `inspecting-execution-evidence`: Reading trace/session slices without granting task authority.
- [ ] `assessing-determinism`: Evaluating variance across repeated execution samples.
- [ ] `recording-backlog-items`: Bounded backlog item proposal formulation.
- [ ] `drafting-changelog-entries`: Concise summary entries with evidence links and residual risk.
- [ ] `delegating-bounded-work`: Child task envelopes with strict allowlists and budgets.
- [ ] `observing-delegated-work`: Progress and terminal status observation.
- [ ] `preparing-scoped-commits`: Completion-gated staging and commit message formatting.
- [ ] `presenting-decisions`: Decision briefs with evidence, options, trade-offs, and authority holders.
- [ ] `choosing-change-methods`: Selecting least powerful fitting change method.

### Master Skills (12 total)
- [ ] `making-changes`: Multi-variant master composition supporting both **component-based change** and **non-component change** workflows with real gate execution.
- [ ] `building-components`: Component realization, child delegation, and closure.
- [ ] `implementing-tasks`: Worker task implementation lifecycle.
- [ ] `maintaining-components`: Evidence-based component housekeeping and maintenance.
- [ ] `managing-as-is-records`: Canonical `as-is.md` record lifecycle.
- [ ] `designing-mermaid-diagrams`: Diagram design, syntax validation, and rendering.
- [ ] `managing-backlogs`: Backlog indexing and changelog-evidence-gated reconciliation.
- [ ] `managing-changelogs`: Durable history resolution and maintenance.
- [ ] `spawning-subagents`: Isolated Pi subagent process lifecycle.
- [ ] `exploring-execution-evidence`: Execution trace exploration and budget analysis.
- [ ] `consulting-humans`: Bounded decision framing and human authority gating.
- [ ] `committing-completed-work`: Verified, closure-gated Git staging and commits.

## 4. Section 13 Benchmark Protocol (`candidate/benchmark/`)
- [ ] Pre-registered controlled comparative benchmark on `validation-fixtures/dummy-delegation`.
- [ ] Controlled comparison: Pinned `master` baseline vs `implementing-composable-skills` candidate.
- [ ] Evaluation metrics: Setup latency, DAG throughput, atomic contention rollback, runtime security interception, fail-closed closure accuracy, and recovery under simulated fault.
- [ ] Comparative benchmark report in `candidate/evidence/section-13-benchmark-report.md`.

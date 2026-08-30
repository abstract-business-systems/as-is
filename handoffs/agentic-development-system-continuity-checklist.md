# Agentic Development System — Continuity Checklist

Purpose: Single itemized verification checklist tracking candidate realization, skills catalog coverage, benchmark execution, and model review audits.

## 1. Candidate Kernel (`candidate/execution-control/`)
- [x] `types.ts`: Plan envelopes, DAGs, admissions, component reservations, validation/integration evidence, closure outcomes.
- [x] `admission.ts`: PlanAdmissionEngine with Kahn's DAG acyclicity check, component collision detection, scope allowlist overlap checks, budget checks, and protected input enforcement.
- [x] `reservation.ts`: ComponentReservationManager with sorted-key acquisition, collision rollback, lease TTLs, re-entrancy, stale-lock reclamation, and orphan sweeps.
- [x] `closure.ts`: ParentClosureEvaluator with fail-closed evaluation requiring 100% child accounting, validation proofs, and clean scope.
- [x] `candidate/tests/execution-control/`: 24/24 unit & integration tests passing.
- [x] Evidence: `candidate/evidence/milestone-1-execution-control.md`.

## 2. Agent Roster (`candidate/agents/`)
- [x] `config.json` & `config.ts`: Runtime config and OpenRouter model resolution.
- [x] `types.ts` & `role-contract.ts`: Contract definitions and tool boundary validation.
- [x] `implementer/agent.md`: `google/gemini-3.7-flash` | `thinking: high` | 7 tools.
- [x] `worker/agent.md`: `z-ai/glm-5.3-flash` | `thinking: high` | 6 tools (no bash).
- [x] `planning-adviser/agent.md`: `openai/gpt-5.6-sol` | `thinking: high` | 0 tools.
- [x] `external-adviser/agent.md`: `moonshotai/kimi-k3` | `thinking: high` | 0 tools.
- [x] `candidate/tests/skills/agent-config.test.ts`: 5/5 tests passing.

## 3. Composable Skills Catalog (`candidate/skills/`)
### Reusable Skills (24 total)
- [x] `context-building` (`building-context`)
- [ ] `resolving-scopes`
- [ ] `identifying-owners`
- [ ] `locating-changelogs`
- [x] `naming-software-concepts` (`choosing-names`)
- [ ] `structuring-content`
- [ ] `drafting-content`
- [ ] `writing-code`
- [ ] `applying-bounded-edits`
- [ ] `writing-tests`
- [ ] `running-tests`
- [x] `verification-discipline` (`validating-changes`)
- [ ] `recording-evidence`
- [ ] `designing-diagrams`
- [ ] `rendering-diagrams`
- [ ] `inspecting-execution-evidence`
- [ ] `assessing-determinism`
- [ ] `recording-backlog-items`
- [ ] `drafting-changelog-entries`
- [ ] `delegating-bounded-work`
- [ ] `observing-delegated-work`
- [ ] `preparing-scoped-commits`
- [ ] `presenting-decisions`
- [ ] `choosing-change-methods`

### Master Skills (12 total)
- [ ] `making-changes`
- [x] `building-components`
- [x] `implementing-tasks`
- [ ] `maintaining-components`
- [ ] `managing-as-is-records`
- [ ] `designing-mermaid-diagrams`
- [ ] `managing-backlogs`
- [ ] `managing-changelogs`
- [ ] `spawning-subagents`
- [ ] `exploring-execution-evidence`
- [ ] `consulting-humans`
- [ ] `committing-completed-work`

### Engine & Tests
- [x] `trace.ts` (`ExecutionTracer` with `SecurityViolationError` & `ScopeViolationError`).
- [x] `registry.ts` (`SkillRegistry` with capability validation).
- [x] `runner.ts` (`CompositionRunner` with condition gates and spend tracking).
- [x] Unit test suites: `candidate/tests/skills/` (18/18 passing).

## 4. Section 13 Benchmark Comparison Protocol
- [ ] Setup isolated mock consuming testbed (`validation-fixtures/dummy-delegation`).
- [ ] Run Baseline Workflow (pinned `master` revision).
- [ ] Run Candidate Workflow (`implementing-composable-skills`).
- [ ] Collect comparative metrics: setup latency, contention handling, security violation catch rate, closure accounting, and recovery.
- [ ] Author comparative benchmark report in `candidate/evidence/section-13-benchmark-report.md`.

## 5. Model Consultation & Verification Audits
- [ ] Dispatch audit subagent to **Sol** (`planning-adviser` / `openai/gpt-5.6-sol`): Validate complete skills catalog coverage against `drafts/composable-skills.md`.
- [ ] Dispatch audit subagent to **Kimi** (`external-adviser` / `moonshotai/kimi-k3`): Audit Section 13 benchmark results and residual risks.

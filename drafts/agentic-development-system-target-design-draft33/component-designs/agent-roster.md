# Agent roster — proposed target component

## Status and authority

This is a proposed functional roster for `target-design-v1-draft-33`. It separates production roles from workflow assignments, human roles, validators, and fixtures. Names are target identifiers, not adopted filesystem paths or implementation authorization.

## Purpose and users

Define the smallest functional role roster needed for bounded software-development orchestration and human-facing design work. Readers are the human design reviewer, workflow owner, task authorizer, component builder, implementer, validator, evaluator, and migration owner.

## Current reference

Current role contracts remain under `agents/*/agent.md` and are described by `agents/as-is.md`. Existing role behavior and the current task/control contracts remain evidence, not adopted target authority.

## Planned responsibility and boundary

The first-slice target uses the existing intake router, component-builder, worker, validator, execution advisor, expert, and thinking-companion boundaries as adapted functional roles. Design orchestration is a workflow assignment, not a separate production agent in this revision; a distinct agent would require a future target addition and ledger row. Cell-level semantic review is assigned to a reviewer distinct from the relevant side's worker, task/orchestration owner, integration owner, and evaluator/scorer-control owner; the evaluator/scorer owner may aggregate results but may not supply the semantic judgment it scores.

## Production roles

| Target identifier | Current source | Responsibility | Must not do |
| --- | --- | --- | --- |
| `target-agent/intake-status-router-v1` | `agents/as-is/agent.md` | Interpret intent, report status, and route substantive requests to an admitted role | Create tasks, infer approval, implement, or self-delegate |
| `target-agent/component-delivery-orchestrator-v1` | `agents/component-builder/agent.md` | Own component task, child delegation, recovery, semantic closure, and receiving-owner integration | Edit separate child boundaries or infer completion from exit |
| `target-agent/bounded-implementation-worker-v1` | `agents/worker/agent.md` | Implement one authorized task and return scoped evidence | Self-accept, integrate, delegate, change design, or use unrelated credentials |
| `target-agent/deterministic-evidence-validator-v1` | `agents/evidence-validator/agent.md` | Inspect controlled evidence and run only admitted fixed checks | Mutate, authorize, integrate, or accept its own result |
| `target-agent/execution-evidence-advisor-v1` | `agents/execution-advisor/agent.md` | Analyze bounded traces/session evidence and advise on runtime outcomes | Launch, retry, spend, or change task state |
| `target-agent/independent-expert-reviewer-v1` | `agents/expert/agent.md` | Provide read-only architectural, semantic, or risk-specific dissent | Edit, delegate, approve, integrate, or authorize |

## Workflow assignments

These are responsibilities, not automatically separate agents:

| Target workflow | Boundary | Holder state |
| --- | --- | --- |
| `target-workflow/design-orchestration-v1` | Prepare/revise package and route design-changing feedback | Human appointment required |
| `target-workflow/task-admission-v1` | Verify design revision, currentness, records, capability profile, and task authority before launch | Human appointment required |
| `target-workflow/semantic-result-review-v1` | Inspect actual result against design and acceptance; assign independent cell reviewers with conflict checks and recorded blinding/unblinding | Distinct reviewer required; unresolved material conflict or unavoidable unblinding blocks the cell |
| `target-workflow/integration-v1` | Integrate eligible result and revalidate | Receiving owner required |
| `target-workflow/consuming-project-setup-v1` | Apply the approved setup contract to mock seed and current/candidate copies | Setup owner required; fixture owner retains seed authority |
| `target-workflow/evaluation-and-scoring-v1` | Freeze fixture, rubric, case matrix, scoring, and evidence; aggregate reviewed cells without supplying their semantic judgments | Independent evaluator required and conflict-separated from cell review |
| `target-workflow/migration-governance-v1` | Own consumer inventory and migration ledger | Migration owner required |
| `target-workflow/design-facilitation-v1` | Support human-facing explanation and feedback framing without approval authority | `thinking-companion` is the initial composed holder; no separate agent target is proposed in this revision |
| `target-workflow/fixture-control-v1` | Protect seed, controls, manifests, results, and recovery copies | Fixture-control holder independent of candidate required |

## Human roles

- **Then-current design reviewer:** aligns a named package revision and decides design-changing feedback.
- **Task authorizer:** explicitly authorizes each bounded implementation task after design and build-plan gates.
- **Accountable holders:** setup, evaluation/scoring, semantic review, integration, migration, fixture control, and design facilitation require named holders before relevant work.

## Validators and fixtures

Validators are deterministic or read-only evidence boundaries, not production agents. `target-fixture/agent-capability-probe-v1` retains the current capability probe as fixture-only. The first slice adds protected cases for normal work, stale design, missing dependency, controlled failure/recovery, and adversarial scope. Fixtures, baseline, seed, rubric, scorer, and validators are outside candidate write scope.

## Relationships and authority

The intake router connects requests to the named workflow or component orchestrator. The component orchestrator delegates to the bounded worker and routes results to validators, semantic reviewers, and the receiving integration owner. `thinking-companion` initially supports `target-workflow/design-facilitation-v1`; consultation does not grant task or approval authority.

## Inputs, outputs, and consequential flows

Each production role receives only its admitted role contract, applicable current records, bounded task/design context, and capability profile. It returns status, evidence, result, escalation, or review recommendation according to its role. A worker result cannot transition task status without independent validation and receiving-owner review.

## Migration mapping

The sole source-to-target mapping is `../migration-ledger.md`. This document summarizes functional boundaries and does not independently decide disposition.

## Acceptance and validation proposal

Validate role admission, no-self-delegation, read-only boundaries, worker scope, design-reference currentness, result review, explicit escalation bubbling, cell-review assignment, reviewer conflict checks, and recorded blinded/unblinded status. A missing or ambiguous capability, material reviewer conflict, or unresolved unblinding blocks the attempt rather than causing silent substitution.

## Open decisions and dependencies

- holder identities for workflow assignments and human roles;
- exact model/provider assignments and capability profiles;
- current/planned record-contract evolution;
- whether later evidence warrants a distinct design-orchestration agent.

## Model assignment

Model/provider assignment is separate from role identity and authority. The human selected `moonshotai/kimi-k3` as the current additional-family reviewer for the successor gate, subject to exact identity/family verification and bounded local trial. `thinking-companion` is initially a composed holder for the design-facilitation workflow, not a second target category. Terra and Sol remain review roles in this exercise; they are not mandatory target production roles.

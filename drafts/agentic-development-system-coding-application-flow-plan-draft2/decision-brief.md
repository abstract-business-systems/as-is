# Coding/application flow plan — Draft 2 — Decision brief
Purpose: Give the human the smallest sufficient decision surface for the exact Terra-authored coding/application plan.

## Decision

Should the human accept the exact frozen Terra-authored coding/application plan for preparation of one bounded provider-free execution-control candidate slice?

Acceptance would authorize this plan as the coding/application planning basis only. It would not authorize task creation, worker launch, implementation, benchmark execution, migration, target adoption, artifact retirement, commit, or merge.

## What this plan does

It prepares a bounded candidate path to test:

- deterministic plan readiness and admission;
- atomic component reservations and safe recovery;
- parent-closure evaluation;
- scope-preserving mechanical application of a validated child result, only if its process-adapter ownership boundary is resolved; and
- a provider-free `validation-fixtures/dummy-delegation` harness, added only after prerequisite candidate checks pass.

Current task-control, parent-side integration, process-adapter, launcher, and fixture behavior remain the comparison baseline until candidate evidence and a separate adoption decision exist.

## Construction assignment

| Role | Assignment |
| --- | --- |
| Plan author/adviser | Terra |
| Implementation author | Luna, after separate kick-off and exact task-control admission |
| Coding-plan review | No Sol or Kimi plan-review gate; no substitute reviewer is invented |
| Human decision | Required on this exact frozen plan before implementation |
| Implementation-result review | Terra reviews Luna's result; explicitly non-independent |
| Independent result review | Added only if risk, architecture, security, external effects, disagreement, or policy requires it |
| Deterministic validation | Separate protected code-owned checks |

## Main blocker

The current `core/adapters/process/as-is.md` owns process lifecycle and execution observations but does not currently grant Git/worktree child-result application authority. Its owner must accept or reject that bounded mechanical boundary before any process-adapter task is prepared. If rejected or unavailable, that branch stops and the current parent-side integration baseline remains protected; no substitute owner is invented.

## Safeguards

- No provider, credential, network, live integration, package distribution, or broad isolation claim.
- No invented Luna model ID, runtime holder, exact API, schema, storage path, or budget.
- Missing, stale, contradictory, protected, or unavailable facts fail closed.
- No silent rebase, scope widening, budget increase, live-reservation stealing, or cancellation of unaffected siblings.
- Existing tests are regression evidence only; candidate tests must invoke the new candidate structures.
- Deterministic validation, semantic review, task status, process exit, telemetry, and integration evidence remain separate.

## Human decision options

- **Accept** the exact frozen plan for planning basis only.
- **Request revision** with the smallest necessary correction.
- **Defer** the coding/application flow.
- **Reject** the plan.

## Next action if accepted

Resolve the process-adapter ownership boundary, then request a separate kick-off and exact task-control admission. Do not create tasks or launch implementation from this plan.

`startsWork: false`

Supporting plan: [`plan.md`](plan.md).

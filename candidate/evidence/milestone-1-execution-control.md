# Milestone 1: Candidate Execution-Control Kernel — Evidence

## Objective

Implement and evidence the Candidate Execution-Control Kernel in isolated candidate namespaces under `candidate/execution-control/` and deterministic test suites under `candidate/tests/execution-control/` on branch `implementing-composable-skills`.

## Status: COMPLETED

All planned kernel modules, data contracts, and deterministic test suites are implemented and passing 100% of checks.

## Implemented Modules

| Module | Location | Responsibility |
| --- | --- | --- |
| Types & Contracts | `candidate/execution-control/types.ts` | Data structures for plan envelopes, dependency DAGs, admission results, component reservations, validation/integration evidence, and parent closure outcomes. |
| Atomic Reservation Manager | `candidate/execution-control/reservation.ts` | Sorted-key multi-component acquisition, atomic rollback upon collision, TTL lease expiration, stale-lock reclamation with owner-death audit, and orphan cleanup. |
| Plan Admission Engine | `candidate/execution-control/admission.ts` | Envelope verification, DAG acyclicity validation (Kahn's algorithm), same-component collision detection, scope allowlist overlap checking, budget arithmetic, worker capability checks, and protected input enforcement. |
| Parent Closure Evaluator | `candidate/execution-control/closure.ts` | Pure fail-closed evaluation of parent completion requiring 100% child subtask accounting, verified child validation proof, clean integration scope, and unmodified protected inputs. |
| Module Index | `candidate/execution-control/index.ts` | Public export boundary for the candidate execution-control kernel. |

## Test Suites and Verification Evidence

Executed with `bun test candidate/tests/execution-control/`:

```text
candidate/tests/execution-control/execution-control-integration.test.ts:
(pass) Candidate Execution-Control Kernel - End-to-End Integration > orchestrates a full 2-stage multi-child plan: admission, parallel locking, execution, and fail-closed parent closure [2.44ms]

candidate/tests/execution-control/parent-closure.test.ts:
(pass) Candidate ParentClosureEvaluator > evaluates parent task as eligible for closure when all children succeed and integrate cleanly [0.20ms]
(pass) Candidate ParentClosureEvaluator > fails closed when an expected child is missing from the accounting report [0.07ms]
(pass) Candidate ParentClosureEvaluator > fails the parent immediately if any child task failed [0.15ms]
(pass) Candidate ParentClosureEvaluator > marks parent as cancelled if a child task was cancelled [0.10ms]
(pass) Candidate ParentClosureEvaluator > withholds closure when a child is still active or awaiting approval [0.06ms]
(pass) Candidate ParentClosureEvaluator > rejects closure when child integration modified protected inputs or had dirty scope [0.14ms]

candidate/tests/execution-control/component-reservation.test.ts:
(pass) Candidate ComponentReservationManager > atomically acquires multiple component keys in sorted order [0.15ms]
(pass) Candidate ComponentReservationManager > performs atomic rollback when any key in a batch is locked by another task [0.10ms]
(pass) Candidate ComponentReservationManager > supports re-entrant acquisition by the same task, planRevision, and attempt [0.05ms]
(pass) Candidate ComponentReservationManager > releases active reservations cleanly [0.07ms]
(pass) Candidate ComponentReservationManager > reclaims stale expired reservations with audit reason [0.13ms]
(pass) Candidate ComponentReservationManager > refuses to steal active lease if owner is not verified dead [0.05ms]
(pass) Candidate ComponentReservationManager > sweeps orphans when leases expire [0.13ms]

candidate/tests/execution-control/plan-admission.test.ts:
(pass) Candidate PlanAdmissionEngine > admits a valid plan envelope and acquires atomic reservations [0.28ms]
(pass) Candidate PlanAdmissionEngine > rejects a plan with mismatched target design SHA256 [0.30ms]
(pass) Candidate PlanAdmissionEngine > rejects a plan with circular dependency cycles [0.17ms]
(pass) Candidate PlanAdmissionEngine > rejects independent children targeting the same component key [0.14ms]
(pass) Candidate PlanAdmissionEngine > rejects independent children with overlapping scope allowlists [0.14ms]
(pass) Candidate PlanAdmissionEngine > rejects a plan whose total child budget exceeds parent allocation [0.11ms]
(pass) Candidate PlanAdmissionEngine > rejects a child whose scope allowlist includes protected inputs [0.12ms]
(pass) Candidate PlanAdmissionEngine > rejects an unknown worker role [0.14ms]
(pass) Candidate PlanAdmissionEngine > rejects a plan with stale parent base or record revisions [0.14ms]
(pass) Candidate PlanAdmissionEngine > rejects admission when component reservation is actively locked by another task [0.15ms]

 24 pass
 0 fail
 101 expect() calls
Ran 24 tests across 4 files. [133.00ms]
```

## Architectural Invariants Established

1. **Deterministic Admission**: Rejects invalid envelopes, cyclic dependencies, budget overruns, and protected file intrusions before worker launch.
2. **Atomic Concurrency**: Eliminates partial reservation races; enforces deadlock-free sorted acquisition and instant rollback on collision.
3. **Fail-Closed Closure**: Withholds parent completion until all child subtasks are accounted for and validated.
4. **Candidate Isolation**: All code resides in `candidate/`, leaving baseline `core/` contracts untouched.

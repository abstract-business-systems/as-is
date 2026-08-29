# First task-control slice — admission preflight

## Scope and authority

- Kick-off decision: user authorized preparation only on 2026-08-29.
- Selected backlog item: `task-control-first-slice`.
- Prepared task-start checkpoint: `0283acd` (`chore(task-control): prepare bounded first-slice tasks`).
- Controlling executable-plan SHA-256: `ef2c7c5bd760e8e1bacd795fec18ad1b4dbf7264d1d6260c9dc383e612348716`.
- Scope: root → `core` → `core/modules` → `core/modules/task-control`.
- Result: **not admitted for implementation**; only read-only preflight evidence was collected.
- `startsWork: false`.

## Prepared records

The task-start checkpoint contains four ready task pairs:

| Component | Worker role | Allocation | Direct child scope | State |
| --- | --- | --- | --- | --- |
| `.` | `as-is` | USD 1.00; 900 seconds; reserves USD 0.10 and 120 seconds | `core` | `ready` |
| `core` | `component-builder` | USD 0.90; 780 seconds; reserves USD 0.10 and 120 seconds | `core/modules` | `ready` |
| `core/modules` | `component-builder` | USD 0.80; 660 seconds; reserves USD 0.10 and 120 seconds | `core/modules/task-control` | `ready` |
| `core/modules/task-control` | `component-builder` | USD 0.20; 240 seconds; reserves USD 0.04 and 60 seconds | none | `ready` |

The `core/modules` allocation also satisfies the current validator's direct-child accounting for the pre-existing terminal `core/modules/observability` task; that sibling was not changed or selected.

## Evidence collected

- `bun core/modules/task-control/task-record-validator.ts .`: `VALID`.
- `git diff --check`: passed before the task-start commit.
- Read-only current control-plane launch-budget checks passed for every prepared record:
  - root: requested 780 seconds / USD 0.90 → effective 780 seconds / USD 0.90;
  - `core`: requested 660 seconds / USD 0.80 → effective 660 seconds / USD 0.80;
  - `core/modules`: requested 540 seconds / USD 0.70 → effective 540 seconds / USD 0.70;
  - `core/modules/task-control`: requested 180 seconds / USD 0.16 → effective 180 seconds / USD 0.16.
- `bun core/modules/task-control/control-plane.ts status .`: no active task; prepared records remain `ready`; no status or budget mutation occurred.
- No worker, provider, subprocess, fixture, benchmark, external service, or implementation file was launched or changed.

## Admission disposition

The preflight is not full exact task admission. The current `admitLaunch` operation checks launchability and wall-clock budget; it does not yet establish the candidate plan-envelope, reservation, dependency, protected-input, capability, or holder facts proposed by Draft 6.

Admission therefore remains blocked pending gate-time facts that this preparation must not invent:

- exact human holders for the root/coordinator/implementation responsibilities;
- the exact Luna model identity and provider route, if Luna is used as the coding implementer;
- the final configured capabilities and worker availability for the selected role; and
- confirmation that the exact task-control admission surface can record these facts without weakening current task authority.

The configured `component-builder` role currently resolves through its role file's `medium` model setting to repository configuration route `@preset/abs-medium` via `openrouter`. This is a configuration observation only and is not an observed Luna identity or an approval to execute it.

## Safe next action

Keep all four records in `ready` state. Obtain or record the missing gate-time holder, model, capability, and admission facts. If they cannot be established, retain the durable blocker and do not activate or launch a worker. If they are established, run the exact task-control admission against the unchanged task-start records, record its result, and seek a separate implementation transition before any edit.

`startsWork: false`

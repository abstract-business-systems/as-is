---
as-is-version: 2
task:
  status: completed
  worker: implementer
  updated: 2026-07-26T20:01:12Z
constraints:
  cost:
    currency: USD
    allocated: 0.20
    spent: unavailable
    reserve: 0.04
    source: unavailable
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 120
       spent-seconds: unavailable
      reserve-seconds: 30
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Inspect the explicitly named host-neutral execution contract, OpenCode
    adapter boundary, root task record, and supported Bun control-plane child
    before editing; record the exact changed-artifact set and any material
    departure before implementation.
  - Implement the smallest dependency-free Bun-compatible systemd user-job
    adapter inside this component. It must submit one bounded local job with
    `systemd-run --user --no-block`, return after a durable launch checkpoint
    without waiting for job completion, and preserve the configured
    `as-is -> orchestrator -> implementer` mediation without role substitution.
  - Give the submitted job observable unit/cgroup ownership, source-labelled
    output or event capture, durable checkpoint persistence, later polling for
    running/completed/failed state, routed cancellation with confirmed
    termination, stale detection, and bounded recovery/escalation state.
  - Keep repository task records authoritative; treat unit handles, cgroups,
    logs, and temporary files as supplementary host observations. Do not infer
    completion from process exit, missing handles, or cleaned temporary state.
  - Validate the complete harmless local path with temporary reversible probe
    jobs, including cleanup with no background process or persistent host
    configuration left behind. Do not contact external services, use secrets,
    edit parent or sibling files, or launch a real implementer task.
  - Record validation evidence, residual risk, recovery state, actual
    host-reported cost, and host-observed wall-clock use before handoff; invoke
    `committing-completed-work` only if this component qualifies for completion.
---

# Systemd User Job Adapter

## Purpose

Map the host-neutral non-blocking worker lifecycle to a locally available
systemd user service without changing task-record authority or silently
replacing the configured worker.

## Requirement

Implement and validate a bounded systemd user-job adapter in this component.
The adapter must submit a deliberately bounded job through the user manager,
persist a launch checkpoint before returning to its caller, and expose the
host observations needed by later orchestration: unit and process ownership,
output or event observation, polling, cancellation confirmation, stale/failure
classification, and bounded recovery or escalation. It must remain a host
adapter rather than a second task backlog, and it must not implement a real
component-domain worker or invoke the configured `implementer` during its own
validation.

The implementation may read the named external dependencies
`execution-contract.md`, `opencode-adapter.md`, the root `as-is.md`, and
`control-plane/control-plane.ts`; it may not modify them. The current root
probe established the local systemd capability, but this record is the first
implementation boundary and is intentionally created without launching its
configured worker.

## Plan

The configured `implementer` has been explicitly launched for this component.
The exact planned changed-artifact set is `systemd-user-job-adapter.ts`,
`systemd-user-job-adapter.test.ts`, and this `as-is.md` record; no parent,
sibling, root, archived, or pre-existing unrelated file is in scope. The
adapter will remain standalone and dependency-free rather than importing the
host-neutral control-plane module: its local atomic record writer will preserve
the existing task-record authority while keeping host submission concerns
inside this component. This is a material implementation choice, not a policy
departure. The caller supplies the bounded command and must identify the exact
`as-is -> orchestrator -> implementer` chain; the adapter rejects any role
substitution and never invokes a real implementer during validation.

Implement the smallest Bun-compatible systemd user-job adapter, then validate
the harmless temporary-job launch, polling, failure/stale representation,
routed cancellation, termination confirmation, record authority, and cleanup.
Private probe state must be removed only after durable evidence is recorded.

## Progress

Created atomically by the root orchestrator at `2026-07-26T19:53:51Z` after a
successful local systemd capability probe. The probe returned from three
`systemd-run --user --no-block` submissions before a deliberately trivial job
completed, observed the owning unit/cgroup and process, reloaded temporary
durable checkpoint files, polled completion and failure, confirmed routed
cancellation, and recorded bounded stale/recovery/escalation state. Probe
cleanup reported no remaining units with live processes and no temporary probe
directory. The configured `implementer` has not been launched.

## Validation

- `bun --check systemd-user-job-adapter.ts` passed with no syntax diagnostics.
- `bun test systemd-user-job-adapter.test.ts` passed: `4 pass`, `0 fail`, and
  `45 expect()` calls. The focused temporary-systemd path directly observed
  return-before-completion, durable `launch-accepted`, running/completed
  polling, unit cgroup ownership, source-labelled stdout, routed cancellation
  with `MainPID=0`, failed exit status `17`, stale-candidate representation,
  recovery attempt `1` and bounded escalation, role-substitution rejection,
  and repository status remaining active after host completion.
- The final test command was wrapped by a host monotonic timer and reported
  `host_monotonic_wall_clock_seconds=2.304`. This is focused validation elapsed
  time, not a claim about unobserved implementation time.
- `systemctl --user list-units --all --no-legend 'as-is-job-*.service'` returned
  no matching units after validation. The temporary runtime directories were
  removed by the tests; no persistent unit file, host configuration, worker,
  external service, or secret was used.
- Host-reported monetary cost is unavailable: systemd provides no provider or
  model billing observation for this adapter, so cost remains unavailable
  rather than being represented as zero or estimated.

Residual risk: the adapter depends on the local user's systemd manager and its
`StandardOutput=append:` support; this host path passed, but other managers may
return `unavailable`. Host observations never authorize task completion, and
automatic cumulative budget enforcement remains outside this adapter.

The implementation checkpoint at `2026-07-26T20:01:12Z` added only the planned
adapter and focused test files. The adapter keeps `as-is.md` authoritative,
records a durable launch request and acceptance before returning, and leaves
host completion separate from task completion. No descendant records exist;
the component has maximum depth and children of zero.

## Result

Completed the bounded dependency-free Bun-compatible systemd user-job adapter
in the declared component-only artifact set. The implementation does not
launch a real implementer: validation commands use harmless temporary shell
probes and enforce the exact `as-is -> orchestrator -> implementer` role chain.
Host unit/process/output observations remain supplementary; the component task
record is not marked completed by process exit. There are no failed or
cancelled descendants to account for, and no descendants were launched.

## Blockers And Escalations

No current blocker. A missing systemd unit handle, unavailable systemd
observation, stale checkpoint, failed job, or wrong-role mediation is reported
as unavailable/recovery/escalation state; none is treated as completion or as
permission to substitute a role.

## Recovery

The completed handoff is recoverable from this record and the scoped commit.
Private runtime state is disposable after durable observations and cleanup;
repository task records and this evidence remain authoritative. If a future
attempt is needed, reread this record, preserve its allocation, use only
`implementer` through `as-is -> orchestrator -> implementer`, and require a new
bounded launch checkpoint. Do not infer completion from process exit, missing
handles, cleaned output, or a removed temporary directory.

## Next Action

Commit only this completed component handoff with `committing-completed-work`;
the parent orchestrator may then reread this record and the scoped commit.

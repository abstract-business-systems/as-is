---
as-is-version: 2
task:
  status: completed
  worker: implementer
  updated: 2026-07-27T14:50:55Z
constraints:
  cost:
    currency: USD
    allocated: 0.35
    spent: 0.00
    reserve: 0.05
    source: unavailable
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 300
      spent-seconds: 0.531478
      reserve-seconds: 60
      source: host:monotonic-validation-wrapper
  external-effects: require-current-turn-user-approval
acceptance:
  - Implement the smallest supervisor-provided generic `delegate-component`
    tool boundary without requiring OpenCode to emit nested agent/session
    events and without making a host adapter own delegation nesting semantics.
  - Require the agent-supplied semantic caller identity of role, component
    path, durable task revision, and one-based attempt; verify every field
    against the supervisor-issued active caller binding and a fresh durable
    caller record rather than trusting an arbitrary claim.
  - Derive parent identity from the active supervisor job/tool context. Accept
    the canonical child component path plus optional expected task
    revision/attempt, resolve the child record and configured worker from
    durable records, enforce role and component scope, assign the valid attempt
    and runtime JobId, and preserve component-path/task-revision/attempt as the
    stable lookup identity with JobId diagnostic-only.
  - Return normalized durable launch status and handle diagnostics only after
    launch acceptance, and represent missing caller, mismatched caller,
    missing parent, wrong role, wrong component, duplicate attempt,
    permission denial, and unavailable supervisor as explicit non-fallbacking
    outcomes.
  - Expose/translate the same contract through the adapter seam for OpenCode,
    shell, CI, and remote hosts; the child must be able to use the same tool
    for further authorized delegation without adapter-specific nesting
    knowledge. Do not modify the accepted public status/watch or historical
    accounting components.
  - Add focused deterministic validation for caller binding, parent derivation,
    record/role resolution, attempt and JobId behavior, all named failures,
    launch-checkpoint return, and adapter-neutral request/result shape. Record
    residual risk and leave the real OpenCode smoke to
    `opencode-host-integration` after this handoff.
---

# Delegation Tool Boundary

## Purpose

Provide the smallest host-neutral agent-facing delegation boundary. An active
agent states its semantic identity to a supervisor-provided generic tool; the
supervisor verifies the identity, establishes the durable parent/child edge,
resolves the configured worker, launches the child, and returns after durable
launch acceptance. The component is a distinct implementation boundary because
the accepted supervisor, OpenCode adapter, and public status/watch components
each have narrower accepted scopes.

## Requirement

Implement the logical `delegate-component` tool contract defined in
`execution-contract.md` as a reusable supervisor-facing boundary. The request
must contain only the caller semantic identity and child component path with
optional expected task revision/attempt. The implementation must bind the
caller to an active supervisor invocation, reread durable records, derive
parentage rather than accept a caller-supplied parent, enforce the configured
worker role and component scope, assign the attempt and diagnostic-only JobId,
and return a normalized launch checkpoint/result.

This task does not add nested OpenCode event requirements, public status/watch,
historical accounting, systemd recovery, or a live provider smoke. The named
host-integration smoke is a dependent acceptance task after this boundary is
implemented. Repository instructions, design principles, and permitted skills
are centrally supplied read-only context. Named read-only specifications are
`execution-contract.md`, `orchestration-design.md`, `configuration.md`,
`opencode-adapter.md`, `component-task-record-protocol.md`, and the accepted
`subprocess-execution-foundation/`, `opencode-launch-adapter/`,
`component-status-watch/`, and `mock-job/supervisor-fixture/` components.

## Plan

1. Inspect the accepted supervisor/adapter seams and implement the normalized
   request/result boundary in this component without editing accepted
   dependency implementations. Preserve the repository record as the task
   authority and use a supervisor-issued active binding rather than a trusted
   caller field.
2. Resolve the child path/revision/attempt and configured worker from durable
   records, derive the parent from active context, enforce authority and
   duplicate/permission checks, assign runtime correlation, and return only
   after the durable launch checkpoint.
3. Add deterministic local tests for the full request/result and failure
   taxonomy, then run focused syntax, task-record, whitespace, and accepted
   seam checks. Do not contact an external model/provider or claim the real
   OpenCode smoke until the dependent host task is authorized.

## Progress

The orchestrator created this missing component record atomically after the
architectural correction. The correction replaces the previous requirement
that OpenCode task/session streams expose nested agent attribution with the
generic tool boundary: the agent states its identity, the supervisor verifies
it against active context and durable state, and the supervisor—not OpenCode—
establishes parentage and launches the configured child.

This record began as a ready handoff for the configured `implementer`. The
accepted public `component-status-watch`, historical accounting design, generic
supervisor, launch adapter, and deterministic mock remained read-only
dependencies or later integration boundaries. No descendants were authorized.

The configured `implementer` has advanced this record to `active`. The named
contracts and accepted dependency seams were reread before implementation. The
local pattern is dependency-free Bun/TypeScript with library exports, atomic
durable writes, and deterministic focused tests. This component will define a
generic adapter interface locally rather than edit an accepted host-specific
dependency; no child delegation or external service is authorized.

The implementation is complete. `delegate-component.ts` provides the typed
request/result boundary, fresh durable-record resolver, supervisor-issued
binding verification, derived parent identity, descendant/role/attempt checks,
permission preflight, atomic diagnostic JobId map, durable launch checkpoint,
stable-identity status lookup, cancellation, and cleanup. `mock-adapter.ts` is
a deterministic timer-only fixture adapter; it creates no process, session,
provider, or network side effect. `delegate-component.test.ts` is the focused
component validation and all fixtures use temporary owned roots.

The local dependency-free Bun/TypeScript pattern was used as requested. The
only material local resolution convention is the optional record body section
`## Execution Resolution`: it carries adapter, permission-profile,
job-specification, and authority data resolved from durable state, keeping the
machine request free of duplicated task scope. It is not a new public manifest
key; absent or malformed resolution is an explicit unavailable outcome. No
accepted dependency implementation or shared contract file was changed.

## Validation

`verification-discipline` selected the focused functional path because this is
a user-visible, durable launch boundary. The final validation commands and
direct observations were:

- `bun test delegation-tool-boundary/delegate-component.test.ts` reported **10
  pass, 0 fail, 120 expect() calls**. The tests directly covered all four
  caller fields against an active binding and a fresh record; parent derivation
  and rejection of parent/free-form claims; role and descendant scope; task
  revision and one-based attempt resolution; duplicate/conflicting handling;
  permission denial and `awaiting-user-approval`; diagnostic JobId map and
  path/revision/attempt status; launch-checkpoint return before timer
  completion; cancellation and cleanup; and one identical seam for
  `opencode`, `shell`, `ci`, and `remote` adapter labels.
- The host-monotonic repeated-cleanup command was:
  `python3 -c 'import subprocess,time,sys; started=time.monotonic_ns();
  codes=[]; [codes.append(subprocess.run(["bun","test","delegation-tool-boundary/delegate-component.test.ts"],cwd="/home/vc/dev/trial/as-is").returncode) for _ in range(3)]; elapsed=(time.monotonic_ns()-started)/1_000_000_000; print(f"HOST_MONOTONIC_WALL_CLOCK_SECONDS={elapsed:.6f}"); print(f"RUN_EXIT_CODES={codes}"); sys.exit(0 if all(code == 0 for code in codes) else 1)'`.
  It reported three runs of **10 pass, 0 fail, 120 expect() calls**,
  `HOST_MONOTONIC_WALL_CLOCK_SECONDS=0.531478`, and
  `RUN_EXIT_CODES=[0, 0, 0]`.
- `bun --check delegation-tool-boundary/delegate-component.ts` and
  `bun --check delegation-tool-boundary/mock-adapter.ts` exited `0`.
  `bun --check delegation-tool-boundary/delegate-component.test.ts` is not an
  applicable Bun test check on this host and reported `Cannot use test outside
  of the test runner`; the focused Bun suite is the applicable test syntax and
  behavior check. `bun build --no-bundle <each of the three component .ts
  files> --outfile /dev/null` transpiled all three successfully.
- `python3 schemas/task-record-validator/task_record_validator.py
  delegation-tool-boundary` reported `VALID`. `git diff --check --
  delegation-tool-boundary` produced no diagnostics.
- The focused tests asserted `activeCount: 0` and `leftoverProcessCount: 0`
  after every fixture; each temporary root was removed after evidence was
  collected. The independent post-bundle process check reported
  `NO_DELEGATE_TEST_PROCESSES`. No OpenCode, model, provider, network, or real
  worker process was invoked.

Host-reported monetary cost is **unavailable**. `constraints.cost.spent:
0.00` remains the supplied non-billing placeholder and is not a cost claim.
The available host-observed monotonic wall-clock use is **0.531478 seconds**
for the repeated final validation bundle, below the 300-second allocation; it
is the recorded fallback metric, not a measurement of provider usage or the
full implementer turn.

The evidence supports each acceptance condition and this record has no
descendants (`maximum-children: 0`); the terminal descendant set is therefore
empty. The real OpenCode smoke remains intentionally outside this component.

## Result

The smallest host-neutral generic `delegate-component` boundary is implemented
and its scoped deterministic evidence passes. The agent request contains only
the caller semantic identity and child path with optional expected revision and
attempt. Parent identity is derived from the active supervisor job context;
child worker, constraints, authority, adapter, permission profile, revision,
and valid attempt are resolved from the fresh durable record. The durable
launch checkpoint is written before a `started` result is returned, while
JobId remains diagnostic-only and path/revision/attempt remains the lookup
identity. Named failure classes are explicit and non-fallbacking. Cancellation
and cleanup preserve the durable record and leave the fixture runtime empty.

Exact changed-artifact set for this component is:

- `delegation-tool-boundary/delegate-component.ts`
- `delegation-tool-boundary/mock-adapter.ts`
- `delegation-tool-boundary/delegate-component.test.ts`
- `delegation-tool-boundary/as-is.md`

No descendants were delegated, so there are no failed or cancelled descendants
to account for.

## Blockers And Escalations

No implementation blocker remains. Residual limitations are the unavailable
host billing surface, the injected adapter/active-binding seam, and the
optional record-local `Execution Resolution` serialization. A host that cannot
carry the supervisor-issued binding, fresh durable records, proactive
permission result, adapter launch acceptance, or durable checkpoint must report
`unavailable-supervisor`; it may not add OpenCode-specific nesting, a direct
worker, or a foreground fallback. Live OpenCode mediation and provider smoke
remain the separate `opencode-host-integration` boundary.

## Recovery

The durable recovery checkpoint is this completed record plus the four
component-local files named above. On interruption before handoff, reread the
record and rerun `bun test
delegation-tool-boundary/delegate-component.test.ts` with the configured
`implementer`; temporary fixture roots and timer handles are disposable and no
runtime state is needed for recovery. Preserve the stable identity and
non-fallbacking failure taxonomy. Do not edit the parent, host-integration,
accepted status/watch, supervisor, adapter, mock, accounting, control-plane, or
retired systemd artifacts.

## Next Action

Invoke `committing-completed-work` for this component only, staging the three
implementation/test artifacts and this record while leaving all unrelated
pre-existing work untouched. The parent may independently review the scoped
commit and then allow the separate `opencode-host-integration` task to perform
the fresh real smoke; this handoff does not claim host session/event or provider
evidence.


# Control Plane Implementation Conversion

## Purpose

Provide the first bounded child handoff for converting the initiative-1
host-neutral control-plane implementation from its currently reported Python
form to the repository-preferred Bun/TypeScript or Bun-compatible form without
changing authority, task-record semantics, or the protected historical fixture.

## Requirement

Starting from this component record, inspect the explicitly named root artifacts
`control_plane.py`, `test_control_plane.py`, and `control-plane.md`, plus the
repository's local runtime and test patterns. Use the centrally supplied
`config.technology-preferences.runtime: bun` and `package-manager: bun` as
read-only preference context after higher-authority requirements and local
patterns. Define the exact target files in this record before editing, then
make the complete bounded conversion inside `components/control-plane/` only. The named
root artifacts are read-only external dependencies for this child; the parent
orchestrator owns any later nearest-common-ancestor integration.

## Plan

Advance this record to `active`, inspect the named dependencies and applicable
local patterns, document the target artifact set and acceptance mapping, make
the implementation and test changes in this component, run focused
deterministic validation, and leave a recoverable handoff. Do not modify the
root record, sibling records, historical fixtures, or host state.

## Progress

Created atomically by the root orchestrator at `2026-07-26T18:05:39Z`.
The configured `implementer` has accepted the canonical handoff and advanced
this record to `active` at `2026-07-26T18:07:00Z`. Dependency and local-pattern
inspection is complete. The declared Bun/TypeScript implementation and focused
test artifacts were then created inside this component.

### Target artifact set and acceptance mapping (recorded before code edits)

- `components/control-plane/control-plane.ts` — the Bun-runnable, dependency-free
  TypeScript implementation ported from the named root `control_plane.py`.
  It covers record-only status/general questions, durable question/answer/
  approval/cancellation ordering, parent-orchestrator delegation, the one-leaf
  limit, descendant closure, unavailable observations, and the unimplemented
  OpenCode live-control boundary (acceptance items 2–4).
- `components/control-plane/control-plane.test.ts` — focused deterministic Bun tests
  ported from the named root `test_control_plane.py`, covering the same
  record-only and durable-transition paths plus protected constraint behavior
  (acceptance items 2–4).
- `components/control-plane/as-is.md` — this durable task record only, for lifecycle,
  validation, recovery, and handoff evidence (acceptance items 1 and 5).

No package manifest or dependency is required: the supplied `runtime: bun` and
`package-manager: bun` preference supports direct TypeScript execution and the
implementation uses Bun/standard runtime APIs only. This is the material local
departure from the named root implementation: Python is replaced by TypeScript
and Bun's test runner, while the host-neutral record contract and documented
OpenCode boundary remain unchanged. Root artifacts remain read-only external
dependencies; any nearest-common-ancestor integration is a parent integration
boundary and is not part of this child change.

The target set was implemented without changing the named root artifacts,
`validation-fixtures/increment-5-cost-observability`, sibling records, or host
state. This component has no descendant task records, so descendant closure is
terminal for this handoff.

## Validation

Verification-discipline selected a focused standard-risk check because this is
a bounded implementation conversion with durable-record semantics:

- `/usr/bin/time -f 'wall-clock-seconds=%e' sh -c 'bun test components/control-plane/control-plane.test.ts && bun build components/control-plane/control-plane.ts --target bun --outfile /dev/null'`
  exited `0`. Bun reported `3 pass`, `0 fail`, and `28 expect() calls` for the
  focused tests. The Bun build reported `Bundled 1 module` and completed with
  no diagnostics. The tests directly exercised record-only status/general
  questions, unavailable observations, durable question/answer/approval/
  cancellation ordering, higher-authority constraint rejection, queued parent
  delegation, the one-leaf limit, and failed/cancelled descendant accounting.
- `git diff --no-index --check /dev/null` for each of the three component
  artifacts exited with the expected no-index difference status and produced
  no whitespace diagnostics.

The host-observed wall-clock for the combined final Bun test/build command was
`0.05` seconds. This is validation-process elapsed time, not a cumulative task
clock. Actual host-reported monetary cost is unavailable; `constraints.cost`
therefore remains `spent: 0.00` with source `unavailable`. Cumulative task
wall-clock accounting is also unavailable; the observed validation elapsed
time is recorded here without treating it as a budget estimate.

Acceptance mapping evidence: the target decision and material TypeScript/Bun
departure were recorded before code edits; the implementation and focused
tests are inside this component; the durable ordering, one-leaf limit,
descendant closure, unavailable observations, and record-only separation are
covered by the passing tests; and no OpenCode live-control path was added.

## Result

The configured `implementer` completed the bounded control-plane conversion.
`components/control-plane/control-plane.ts` provides the dependency-free Bun/TypeScript
host-neutral record operations and CLI boundary, and
`components/control-plane/control-plane.test.ts` provides the focused deterministic Bun
coverage. The protected historical fixture and all artifacts outside this
component were left untouched by this handoff. The child has no non-terminal
descendants and is eligible for a scoped completed-work commit.

Nearest-common-ancestor integration is a parent integration boundary: the
named root `control_plane.py`, `test_control_plane.py`, and `control-plane.md`
remain read-only external dependencies for this child. The parent orchestrator
must decide how to integrate the new Bun implementation without crossing this
component's scope.

## Blockers And Escalations

No implementation or validation blocker remains for this component. Parent
integration is intentionally outstanding at the nearest common ancestor and
must not be performed by this child. The OpenCode live-control boundary remains
documented but unimplemented. Host lifecycle, external-effect, concurrency,
and arbitrary-YAML compatibility remain outside the evidence collected here.

## Recovery

The recovery checkpoint is this completed record at
`2026-07-26T18:12:08Z`, plus `components/control-plane/control-plane.ts` and
`components/control-plane/control-plane.test.ts`. On interruption before parent review,
reread this record and rerun the final focused Bun command; preserve the
cumulative observations and do not infer root integration from process exit,
missing runtime state, or the previous Python validation. Do not edit the
protected fixture or root artifacts from this component.

## Next Action

The parent orchestrator must independently review this scoped handoff, assess
the parent integration boundary, and choose any authorized nearest-common-
ancestor integration. No sibling work, fixture retry, OpenCode live-control
implementation, or root-record edit is authorized by this child completion.

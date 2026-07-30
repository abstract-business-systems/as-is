---
change-log-version: 1
summary:
  scope: repository-history
  aggregation: cumulative-by-component-path-task-revision-attempt
  attribution-boundary: worker-subtree
  completeness: incomplete
  cost:
    value: unknown
    currency: USD
    source: historical change-log entries; no complete deduplicated observation set
    unknown: true
  wall-clock:
    value: unknown
    unit: seconds
    source: historical change-log entries; no complete deduplicated observation set
    unknown: true
  build-count: unknown
  fail-count: unknown
  count-source: historical entries do not provide a complete build/failure event set
  unknown-semantics: unknown is not zero; an unavailable observation is retained as unavailable
  update-rule: upsert one finalized worker-subtree observation per stable key; corrections supersede rather than add
---

# Change Log

This concise log records why historical task work was deferred, cancelled, or
retired, the relevant Git lineage, and the recovery point. It is not task
authority, a backlog, a runtime index, or a substitute for a current root or
component `as-is.md`. Historical detail remains recoverable through Git history;
entries below intentionally do not duplicate full task records or preserve
secrets.

## Summary And Accounting Convention

The front matter is the current cumulative overview of finalized observations,
not a budget and not a claim that every historical run is represented. The
summary is cumulative across the repository's history, but only the canonical
`worker-subtree` attribution boundary contributes to its cost, wall-clock,
build, and failure totals. A `full-invocation` observation is retained in its
entry as a non-additive end-to-end view; it is not added to the worker-subtree
total. Parent allocations are authorization evidence, not actual use, and a
child's actual use is not copied into the parent summary.

Every counted observation carries the stable key
`component-path/task-revision/attempt` and an attribution boundary. Repeated
polls, checkpoints, or supervisor `JobId` aliases for the same key update one
observation and do not increment a total. A retry or recovery that starts a new
worker invocation increments the attempt and is a new observation. A correction
uses the same key and supersedes the prior value; it is not a second
observation. The component path is the durable identity; `JobId` is only a
diagnostic runtime alias.

`build-count` counts unique observations explicitly classified as a build,
whether they succeed or fail. `fail-count` counts unique observations whose
final durable outcome is `failed`, including a failed build and a failed task
attempt; a cancellation or block is not a failure unless it is explicitly
classified as one. A failed build therefore contributes once to each count,
while a failed non-build attempt contributes only to `fail-count`.

Numeric cost is summed only when all included canonical observations have
numeric values in the same currency. Numeric wall-clock values are summed only
when all included observations have numeric seconds from compatible sources.
An individual host measurement that cannot be supplied is recorded as
`unavailable` with its source and is never converted to zero. A cumulative
summary with any unresolved included observation is `unknown` (and retains the
known observations and reason in the relevant entry); `unknown` likewise is
not zero. Currency and unit remain explicit even when the cumulative value is
unknown. Historical facts below remain separate from this design summary and
are not retroactively remeasured.

When a task reaches a durable handoff, failure, cancellation, or retirement,
the responsible owner adds or updates one concise entry for each finalized
observation key. A parent entry may record a full invocation, but must mark it
non-additive when child worker-subtree entries are also present. This update
rule lets the front-matter summary evolve without double counting and keeps the
change log an overview rather than a second task record or runtime ledger.

## Retention Convention

- Current and recoverable work uses the root or component `as-is.md` record.
- Historical committed state is recovered from Git history, normally starting
  at the named recovery point and then inspecting the relevant scoped commit.
- Before removing a tracked, untracked, or ignored historical artifact, inspect
  consumers, ownership, audit/recovery value, and recreation cost. Git does not
  preserve uncommitted content; retain its necessary concise facts here or make
  a separately authorized scoped evidence commit before removal.
- Do not create or depend on `task-archives/` or another archive-folder task
  tree. A future task that needs historical implementation detail must use Git
  evidence and a new authorized current task record.

## 2026-07-27 — Retired systemd user-job flow

- **Disposition:** Cancelled/superseded, not completed. The blocked repair was
  made unnecessary by the accepted subprocess execution foundation, commit
  `e8fb1da`.
- **Relevant commits:** `3e54fcd` is the prior scoped systemd baseline;
  `e8fb1da` is the accepted subprocess replacement. The pre-migration
  repository checkpoint is `e8fb1da`.
- **Recovery point:** Inspect `git show 3e54fcd` for the committed baseline and
  the pre-migration `e8fb1da` checkout for the repository state immediately
  before this migration. No archive path is a recovery surface.
- **Uncommitted evidence assessment:** The removed repair snapshot was not in
  Git. The necessary facts retained here are that its configured worker was
  `implementer`, its record was blocked after worker/session loss, its only
  intended repairs were task-record indentation and confirmed cleanup
  termination, the validator raised a `TypeError` on the unavailable cost
  value, and no current repair validation or completion handoff existed. The
  full adapter/test snapshot was not a supported consumer and was not
  byte-preserved. No secret or runtime credential was present.
- **Consumer and host assessment:** The adapter and focused test were the only
  implementation consumers found; remaining references were durable historical
  prose. The final host audit found no matching retired user job or live
  process. No systemd recovery path remains active.

## 2026-07-27 — Retired unscheduled planning records

- **`blocked-item-visibility`:** Cancelled/retired while still `ready`; it had
  no worker attempt, validation, cost, or wall-clock observation. Its purpose
  was a later visibility experiment, not current work. Recovery point:
  pre-migration `e8fb1da`; the concise source snapshot was tracked before this
  migration, but no worker implementation commit exists.
- **`opencode-server-mode-observation`:** Cancelled/retired while still
  `ready`; it had no worker attempt, validation, cost, or wall-clock
  observation. Its bounded local evidence question is superseded by the
  accepted execution foundation's documented host boundary. Recovery point:
  pre-migration `e8fb1da`; no worker implementation commit exists.
- Neither record was retried, marked completed, or used as a role-substitution
  reason. Their former snapshots are recoverable from Git history only.

## 2026-07-27 — Retained historical cost-observability outcome

- **Disposition:** Cancelled/retired as historical blocked/no-retry evidence;
  it is not an active descendant and must not be retried.
- **Observation identity:** Historical component path
  `validation-fixtures/increment-5-cost-observability`; task revision and
  attempt ordinals were not retained in the concise entry, so this observation
  is preserved as historical evidence and excluded from the deduplicated
  cumulative summary.
- **Relevant commits:** `e9b740b` added the README fixture and `e9aaa10`
  grouped the fixture and record under the validation-fixtures tree.
- **Recovery point:** `e9aaa10` for the grouped tracked record, or the
  pre-migration `e8fb1da` checkout for the last repository state before this
  migration.
- **Necessary facts:** The configured `implementer` was not reached; a
  wrong-role `general` mediation timed out. The record retained model/token-
  derived OpenCode cost `0.0981479` USD and mixed-source elapsed observation
  `81.994` seconds, neither provider billing nor automatic budget enforcement.
  The explicit no-retry boundary remains in this entry. No uncommitted
  implementation evidence was removed for this fixture.

## 2026-07-27 — OpenCode mediation dogfood observation

- **Disposition:** Completed historical validation fixture; this entry preserves
  the observed result and does not authorize host integration.
- **Observation identity:** Component path
  `validation-fixtures/opencode-mediation-dogfood`; task revision and attempt
  ordinal were not recorded in the historical handoff, so the values remain a
  separately preserved fact rather than a deduplicated cumulative contribution.
- **Observed facts:** The configured `as-is -> orchestrator -> implementer`
  mediation reached the worker. OpenCode model/token-derived cost was
  `0.0525789` USD and the parent monotonic duration was `50.502114668` seconds;
  neither is provider billing or automatic cumulative enforcement.
- **Lineage:** Worker commit `2e9d4fd`; parent reconciliation `c4f0181`.

## 2026-07-29 — Spawning-pi-subagents detached handle registry

- **Observation identity:** Component path `skills/spawning-pi-subagents`;
  task revision `detached-handle-registry`; attempt 1.
- **Relevant commit:** `6e9a7e1`.
- **Observed facts:** Worker-subtree wall-clock was approximately `150` seconds;
  host-reported cost was unavailable.
- **Residual risk:** Orphan detection/recovery is not solved, and wall-clock use
  is not surfaced to the parent as a first-class observation.

## 2026-07-30 — Delegation-spec status correction and validation ownership clarification

- **Disposition:** Documentation correction only. No implementation code or task authority changed.
- **Corrected status:** In `independent-delegation.md`, backlog items 1, 3, and 4 were moved from the open-decision list to a resolved/effectively-answered status because the repository now has durable answers for the file-backed detached registry, record-plus-session-log observation, and the historical sequencing question. Backlog item 2 remains the genuinely open decision.
- **Validation ownership:** The generic validation-agent follow-up was recorded under `schemas/task-record-validator/as-is.md` as a minimal different-model review/report contract that checks a child's completion claim against the task requirement, changed artifacts, and evidence.
- **Recovery point:** Read the updated durable records directly; no archive folder or additional runtime artifact was created.
- **Residual risk:** The resolved/effectively-answered decisions remain descriptive of the current repository state, not a claim that future implementations are forbidden from revisiting the underlying design space.

## 2026-07-28 — Spawning-pi-subagents budget enforcement

- **Disposition:** Completed bounded implementation. The synchronous launcher
  now enforces a hard wall-clock budget at the process level and forwards time
  and money constraints to the executing agent.
- **Observation identity:** Component path `skills/spawning-pi-subagents`;
  task revision was not retained in the record, so attempt 1 is preserved as a
  finalized fact and excluded from the deduplicated cumulative summary.
- **Relevant commits:** Worker scoped handoff `9dc2090`.
- **Observed facts:** Worker-subtree wall-clock was `150` seconds
  (host-observed); monetary cost was `unavailable` from the launcher, so the
  cumulative cost summary remains `unknown`. No build or failure was
  classified.
- **Residual risk:** Pi cost is not directly observable from the launcher;
  cost enforcement is forwarded to the child for self-limiting and is an
  approximation. The wall-clock budget bounds only the child run and has a
  short SIGKILL grace after SIGTERM.

## 2026-07-27 — Execution accounting and identity design

- **Disposition:** Design-only, independently verifiable, and intentionally
  before implementation. No worker was launched and no application or
  component implementation code was changed.
- **Design authority:** `execution-accounting-design.md`, linked from the
  component task-record, execution, orchestration, configuration, and current
  task-context specifications.
- **Measurement status:** This entry records no new cost, wall-clock, build, or
  failure measurement. The front-matter summary remains `unknown` where the
  historical set cannot be proven complete; existing measured facts remain in
  their historical entries above.

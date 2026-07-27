# Change Log

This concise log records why historical task work was deferred, cancelled, or
retired, the relevant Git lineage, and the recovery point. It is not task
authority, a backlog, a runtime index, or a substitute for a current root or
component `as-is.md`. Historical detail remains recoverable through Git history;
entries below intentionally do not duplicate full task records or preserve
secrets.

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

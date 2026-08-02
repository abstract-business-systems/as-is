---
name: committing-completed-work
description: Creates a scoped Git commit for a completed as-is task without staging unrelated work. Use after completion evidence and descendant closure have been recorded.
---

# Committing Completed Work

Commit a completed task's durable handoff as one reviewable, recoverable Git
change. This skill is a completion procedure, not permission to commit partial,
unrelated, or unvalidated work.

## Preconditions

- The transient `task.md` is eligible for `completed` under the component
  task-record protocol: its acceptance conditions have evidence and every
  descendant task is terminal.
- The result accounts for each failed or cancelled descendant.
- Required validation evidence and residual risk are recorded in the task
  record.

## Method

1. Inspect `git status`, the relevant unstaged diff, the staged diff, and recent
   commit-message style.
2. Identify only the completed component's declared changed artifacts, its
   durable `as-is.md`, and `changelog.md`. Do not stage transient `task.md`. For
   a parent integration task, include only parent-scoped integration artifacts.
3. Leave pre-existing, unrelated, and out-of-boundary changes unstaged. If task
   changes cannot be separated safely, leave the record non-completed, record
   the blocker, and request the responsible component-builder's direction.
4. Run the smallest relevant validation, then verify the proposed staged patch
   with `git diff --cached --check`.
5. Set the task to `completed`, write its concise summary to `changelog.md`,
   remove `task.md`, stage only the identified durable handoff, and create one
   concise commit matching established repository style.
6. Reinspect `git status` and report the commit identifier, staged scope,
   validation evidence, and any unrelated work left untouched.

## Boundaries

- Never amend, force-push, push, change branches, alter remotes, or include
  secrets.
- Never stage all changes indiscriminately.
- On commit failure, restore the record to a recoverable non-completed state and
  record the failure, without discarding work.
- Do not add a commit hash to the task record after the commit solely to record
  it; the Git history is authoritative and avoids a follow-up dirty record.

## Quality Checks

- The commit contains the completed record and only its scoped handoff.
- `git diff --cached --check` passes before the commit.
- The worktree confirms unrelated changes remain unstaged.
- The task was eligible for completion before the commit was attempted.

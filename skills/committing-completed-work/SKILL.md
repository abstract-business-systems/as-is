---
name: committing-completed-work
description: Creates a scoped Git commit for a completed as-is task without staging unrelated work. Use after completion evidence and descendant closure have been recorded.
---

# Committing Completed Work

Commit a completed task's durable handoff as one reviewable, recoverable Git
change. This skill is a completion procedure, not permission to commit partial,
unrelated, or unvalidated work.

## Preconditions

- The transient `tasks.md` is eligible for `completed` under the component
  task-record protocol: its acceptance conditions have evidence and every
  descendant task is terminal.
- The result accounts for each failed or cancelled descendant.
- Required validation evidence and residual risk are recorded in the task
  record.

## Method

1. Inspect `git status`, the relevant unstaged diff, the staged diff, and recent
   commit-message style.
2. Identify only the completed component's declared changed artifacts, its
   durable `as-is.md`, and `changelog.md`. Do not stage transient `tasks.md`. For
   a parent integration task, include only parent-scoped integration artifacts.
3. Leave pre-existing, unrelated, and out-of-boundary changes unstaged. If task
   changes cannot be separated safely, leave the record non-completed, record
   the blocker, and request the responsible component-builder's direction.
4. Run the smallest relevant validation, then verify the proposed staged patch
   with `git diff --cached --check`.
5. Set the task to `completed`, write its concise summary to `changelog.md`,
   remove `tasks.md`, stage only the identified durable handoff, and create one
   concise commit matching established repository style. When consolidating
   related local handoff commits, preserve their full source SHAs in the task
   evidence or commit message and record the resulting integration SHA in the
   durable parent task/changelog evidence after the commit exists; never attempt
   self-referential inclusion of the new commit's own SHA.
6. After the durable handoff exists, reconcile the exact selected backlog item
   through the owning backlog procedure. Run
   `bun skills/managing-backlog/scripts/query.ts --cleanup=component:id .`,
   replacing `component:id` with the exact selected backlog identity. Verify
   that the result names that exact selected `component:id`, and leave failed,
   blocked, or otherwise unreconciled rows untouched. Review any additional
   reported rows separately; cleanup is evidence-gated and is not authorization
   to infer completion.
7. Reinspect `git status` and report the commit identifier, staged scope,
   validation evidence, and any unrelated work left untouched.

## Boundaries

- Never amend, force-push, push, change branches, alter remotes, or include
  secrets.
- Never stage all changes indiscriminately.
- On commit failure, restore the record to a recoverable non-completed state and
  record the failure, without discarding work.
- Do not add a commit hash to the task record after the commit solely to record
  it; the Git history is authoritative and avoids a follow-up dirty record.
  For parent integration, the parent records the resulting SHA after creation
  using its established integration evidence convention, rather than requiring
  the child commit to contain its own SHA.

## Quality Checks

- The commit contains the completed record and only its scoped handoff.
- `git diff --cached --check` passes before the commit.
- The worktree confirms unrelated changes remain unstaged.
- The task was eligible for completion before the commit was attempted.

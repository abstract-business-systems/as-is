---
name: committing-completed-work
description: Creates a scoped Git commit for a completed as-is task without staging unrelated work. Use after completion evidence and descendant closure have been recorded.
---

# Committing Completed Work

Commit a completed task's durable handoff as one reviewable, recoverable Git
change. The finalization unit includes the owning changelog summary, exact
evidence-gated backlog-row removal, and configured transient task-artifact
cleanup; task cleanup and backlog clearance must not be committed separately.
This skill is a completion procedure, not permission to commit partial,
unrelated, or unvalidated work.

## Preconditions

- The local `task` object in `as-is.json` is eligible for `completed` under the
  component task-record protocol: its acceptance conditions have evidence and
  every descendant task is terminal.
- The result accounts for each failed or cancelled descendant.
- Required validation evidence and residual risk are recorded in the task
  record.

## Method

1. Inspect `git status`, the relevant unstaged diff, the staged diff, and recent
   commit-message style.
2. Identify the completed component's declared changed artifacts, its durable
   `as-is.md`, `changelog.md`, exact selected backlog row, and configured task
   artifacts. The finalization patch must include the changelog summary, the
   exact backlog removal, and task metadata/narrative cleanup together. For a
   parent integration task, include only parent-scoped integration artifacts.
3. Leave pre-existing, unrelated, and out-of-boundary changes unstaged. If task
   changes cannot be separated safely, leave the record non-completed, record
   the blocker, and request the responsible component-builder's direction.
4. Run the smallest relevant validation, then verify the proposed staged patch
   with `git diff --cached --check`.
5. Set the local JSON `task` object to `completed`, write its concise summary
   to `changelog.md`, and prepare the exact selected backlog cleanup without
   treating either working-tree mutation as durable completion. Stage the
   changelog summary, exact backlog-row removal, task metadata/narrative
   cleanup, and declared durable handoff as one finalization patch. Verify the
   complete staged patch and create one concise commit matching established
   repository style; never create a task-deletion-only or backlog-clearance-only
   commit. If staging or commit fails, restore the task and backlog to a
   recoverable non-terminal/unreconciled state before retrying. When consolidating
   related local handoff commits, preserve their full source SHAs in the task
   evidence or commit message and record the resulting integration SHA in the
   durable parent task/changelog evidence after the commit exists; never attempt
   self-referential inclusion of the new commit's own SHA.
6. Before committing, invoke the owning backlog procedure with the exact
   selected identity and require its changelog-evidence result. Apply only the
   selected row removal to the final staged patch; verify that the result names
   that exact `component:id`, and leave failed, blocked, or otherwise
   unreconciled rows untouched. Do not commit the cleanup command's result
   separately. Review any additional reported rows separately; cleanup is
   evidence-gated and is not authorization to infer completion.
7. Reinspect the complete staged finalization patch, commit once, then verify
   the commit contains the changelog summary, exact backlog removal, and task
   cleanup together. Report the commit identifier, staged scope, validation
   evidence, and any unrelated work left untouched.

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

- One finalization commit contains the completed component handoff, changelog
  summary, exact selected backlog removal, and configured task-artifact cleanup.
- No separate task-deletion or backlog-clearance commit is created.
- `git diff --cached --check` passes before the commit.
- The worktree confirms unrelated changes remain unstaged.
- The task was eligible for completion before finalization was attempted.

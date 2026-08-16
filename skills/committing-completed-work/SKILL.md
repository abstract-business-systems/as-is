---
name: committing-completed-work
description: Creates a scoped Git commit for a completed as-is task without staging unrelated work. Use after completion evidence and descendant closure have been recorded.
---

# Committing Completed Work

Use this procedure to prepare and commit an authorized completed task's
 durable handoff as the second of two reviewable, recoverable Git changes. The
first task-start handoff commits the selected backlog status and active task
metadata/narrative. After validation, this completion handoff commits the
owning changelog summary, exact evidence-gated backlog-row removal, and
configured task-artifact cleanup together. This procedure supplies commit
mechanics and evidence gates; it does not grant commit authority, decide
semantic completion, or permit partial, unrelated, or unvalidated work.

## Inputs And Stopping

Inputs are the authorized completed task record, declared changed artifacts, validated evidence, exact selected backlog identity, and a cleanly separable scoped diff. Outputs are one reviewed completion patch or a recorded commit blocker and recovery action. This procedure stops when the patch is safely committed or when a precondition, scope, staging, or commit gate fails; it does not infer completion.

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
   artifacts. The completion patch must include the changelog summary, exact
   backlog removal, and task metadata/narrative cleanup together. For a parent
   integration task, include only parent-scoped integration artifacts.
3. Leave pre-existing, unrelated, and out-of-boundary changes unstaged. If task
   changes cannot be separated safely, leave the record non-completed, record
   the blocker, and request the responsible component-builder's direction.
4. Run the smallest relevant validation, then verify the proposed staged patch
   with `git diff --cached --check`.
5. After the authorized task manager verifies acceptance and descendant
   closure, it sets the local JSON `task` object to `completed`; the worker
   writes its concise summary to `changelog.md`, and task management prepares
   the exact selected backlog cleanup. Stage the changelog summary, exact
   backlog-row removal, task metadata/narrative cleanup, and declared durable
   handoff as the second completion patch. Verify the complete staged patch and
   create one concise completion commit matching established repository style;
   do not create a task-deletion-only or backlog-clearance-only commit. If
   staging or commit fails, restore the task and backlog to a recoverable
   non-terminal/unreconciled state before retrying.
   When consolidating
   related local handoff commits, preserve their full source SHAs in the task
   evidence or commit message and record the resulting integration SHA in the
   durable parent task/changelog evidence after the commit exists; never attempt
   self-referential inclusion of the new commit's own SHA.
6. Before the second commit, have authorized task management invoke the
   owning backlog procedure with the exact selected identity and require its
   changelog-evidence result. Apply only the selected row removal to the
   completion patch; verify that the result names that exact `component:id`,
   and leave failed, blocked, or otherwise unreconciled rows untouched. Review
   any additional reported rows separately; cleanup is evidence-gated and is
   not authorization to infer completion.
7. Reinspect the complete staged completion patch, commit once, then verify
   the second commit contains the changelog summary, exact backlog removal, and
   task cleanup together. Report both the task-start and completion commit
   identifiers, staged scopes, validation evidence, and unrelated work left
   untouched.

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

- The first task-start commit contains the selected backlog status and active
  task metadata/narrative.
- The second completion commit contains the completed component handoff,
  changelog summary, exact selected backlog removal, and configured
  task-artifact cleanup.
- No standalone task-deletion or backlog-clearance commit is created.
- `git diff --cached --check` passes before each commit.
- The worktree confirms unrelated changes remain unstaged.
- The task was eligible for completion before the second commit was attempted.

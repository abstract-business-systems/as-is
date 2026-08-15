# Task

## Requirement
Correct the completion flow to use two intentional commits. Commit 1 begins work by marking the selected backlog row and creating the active task metadata/narrative. After validation, commit 2 completes work by writing the owning changelog evidence, removing the exact backlog row, and deleting the paired task artifacts. Update the relevant skills and authoritative lifecycle records to describe this two-commit flow. Preserve task authority, schema, identity checks, component ownership, recovery, and runtime behavior.

## Plan
1. Inspect the current atomic-finalization guidance and the user's requested two-commit lifecycle.
2. Update committing, implementing, backlog, task-record, and execution-contract guidance so task start is one commit and completion cleanup is one second commit; clarify changelog timing and exact cleanup evidence.
3. Validate content/navigation, backlog, task-record, JSON, focused two-commit flow assertions, and whitespace; obtain final expert review.
4. Commit the documentation/protocol correction with selected backlog status and active task artifacts as the first commit.
5. Record completion evidence, commit changelog + exact backlog removal + task-artifact deletion as the second commit, then pause.

## Scope
In scope: root `as-is.json`, root `tasks.md`, root `backlog.md`, root `changelog.md`, `skills/committing-completed-work/SKILL.md`, `skills/implementing-component-tasks/SKILL.md`, `skills/managing-backlog/SKILL.md`, `docs/component-task-record-protocol.md`, `docs/execution-contract.md`, corresponding durable records/changelogs, and root task-flow evidence. Out of scope: runtime/source/tool behavior, task schema redesign, cleanup algorithm identity semantics, host integration, and descendants.

## Acceptance
- Commit 1 is explicitly the task-start handoff: selected backlog status plus active `as-is.json` task and `tasks.md` are committed together.
- Commit 2 is explicitly the completion handoff: changelog completion evidence, exact backlog-row removal, and deletion of the paired task artifacts are committed together.
- The changelog is written before exact cleanup eligibility is evaluated; failed/interrupted work remains recoverable; no standalone task-deletion or backlog-clearance commit is prescribed.
- Existing task authority, schema, exact identity/evidence gates, component ownership, and runtime behavior remain unchanged.
- Focused content/navigation, backlog, task-record, JSON, flow, and whitespace validation passes; final expert review approves the flow; no descendants are authorized.

## Progress
Started from clean baseline `6cc8241` after recovering an incomplete prior finalization. The previous atomic-finalization correction incorrectly treated task cleanup and backlog cleanup as one commit after a separate implementation commit. User correction requires two explicit commits: start commit selects backlog and creates task artifacts; completion commit writes changelog, removes backlog, and deletes task artifacts. Updated the relevant skills, durable records, task protocol, and execution contract accordingly.

## Validation
Passed for the first task-start handoff: `python3 components/task-record-validator/task_record_validator.py .` reported `VALID`; `bun skills/managing-as-is-document/content-test.ts` reported 46 records and 47 diagrams; `bun skills/managing-backlog/content-test.ts` passed; `python3 -m json.tool as-is.json` passed; `git diff --check` passed; and focused assertions confirmed first-start/active-artifact, second-completion, changelog-before-eligibility, exact-identity, recovery, and no-standalone-cleanup rules. Final read-only expert review approved the first scoped commit. Completion validation and second-commit evidence remain pending by design.

## Result
The task-start handoff is ready for its first scoped commit. The task remains active until the completion handoff is performed in the second commit.

## Blockers And Escalations
No blocker currently. Do not rewrite task schema or cleanup implementation; this task changes lifecycle sequencing and documentation only.

## Recovery
If the first commit fails, keep the backlog/task pair active and retry without claiming work started. If the second commit fails after cleanup preparation, restore the exact backlog row and task artifacts or preserve them from the pre-cleanup state; do not commit partial completion cleanup. The two commits must remain distinguishable in history.

## Next Action
Commit the selected backlog row, active `as-is.json` task, `tasks.md`, and updated flow contracts together as the first task-start commit; then continue validation and prepare the second completion commit.

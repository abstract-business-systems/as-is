# Task

## Requirement
Reconcile the exact `detached-watchdog` backlog identity as a documentation-only completion handoff. Map the existing detached launcher and shared bounded-process watchdog behavior to the backlog acceptance using fresh provider-free tests. Preserve the separation between mechanical process lifetime enforcement, launcher observation, and task/retry authority. Do not modify launcher, supervisor, roles, tools, task records, host integration, package distribution, or runtime behavior. Do not reconcile neighboring backlog identities.

## Plan
1. Select this exact bounded backlog item and commit the task-start pair.
2. Obtain configured-preset expert plan review.
3. Run the bounded-process watchdog, focused launcher watchdog, relevant launcher, and required repository checks.
4. Record the acceptance mapping, including the unrelated durable-record supervisor assertion as separate residual evidence.
5. Obtain configured-preset final expert review, write concise changelog evidence, remove only the exact backlog row, delete task artifacts, and create the completion commit.

## Progress
Selected after configured-preset review found the detached watchdog implementation already present in `core/adapters/process/bounded-process-supervisor.ts` and exercised by the launcher. The shared boundary owns detached process groups, wall-clock timers, SIGTERM/SIGKILL grace escalation, and result observation; the launcher records budget-stop evidence without gaining task or retry authority. No descendants are authorized.

The neighboring `dynamic-expert-validation-access`, `recovery-digest`, `incremental-log-observation`, `adaptive-session-budgeting`, and `standalone-package-worker-host` identities remain open and are not modified.

## Validation
Pending fresh watchdog validation. Required evidence includes `bun test core/adapters/process/bounded-process-supervisor.test.ts`, focused launcher watchdog tests covering detached budget stop, stop boundary/timing, late-success authority, and process-group disappearance, the relevant full launcher suite if practical, task/content/backlog/JSON/whitespace checks, and changed-file Git scope. The known `core/adapters/process/supervisor.test.ts:397` durable-record assertion must be run or explicitly recorded as separate residual evidence. Final review uses only configured `large` -> `@preset/abs-large`.

## Result
Pending.

## Blockers And Escalations
A failure in the bounded-process or launcher watchdog evidence blocks reconciliation. If the durable-record supervisor assertion reveals a shared process-boundary defect, stop and request a separately scoped core/adapters/process repair task; do not repair it here. If it remains isolated, record it as residual risk without claiming that suite passes.

## Recovery
Preserve this task record, `as-is.json`, and the selected backlog row until the evidence-gated completion patch is ready. Since this task is documentation-only, failed review requires restoring the selected row to `open` and retaining the task artifacts; no runtime rollback is needed.

## Next Action
Run fresh bounded-process and launcher watchdog validation, then reconcile the evidence and obtain final review.

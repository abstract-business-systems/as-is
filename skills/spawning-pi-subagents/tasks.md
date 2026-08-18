# Task

## Requirement
Implement `skills/spawning-pi-subagents:decouple-session-name-from-provider-session-id` against the completed option-1 observability contract. Keep task-derived session names as bounded correlation labels, local Pi session IDs as UUID-valid independent identities, provider request identity explicitly unavailable, and retries as separate authorized launches with fresh local and trace IDs. Do not add provider mapping, fork handling, automatic retry authority, session content handling, or task authority.

## Plan
1. Read the launcher record, selected backlog row, correlation contract, session naming/ID seams, and launcher tests.
2. Tighten launcher local-session observation to the contract's UUID boundary and add launch-scoped trace identity propagation without changing provider invocation semantics.
3. Add focused dry-run, detached, malformed/conflicting, no-session, and privacy regression coverage.
4. Validate the launcher and correlation seams, obtain final expert review, and complete the scoped handoff.

## Progress
Task-start pair created. The component review confirmed the launcher already creates distinct task labels and local session IDs, but session-header parsing is looser than the completed UUID contract and launch-scoped trace identity is not retained in the supervisor configuration.

## Validation
Pending.

## Result
Not yet available.

## Blockers And Escalations
None. Provider request identity remains unavailable by contract. No automatic retry or fork behavior is authorized.

## Recovery
If interrupted, preserve the task pair and any launcher changes. Do not infer retry authority from separate launches or process exit. Recover from the last committed checkpoint and keep unrelated session-directory changes untouched.

## Next Action
Implement the launcher-only correlation alignment and focused tests.

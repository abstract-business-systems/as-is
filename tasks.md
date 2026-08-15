# Task

## Requirement
Fix the three known unrelated launcher regression fixtures: align the repository thinking-level expectation with current `medium` declarations, correct the late-success budget fixture's shell newline construction so supervisor escalation is exercised, and make the caller-worktree ancestry fixture validate cherry-pick integration semantics. Do not change launcher production behavior, task authority, Pi version preflight, extension placement, or host integration.

## Plan
1. Select this bounded launcher-test maintenance task and commit the task-start pair.
2. Obtain configured-preset expert plan review.
3. Update only the three identified test fixtures.
4. Run each regression test individually, then the complete launcher suite and required repository checks.
5. Obtain configured-preset final expert review, record concise changelog evidence, remove the exact selected backlog row, delete task artifacts, and create the completion commit.

## Progress
Task-start selection is pending. The three failures are reproducible in the current launcher suite: the thinking test expects `high`/`max` while all current agent declarations are `medium`; the late-success fixture constructs its script with `.join("\\n")`, producing literal backslash-newline text instead of shell line breaks; and the ancestry fixture expects the original child SHA to remain an ancestor after cherry-pick, although cherry-pick creates a new commit.

No implementation edits have been made. No descendants are authorized.

## Validation
Pending implementation. Baseline individual observations: the thinking test fails on `agents/component-builder/agent.md` with expected `max` and received `medium`; the late-success test times out after 15 seconds; and the ancestry test fails its final ancestry assertion after cherry-pick. These are fixture failures, not production behavior observations.

## Result
Pending.

## Blockers And Escalations
None currently. The scope is limited to the launcher test file and its durable task/changelog records. No provider or external service is required.

## Recovery
Preserve `as-is.json`, `tasks.md`, and the selected backlog row until the completion patch is ready. If the budget fixture remains non-terminating after newline correction, inspect the process-group escalation evidence without weakening the supervisor. If the ancestry fixture still fails, record the observed Git graph and stop before changing production integration logic.

## Next Action
Mark the dedicated backlog item selected, commit the task-start pair, and obtain configured-preset expert plan review.

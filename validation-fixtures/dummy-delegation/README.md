# Dummy Delegation Fixture

This fixture is a harmless end-to-end rehearsal for the as-is delegation flow.
It must be run only after the root `tasks.md` authorizes the rehearsal.

## Acceptance

- One durable dummy component task is created before launch.
- Exactly one configured component-builder attempt is launched.
- No nested builder, worker, or expert launch is required.
- The attempt has bounded cost and wall-clock allocation.
- Any excess allocation request bubbles to the parent as a durable blocker or approval request.
- The child changes only this fixture and creates one scoped commit.
- The parent records the child SHA, consolidates related child commits when needed, integrates one scoped commit into the original branch, and records the resulting parent SHA.
- The parent verifies unrelated changes are preserved.
- The task record reaches a terminal state and the temporary worktree is removed or retained with a documented recovery reason.

This fixture must not contact external services or modify product components. A
stub Pi or equivalent deterministic worker is preferred for the first rehearsal;
a model-backed run is a separate approval.

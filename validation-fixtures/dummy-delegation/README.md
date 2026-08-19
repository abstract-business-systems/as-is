# Dummy Delegation Fixture

This fixture is a harmless end-to-end rehearsal for the as-is delegation flow.
It must be run only after the root `tasks.md` authorizes the rehearsal.

## Acceptance

- One durable dummy component task is created before launch.
- The deterministic efficacy rehearsal launches exactly two bounded component-builder attempts: one failed attempt followed by one fresh retry linked by bounded parent-job metadata.
- Deterministic validation remains provider-free; the separately gated live fixture exercises a three-level in-process delegation hierarchy and verifies its trace/session lineage.
- The attempt has bounded cost and wall-clock allocation.
- Any excess allocation request bubbles to the parent as a durable blocker or approval request.
- The child changes only this fixture and creates one scoped commit.
- The parent records the child SHA, consolidates related child commits when needed, integrates one scoped commit into the original branch, and records the resulting parent SHA.
- The parent verifies unrelated changes are preserved.
- The task record reaches a terminal state and the temporary worktree is removed or retained with a documented recovery reason.

Deterministic fixture tests must not contact external services or modify product components. The separately retained live smoke test is disabled by default, requires `AS_IS_LIVE_INTEGRATION=1` and an explicit `PI_BIN`, uses bounded temporary state and budgets, and must not treat a skip as pass evidence. A model-backed run remains a separate approval.

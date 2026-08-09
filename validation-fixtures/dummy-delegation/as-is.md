# Dummy Delegation Fixture

## Purpose
Provide a harmless, deterministic component for rehearsing as-is delegation,
budget bubbling, child commit handoff, parent integration, and cleanup.

## Design
The fixture contains only a task record, a test, and this durable context. It
must not contact providers or modify product components. Its task record uses a
small cost and wall-clock budget and its test uses a local stub.

## Boundaries
Changes are limited to this directory. The parent owns integration of any
scoped child commit into the repository branch.

## Constraints
One child attempt, no nested delegation, no external effects, and no broad
trace or privacy implementation.

## Links
- `tasks.md` — rehearsal task record.
- `dummy-delegation.test.ts` — deterministic launcher smoke test.
- `README.md` — acceptance and recovery expectations.

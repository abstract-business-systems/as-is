## Review conclusion

**No—not safe to proceed unchanged.** The overall decomposition is sensible, and the two implementation children can run concurrently, but three material issues must be resolved before writes or launches:

1. **The proposed child component directories do not contain the files they are supposed to own.**
2. **Existing ownership records conflict with the proposed parent ownership.**
3. **Budgets, recovery policy, and a few user-visible semantics are underspecified.**

## What is sound

- Whole-project setup in the current directory is appropriate; no local `AGENTS.md` or canonical `as-is.md` currently exists.
- Creating the canonical instruction, root record, `src/wordstats/as-is.md`, local configuration, and paired task records before launch follows the workflow.
- Two direct children with `maximum-depth: 1` and `maximum-children: 2` are appropriate.
- Concurrent execution is safe in principle because rarewords and topwords have disjoint helper-module paths and can avoid modifying the CLI, shared tests, or documentation.
- `--no-worktree` is acceptable only if the parent makes no shared-file changes while either child is active and generated artifacts are excluded from ownership claims.
- Parent integration after both children are terminal is the correct dependency order.

## Blocking issue: component/task boundary

The proposed children target:

- `src/wordstats/rarewords`
- `src/wordstats/topwords`

but the required implementation files are:

- `src/wordstats/rarewords.py`
- `src/wordstats/topwords.py`

Under the task protocol, a task targets a component directory, and that directory determines the task scope. A child rooted at `src/wordstats/rarewords` cannot safely claim ownership of its sibling file `src/wordstats/rarewords.py`.

This needs an explicit choice:

- **Preferred:** keep the required module paths and place the component records/task directories under a separate record area such as `records/components/rarewords` and `records/components/topwords`.
- **Alternative:** make each child directory contain its helper module, which would change the required module paths.

Do not silently select one, because this changes component identity and ownership.

## Ownership and records

The existing ownership map assigns:

- `src/wordstats/cli.py` to the core-utility owner.
- `docs/design-notes.md` to the project-docs owner.

The proposed parent task claims both areas. Before the parent edits them, the plan must either:

- explicitly establish that the parent is acting under those existing owners, or
- record a bounded ownership handoff/update before implementation.

The parent should also enumerate exact record artifacts:

- root `as-is.md`
- `src/wordstats/as-is.md`
- both child `as-is.md` records
- root `as-is.json` and `tasks.md`
- both child task JSON/narrative pairs
- `docs/design-notes.md`
- `records/ownership-map.md`, if ownership changes
- existing `CHANGELOG.md` rather than inventing a differently cased changelog
- focused tests and CLI integration changes

Architecture records must contain durable purpose/design/relationships only. Active status, budgets, validation, and recovery belong in task records.

## Semantics that must be fixed in the plan

The acceptance criteria should explicitly state:

- `--rare N` keeps words whose count is **less than or equal to** `N`.
- `--top N` selects the N highest-frequency words.
- Ties for `--top` use a deterministic rule, preferably alphabetical order consistent with the project’s deterministic output convention.
- Both helpers return new mappings and perform no I/O or CLI parsing.
- `0`, negative integers, and non-integer values are rejected for both options with a clear diagnostic and exit status 2.
- Behavior when both options are supplied is either explicitly defined and tested, or explicitly out of scope. The implementation must not invent an ordering silently.

Focused tests should cover the helper boundaries and CLI rejection paths. The parent can own the shared test files as proposed, provided the child acceptance scopes exclude them.

## Budget, concurrency, and recovery requirements

Before launch, each task pair needs:

- exact cost and wall-clock allocations;
- retained parent and child reserves;
- worker identities;
- `maximum-depth: 1` and `maximum-children: 2`;
- scheduler capacity for two concurrent tasks;
- dependency declarations showing no sibling dependency;
- protected write sets;
- an external-effects policy.

Child allocations must fit independently within the parent’s remaining allocation after parent spent cost/time and retained reserve. The parent must retain enough budget for integration, validation, and recovery.

The records should also state:

- both launches must overlap in liveness before concurrency is claimed;
- a failed child keeps the parent non-terminal;
- recovery reuses the existing child task/attempt or records an authorized replacement;
- recovery cannot create a third implementation child;
- the parent cannot complete until both children are terminal and their outcomes are explicitly accounted for.

## Required stop-for-direction

The user’s authorization is sufficient for the intended two-child decomposition, so no additional candidate-approval stop is needed. However, **a stop is required now** for:

1. resolving the component-directory/module-path mismatch;
2. confirming parent authority over the existing CLI and design-note owners; and
3. supplying or approving the budget/recovery values and the `--top` tie/combined-option semantics.

After those are recorded, the plan is safe to proceed with exactly two concurrent implementation children.
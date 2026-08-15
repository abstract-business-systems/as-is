# Task-Record Validator Reference

The task-control family owns the dependency-free Bun/TypeScript validator at
[`../../core/modules/task-control/task-record-validator.ts`](../../core/modules/task-control/task-record-validator.ts) for a version 2 JSON-companion task tree. `task_record_validator.py` remains non-runtime transition reference evidence and a compatibility check. It finds local `task` objects in `as-is.json` files, reads their configured front-matter-free task narratives, and uses directory placement to determine parentage. Durable `as-is.md` files provide component context but are not task metadata.

## Run

From this directory, validate a task tree with Bun:

```sh
bun ../../core/modules/task-control/task-record-validator.ts /path/to/component
```

The Python transition reference remains available:

```sh
python3 task_record_validator.py /path/to/component
```

It prints `VALID` and exits zero on success; otherwise it prints every detected
invariant violation and exits one. Run the focused Bun parity checks with:

```sh
bun test ../../core/modules/task-control/task-record-validator.test.ts
```

Run the Python reference checks with:

```sh
python3 -m unittest -v test_task_record_validator.py
```

## Enforced Version 2 Invariants

- strict local `as-is.json` `task` object fields, supported statuses, non-negative
  resource values, RFC 3339 UTC checkpoints, and required narrative sections;
- a safe root-configured task-narrative basename and a narrative beside every
  discovered task companion;
- authority inheritance: a child cannot relax its parent external-effect policy
  (`prohibited` is stricter than
  `require-current-turn-user-approval`) or delegation depth/child limits;
- immediate child count and aggregate cost/wall-clock allocations must fit the
  parent's allocation after its spent amount and reserve;
- a completed record has only terminal descendants. A failed or cancelled
  descendant must be explicitly named by its relative directory path in the
  completed ancestor's `## Result` section.

Legacy YAML-front-matter task records are unsupported and are not interpreted.

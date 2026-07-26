# Task-Record Validator

`task_record_validator.py` is a dependency-free, deterministic validator for a
version 2 `as-is.md` component tree. It reads the root record and every
descendant `as-is.md`; directory placement determines parentage.

## Run

From this directory, validate a task tree with:

```sh
python3 task_record_validator.py /path/to/component
```

It prints `VALID` and exits zero on success; otherwise it prints every detected
invariant violation and exits one. Run the focused automated checks with:

```sh
python3 -m unittest -v test_task_record_validator.py
```

## Enforced Version 2 Invariants

- strict core front matter, supported statuses, non-negative resource values,
  RFC 3339 UTC checkpoints, and required durable body sections;
- authority inheritance: a child cannot relax its parent external-effect policy
  (`prohibited` is stricter than
  `require-current-turn-user-approval`) or delegation depth/child limits;
- immediate child count and aggregate cost/wall-clock allocations must fit the
  parent's allocation after its spent amount and reserve;
- a completed record has only terminal descendants. A failed or cancelled
  descendant must be explicitly named by its relative directory path in the
  completed ancestor's `## Result` section.

The YAML reader intentionally supports only the protocol's mapping, scalar-list,
plain scalar, quoted-string, and space-indentation forms. Unsupported YAML
features fail rather than being interpreted ambiguously.

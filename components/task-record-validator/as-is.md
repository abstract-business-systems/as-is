
# Task-Record Validator - as-is

## Purpose

Make task-record invariants mechanically checkable without host-specific
runtime enforcement.


## Design

The component is organized around mechanical task-record invariant checks.


**Lineage**: [as-is](../../as-is.md#design) / [Components](../as-is.md#design) / **Task-Record Validator**

### Task-record invariant validation

```mermaid
flowchart TD
    A["Task record"] --> B["Invariant validator"]
    B --> C["Mechanical validation<br/>result"]
```

- Validate task-record invariants independently of host-specific runtime
  enforcement.
- Keep validation ownership here without becoming task authority or runtime
  enforcement.
- [`validator.ts`](validator.ts) provides the dependency-free Bun/TypeScript
  validator; it preserves the Python reference's configured narrative, schema,
  budget, delegation, policy, and descendant-closure checks without mutating
  records.
- [`validator.test.ts`](validator.test.ts) provides focused Bun parity coverage;
  [`task_record_validator.py`](task_record_validator.py) remains the reference
  implementation and compatibility check during the port.

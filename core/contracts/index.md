# Core Contracts

This is the entry point for the repository's normative contract documents. The index groups contracts by subject; each linked document remains authoritative for its own protocol, vocabulary, data boundary, or execution contract. These documents define host-neutral or cross-component expectations without becoming runtime implementations, task-transition authorities, or host adapters. Benchmark plans, generated runs, and dependencies are unrelated to this collection.

## Contracts

| Contract | Subject and authority |
| --- | --- |
| [component-task-record-protocol.md](component-task-record-protocol.md) | Task metadata, narrative, lifecycle, budgets, recovery, descendant closure, and completion cleanup. |
| [configuration.md](configuration.md) | Generic configuration-data resolution and the ownership boundary for consumer namespaces and semantics. |
| [execution-contract.md](execution-contract.md) | Host-neutral worker lifecycle, execution request/result concepts, and durable-versus-host observation boundaries. |
| [architecture-vocabulary.md](architecture-vocabulary.md) | Shared architecture terms, component boundaries, authority, evidence, and relationship labels. |

## Ownership Boundary

The contract documents define shared expectations and vocabulary. `core/modules/` owns host-neutral deterministic implementations, `core/adapters/` owns host or transport mappings, skills own reusable procedures, and roles retain selection, delegation, and completion authority. Moving a document into this collection does not create an executable contract API or transfer authority from an existing owner.

## Links

- [Core Contracts - as-is](as-is.md#design) — durable component context for this collection.
- [Core](../as-is.md#design) — parent core boundary.

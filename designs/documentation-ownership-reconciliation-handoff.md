# Documentation Ownership Reconciliation Handoff

## Purpose

This handoff records the bounded continuation point for reconciling durable documentation, task-record authority, configuration ownership, and possible contract grouping. It is planning and recovery context, not completion evidence or authorization for a broad migration.

## Current Decisions

- Do not move `docs/` wholesale under `core/`; retain cross-project documents where they remain the smallest coherent authoritative home.
- `core/contracts/component-task-record-protocol.md` owns task metadata, task narrative shape, lifecycle, budgets, recovery, descendant closure, and completion cleanup; it does not define `as-is.md` architecture-record structure.
- `skills/managing-as-is-document/SKILL.md` owns durable `as-is.md` purpose, design, relationships, diagrams, links, and record-specific meaning. The containing directory supplies the default component boundary; a separate `## Boundary` heading is not mandatory.
- `skills/structuring-content/SKILL.md` decides grouping, parent, authority, lifecycle, and entry point before artifact naming. A meaningful group defaults to `index.<host-required-extension>` unless a stronger host or repository convention applies; `as-is.md`, `AGENTS.md`, and `SKILL.md` remain explicit host-required exceptions.
- Naming follows structure. `designs/tracing.md` and `tracing-design.md` are both semantically valid when their placement and sibling vocabulary support them.
- Generic configuration resolution owns JSON parsing, bounded ancestor-to-target configuration cascade, provenance, diagnostics, and local task-data isolation. Each consumer owns its namespaces, defaults, validation, interpretation, and migration behavior.
- `core/contracts/` is the normative document collection for the task-record, configuration, and execution contracts; it is not an executable runtime API or a replacement for implementation owners.

## Reconciled Change Set

The documentation reconciliation and retained code-alignment slice are now represented together in the user-authorized atomic repository change. Focused tests cover the new ownership seams; the validation evidence below records the final pre-commit state.

| Area | Current change | Continuation concern |
| --- | --- | --- |
| `core/modules/task-control/task-record-policy.ts` | Extracts task-record filename defaults and safe-basename validation from generic context resolution. | Focused policy coverage now exercises defaults, compatibility names, and unsafe values. |
| `core/modules/task-control/control-plane.ts` and `task-record-validator.ts` | Consume task-control-owned filename policy. | Control-plane, validator, and direct policy tests cover configured names, compatibility discovery, and rejection. |
| `skills/managing-as-is-document/scripts/orient.ts` and launcher configuration code | Consume task-control filename policy rather than generic resolver task policy. | Direct task-control consumption is retained; focused configured-name and unsafe-name coverage passes. |
| `core/modules/observability/tracer.ts` | Reads effective configuration through the generic resolver and interprets its own tracing namespace/defaults. | Nested component inheritance and local-directory behavior are covered; host environment controls remain a separate documented precedence surface. |
| `skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts` | Stops interpreting or forwarding observability configuration and retains launcher-owned model/provider/thinking configuration. | A focused dry-run test proves tracing values are absent while launcher-owned model/provider values remain. |
| Documentation and records | Reconciles protocol, configuration, `as-is` boundary, naming/structuring guidance, architecture references, and ownership records. | Keep these changes separable from any later runtime ownership migration. |

Test sources now cover the task-record policy seam, configured-name consumers, generic configuration cascade/provenance, nested tracer configuration, launcher consumer separation, orientation, and reconciliation-document phrases. Existing broader suites still provide regression coverage.

## `core/contracts/` Assessment

The `core/contracts/` directory is now the normative home for the moved task, configuration, execution, and architecture-vocabulary contract documents. It is a document collection, not an executable runtime API or a replacement for the existing implementation owners.

The moved execution contract remains normative at `core/contracts/execution-contract.md`; no executable `core/contracts` runtime seam is implied. Any future executable extraction still requires a concrete consumer need, request/result compatibility evidence, and preservation of task-control, process, Pi, and observability ownership.

The group uses `core/contracts/index.md` as its entry point and retains subject-named contract documents beside it. Implementation remains in `core/modules/`, host mappings remain in `core/adapters/`, and the collection does not create a second task, configuration, or authority surface.

## Test Follow-Up Completed

1. `core/modules/task-control/task-record-policy.test.ts` covers default naming, configured safe basenames, compatibility names, rejected traversal/absolute/separator names, reserved `as-is.md`, and malformed values.
2. Task-control, validator, launcher, and orientation tests exercise configured task names through the task-control policy seam.
3. Context-resolution and observability tests cover repository-to-component configuration cascade, provenance, local task isolation, and nested tracer output.
4. The launcher dry-run test proves tracing values are not parsed or forwarded while launcher-owned model/provider configuration remains effective.
5. `skills/managing-as-is-document/content-test.ts` now asserts the task-protocol authority boundary, structure-before-naming rule, grouped `index.<extension>` default, consumer-owned configuration, normative `core/contracts` placement, and historical record status.
6. Focused validation has passed for the changed test groups. The repository orientation snapshot remains opt-in because preserved task-like files under `temp/benchmarking` are not JSON-backed task records; the focused configured-name orientation test passes.

## Validation Evidence

- `bun test --timeout 30000 core/modules/task-control/*.test.ts` — 35 tests, 127 expectations passed.
- `bun test --timeout 30000 core/modules/context-resolution/*.test.ts core/modules/observability/*.test.ts` — 41 tests, 199 expectations passed.
- `bun test --timeout 30000 core/adapters/process/bounded-process-supervisor.test.ts skills/spawning-pi-subagents/scripts/pi-usage-accounting.test.ts` — 9 tests, 53 expectations passed.
- `bun test --timeout 30000 skills/spawning-pi-subagents/scripts/spawn-pi-subagent.test.ts` — 53 tests, 331 expectations passed.
- `bun test --timeout 30000 skills/managing-backlog/query.test.ts` — 15 tests, 53 expectations passed.
- `bun skills/managing-as-is-document/content-test.ts` — 48 records and 46 diagrams passed after establishing `core/contracts` and disbanding the former `docs` and `host-integration` components.
- `bun core/modules/task-control/task-record-validator.ts .` — `VALID`.
- Tracked JSON parsing passed for 13 files; no-bundle builds passed for task-record policy, tracer, and launcher; `git diff --check` passed.
- VS Code diagnostics for changed focused test/content files are empty. Workspace diagnostics still report the repository's pre-existing missing Bun/Node type-library configuration and unrelated legacy diagnostics in broader runtime files; Bun tests and no-bundle builds are the authoritative runtime checks used here.

## Recovery And Next Action

The code changes are retained as implementation work rather than represented as document-only work. The contract collection, root principles, draft OpenCode readiness document, and planning-only host-integration consolidation are included in the atomic user-authorized change. Any future executable contract or OpenCode adapter requires a separate bounded task with consumer and compatibility evidence. The known orientation residual remains the preserved task-like files under `temp/benchmarking`; repository-wide orientation is opt-in until those artifacts receive an explicitly authorized compatibility treatment. They are outside this bounded change and must not be silently removed. No branch, remote, or external effect beyond the requested local commit is authorized by this handoff.

## Authoritative Context

- [`core/contracts/component-task-record-protocol.md`](../core/contracts/component-task-record-protocol.md) — task metadata and lifecycle authority.
- [`core/contracts/configuration.md`](../core/contracts/configuration.md) — generic configuration-data boundary and consumer ownership.
- [`../skills/managing-as-is-document/SKILL.md`](../skills/managing-as-is-document/SKILL.md) — durable `as-is.md` record authority.
- [`../skills/structuring-content/SKILL.md`](../skills/structuring-content/SKILL.md) — grouping and entry-point decisions.
- [`../skills/naming-software-concepts/SKILL.md`](../skills/naming-software-concepts/SKILL.md) — names chosen after structure.
- [`core/contracts/execution-contract.md`](../core/contracts/execution-contract.md) — current normative execution-contract document.
- [`aspirational-architecture-handoff.md`](aspirational-architecture-handoff.md) — future-boundary and non-authorization context.

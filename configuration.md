# Superseded Bundle Configuration And State Contract

> This document records the earlier JSON-manifest design. `as-is.md` is now the
> authoritative project-facing configuration and durable task-context artifact.
> The superseded manifest and schema were removed; Git history preserves them
> as migration reference if needed. The XDG state layout below is retained as a
> conceptual or future runtime-metadata boundary, not as a second authoritative
> task tree. See `orchestration-design.md` for the active design direction.

## Boundaries

as-is has three separate boundaries:

| Boundary | Location | Ownership | Contents |
| --- | --- | --- | --- |
| Bundle | Machine or user installation directory | as-is distribution | Agents, skills, references, examples, schemas, extensions, and runtime adapters. |
| Project | Target repository root | Project | One optional `as-is.config.json` manifest. |
| Runtime metadata | User-level state directory | as-is runtime | Resolved configuration, run/session metadata, leases, logs, indexes, and transient artifacts; never the authoritative task state. |

The bundle is self-contained and selected by the installed `as-is` CLI or a
chat slash-command adapter. It is not copied into each project. By default,
as-is discovers the active machine/user-installed bundle; a project manifest can
pin a different bundle directory, including a version vendored by that project.

In the superseded manifest model, the only normal project incision was
`as-is.config.json`; that historical rule does not relocate current task
authority. In the active repository-backed model, the authored root and
component `as-is.md` records are durable project context, while runtime
metadata remains outside the repository unless a bounded task deliberately
creates a project artifact.

## Project Manifest

`as-is.config.json` is the one public project configuration and extension entry
point. It has a versioned, locally resolved schema:

```json
{
  "$schema": "as-is://schemas/config/v1",
  "apiVersion": "as-is.dev/v1",
  "bundle": {},
  "project": {},
  "core": {},
  "extensions": [],
  "overrides": []
}
```

`as-is://` is resolved by the invoked local bundle, not fetched over the
network. An editor integration may resolve it to the matching schema in that
bundle.

- `bundle.directory` optionally selects a bundle-relative or absolute directory
  to use instead of the active installed bundle. It is resolved from the project
  root and is intentionally a project-versioning mechanism, not an extension
  search path.
- `project.id` optionally supplies a stable project identifier. It is useful for
  a non-Git project that moves between directories or for an intentional shared
  state identity.
- `core` overrides core policy defaults.
- `extensions` enables and configures extension capabilities supplied by the
  selected bundle.
- `overrides` applies a limited policy patch to a component subtree.

The core supplies defaults for all supported settings. Unknown top-level and
core fields are errors. Extension `config` fields are validated by the declared
extension. This fail-closed behavior prevents a misspelled setting from silently
altering automation behavior.

## Defaults And Overrides

The runtime calculates effective policy in this order:

1. Versioned defaults from the selected bundle.
2. Defaults from enabled bundle extensions, in manifest order.
3. Root `core` and extension configuration in the project manifest.
4. Matching `overrides`, from least-specific to most-specific component path.

An override applies to the repository-relative directory in `path` and its
descendants. Components never discover another configuration file. An override
can patch core policy and configuration for an extension already enabled at the
root. It cannot select a bundle, enable, disable, reorder, or replace an
extension.

Objects merge recursively. Scalars replace defaults. Arrays replace defaults;
`extensions` is the exception because it is an ordered, unique-ID declaration.
`null` is not a deletion mechanism. Settings with an unconfigured state use an
explicit value such as `"disabled"`.

Example:

```json
{
  "bundle": { "directory": "tools/as-is" },
  "core": {
    "tasks": { "unitBudget": { "wallClockSeconds": 600 } }
  },
  "extensions": [
    {
      "id": "example.review-gate",
      "config": { "requiredChecks": ["diff", "tests"] }
    }
  ],
  "overrides": [
    {
      "path": "components/search",
      "extensions": {
        "example.review-gate": {
          "requiredChecks": ["diff", "tests", "integration"]
        }
      }
    }
  ]
}
```

## Core Policy

The v1 core exposes these policy areas. Each has a bundle default and is
overridable unless marked fixed below.

| Area | Default | Purpose |
| --- | --- | --- |
| `tasks.unitBudget` | `{"wallClockSeconds": 300, "costUsd": 0.20}` | Bound for one progress unit. |
| `scheduling` | `{"wakeSeconds": 60, "maxConcurrentTasks": 1, "retryBackoffSeconds": 300}` | Orchestrator wake, concurrency, and retry policy. |
| `agents.defaultRole` | `"implementer"` | Role used when a task does not name one. |
| `agents.roles` | `{}` | Role-specific model, skill, tool, and permission settings. |
| `hitl` | `{"onBlocked": true, "onBudgetExceeded": true, "onExternalEffect": true}` | Events requiring human direction or approval. |
| `logging` | `{"level": "info", "retainDays": 30}` | Operational record detail and retention. |

The following are fixed invariants:

- A project has one authored root `as-is.md` configuration entry point.
  Component `as-is.md` task records may carry resolved policy and permitted
  scoped narrowing, but do not introduce additional configuration entry points.
- Runtime-owned state is never treated as project policy.
- The active configuration validates against its declared `apiVersion`.
- Extensions cannot relax approval requirements for irreversible external
  effects.
- An extension cannot write outside its durable-state area or the target project
  through the ordinary project-editing tools granted to its task.

Changing an invariant requires a new configuration API version, not an override.

## Durable State

The repository-backed root and component `as-is.md` records are the sole
authoritative task state. They contain the durable task status, progress,
decisions, approvals, results, validation, blockers, and next actions used for
recovery and completion. The runtime must not introduce a second authoritative
backlog or task tree.

The initial XDG layout in this section is conceptual/future or auxiliary runtime
metadata only. In particular, its `tasks/` directory must not be treated as a
mirrored source of task status, history, approval state, or completion evidence.
Any runtime index, lease, or reference must remain subordinate to the
repository-backed component records and be safe to discard or rebuild.

The default state root follows the operating system's user-state convention:

```text
${XDG_STATE_HOME:-~/.local/state}/as-is/projects/<project-key>/
```

The runtime derives `<project-key>` from the Git repository identity when
available, using the canonical root and configured remote identity. For a
non-Git project it uses the canonical root path. `project.id` replaces that
derived key when a stable, intentional identity is required. The exact hashing
and migration rules remain an implementation detail, but unrelated projects
must never share a state directory accidentally.

Each state directory has this conceptual layout:

```text
projects/<project-key>/
  identity.json                  # project root, derived identity inputs, bundle identity
  configuration/
    effective.json               # immutable policy snapshot for each run
  tasks/
    <repository-relative-path>/  # optional future runtime index/reference only
  runs/<run-id>/                 # run/session identity, lease, and execution record
  approvals/                     # auxiliary references; the task record is authoritative
  artifacts/                     # bounded work products not intended for the repository
  logs/                          # operational event records, subject to retention
```

The conceptual `tasks/` tree is not a second checkout and is not a second
authoritative task tree. A future runtime may index a repository component under
its relative path, but the task for `src/search` remains the repository-backed
`src/search/as-is.md`, and a child task for `src/search/parser` remains
`src/search/parser/as-is.md`. This preserves the directory-based component and
vertical-delegation model without relocating task authority.

State is divided by authority and retention:

| Class | Examples | Authority | Retention |
| --- | --- | --- | --- |
| Repository task control state | Root or component `as-is.md` task record, progress, responsible worker, decisions, result, and next action | Sole task authority; changed only through the task protocol | Retained as project history until explicit archival policy. |
| Immutable run input | Effective configuration, bundle identity, prompt/template revision | Explains what a run was authorized to do | Retained with its run. |
| Runtime coordination metadata | Leases, run/session identity, logs, indexes, caches, and temporary tool output | Never task, approval, history, or completion authority by itself | Expirable and regenerable. |
| HITL state | Question, approval, rejection, or direction recorded in the affected task record | Authoritative only after the durable record transition | Retained with the affected task. |
| Project artifacts | Source, documentation, tests, user-requested output | Owned by the target repository | Created only by an explicit task action. |

A fresh orchestrator can recover a task from its repository-backed task record
plus immutable run input when available. It must not require a chat transcript,
a cache, a runtime index, or a still-live process. A lease is liveness evidence,
not proof of completion: once it expires, the orchestrator inspects the task
record and routes recovery to the responsible role.

State is private to the local user by default. Project-level collaboration and
state synchronization are intentionally deferred; they require explicit sharing,
locking, access control, and secret-redaction semantics.

## Extensions

Extensions add capabilities without forking the core. They are supplied by the
selected bundle and enabled by project configuration:

```json
{
  "id": "example.review-gate",
  "enabled": true,
  "config": {
    "requiredChecks": ["diff", "tests"]
  }
}
```

An extension package declares its supported configuration API versions, typed
configuration schema, contributed agents or skills, and runtime entry point.
The core validates that declaration before starting it. Project configuration
may enable or configure an extension; it does not point to arbitrary extension
source directories. Selecting another bundle is the controlled way to change
the extension set for a project.

## Secrets And Self-Building

Secrets never appear in the manifest, durable task records, logs, generated
state, or extension manifests. Configuration can name a reference such as
`"env:OPENROUTER_API_KEY"`; the runtime resolves it only at execution time.
Environment variables provide secrets and process facts, not policy overrides.

The bundle can use its own agents, skills, examples, and task system to improve
itself. A task may propose changes to the bundle or a project's manifest, but
an active run continues with its immutable effective-configuration snapshot.
Changes to bundle selection, extension enablement, fixed invariants, or
external-effect policy require explicit human approval.

## Deferred Implementation Details

The task/progress-record schema, state-file encoding, state locking, project-key
hashing, retention implementation, extension manifest filename, and the
OpenCode adapter remain to be designed within this boundary.

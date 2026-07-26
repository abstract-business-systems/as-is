# Superseded Bundle Configuration And State Contract

> This document records the earlier JSON-manifest design. `as-is.md` is now the
> authoritative project-facing configuration and durable task-context artifact.
> The superseded manifest and schema were removed; Git history preserves them
> as migration reference if needed. The historical location, ownership, and
> policy rules below are not part of the current architecture; see
> `orchestration-handoff.md` for the active design direction.

## Boundaries

as-is has three separate boundaries:

| Boundary | Location | Ownership | Contents |
| --- | --- | --- | --- |
| Bundle | Machine or user installation directory | as-is distribution | Agents, skills, references, examples, schemas, extensions, and runtime adapters. |
| Project | Target repository root | Project | One optional `as-is.config.json` manifest. |
| Durable state | User-level state directory | as-is runtime | Task records, progress, leases, resolved configuration, logs, and transient artifacts. |

The bundle is self-contained and selected by the installed `as-is` CLI or a
chat slash-command adapter. It is not copied into each project. By default,
as-is discovers the active machine/user-installed bundle; a project manifest can
pin a different bundle directory, including a version vendored by that project.

The only normal project incision is `as-is.config.json`. Running as-is does not
create `.as-is/`, agent files, task records, caches, or generated configuration
inside the target repository unless a task deliberately creates a project
artifact as part of its requested work.

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
    <repository-relative-path>/  # mirrors the project component hierarchy
      active.*                   # at most one active task for that component
      history/                   # completed, superseded, and failed task records
  runs/<run-id>/                 # run/session identity, lease, and execution record
  approvals/                     # durable HITL questions and decisions
  artifacts/                     # bounded work products not intended for the repository
  logs/                          # operational event records, subject to retention
```

The `tasks/` tree mirrors paths in the project but is not a second checkout. A
task for `src/search` has state beneath `tasks/src/search/`; a child task for
`src/search/parser` appears beneath it. This preserves the directory-based
component and vertical-delegation model without writing task files into source
directories.

State is divided by authority and retention:

| Class | Examples | Authority | Retention |
| --- | --- | --- | --- |
| Durable control state | Task record, progress, responsible agent, lease, next action | Required for recovery; append or replace only through the task protocol | Retained until explicit archival policy. |
| Immutable run input | Effective configuration, bundle identity, prompt/template revision | Explains what a run was authorized to do | Retained with its run. |
| HITL state | Question, approval, rejection, direction | Authoritative human control record | Retained with the affected task. |
| Derived operational state | Logs, indexes, caches, temporary tool output | Never policy or recovery authority by itself | Expirable and regenerable. |
| Project artifacts | Source, documentation, tests, user-requested output | Owned by the target repository | Created only by an explicit task action. |

A fresh orchestrator can recover a task from durable control state plus its
immutable run input. It must not require a chat transcript, a cache, or a
still-live process. A lease is liveness evidence, not proof of completion: once
it expires, the orchestrator inspects the task record and routes recovery to the
responsible role.

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

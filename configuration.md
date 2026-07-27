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
| Runtime metadata | User-level state directory | as-is runtime | Resolved configuration, run/session metadata, leases, logs, the restart-reconcilable JobId map, and transient artifacts; never the authoritative task state. |

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

## Execution Resolution Boundary

Execution configuration is resolved in layers rather than copied into every
worker command:

1. The component and parent `as-is.md` records provide the delegate protocol:
   component path and scope, configured role, requirement, effective
   task-specific constraints, acceptance conditions, budget, durable handoff,
   and ancestor integration authority.
2. The effective bundle/project configuration and host capability facts select
   an adapter and normalize an adapter/job specification. The specification
   includes the selected backend and proactive permission/capability profile,
   excludes secrets, and is stable for the attempt.
3. The supervisor receives that normalized specification plus generated
   host-neutral job, attempt, and parent-job identifiers. It owns generic job
   lifecycle, detached execution, runtime state, logs/events, polling/watch,
   cancellation, stale detection, cleanup, and source-labelled accounting. It
   does not interpret OpenCode sessions or commands. The generated JobId is a
   runtime correlation handle, not the component task identity.

The durable launch envelope is therefore the component path, durable task
revision and attempt, the record revision needed for freshness, and the
resolved adapter/job specification. Generated JobId and parent-job identifiers
may be carried as private runtime correlation data. The requirement, worker
role, acceptance, common
repository context, and integration authority are derived from `as-is.md` and
centrally supplied read-only context instead of being duplicated in command
arguments. Private session handles, event cursors, logs, and backend metadata
may support observation but never become a second task authority.

Permission profiles are proactive inputs to both the supervisor and selected
adapter. The supervisor validates generic capability classes, approved
workspace/process controls, input policy, event persistence, and deadlines.
The adapter translates those classes to its host-specific permission and event
surfaces. In particular, OpenCode permission settings, approval-event limits,
and session behavior belong only to `opencode-adapter.md`; they are not core
configuration assumptions. Shell, CI, remote, and other adapters may resolve
different backend specifications without changing the delegate protocol.

This boundary does not introduce a new public manifest field by implication.
The selected bundle/host integration and current records resolve the effective
adapter/job specification until a separately authorized configuration task
defines and validates a public key. A foreground command is not an asynchronous
adapter merely because it is placed behind a subprocess API. The retired
systemd flow is not an active configuration option or recovery path.

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
authoritative current task state. They contain the durable status, progress,
decisions, approvals, results, validation, blockers, recovery, and next actions
used for delegation and completion. No runtime directory may become a second
backlog, task tree, history, approval store, or completion authority.

An optional future or private runtime may use the user-level XDG state root
`${XDG_STATE_HOME:-~/.local/state}/as-is/projects/<project-key>/` for resolved
configuration, run metadata, leases, logs, indexes, or disposable artifacts.
Its `tasks/` area, if present, is only a discardable index or reference to the
repository records; it is not an active task backlog and must never mirror,
supersede, or relocate authority. Runtime metadata must remain subordinate to
the repository records and safe to rebuild.

While an attempt is active, a supervisor must persist its private runtime map at
`${XDG_STATE_HOME:-~/.local/state}/as-is/projects/<project-key>/runtime/job-map.json`.
Each generated JobId maps to component path, task revision, attempt, adapter,
private process/session handles, runtime state, and reconciliation timestamps.
The map is atomically updated for restart diagnostics and expires only after a
terminal record, confirmed cleanup, and the configured retention boundary. A
restart reconciles live handles against the durable path/revision/attempt and
marks missing observations unknown or unavailable; it never infers task
completion from a missing map entry. If the map cannot be persisted, stable
component-path status remains available while runtime fields are unavailable.

Private per-run host state may instead use
`${TMPDIR:-/tmp}/as-is/<project-key>/<run-id>/<component-key>/`, or an equivalent
secure temporary root. This path is disposable runtime guidance only: it is
private, collision-resistant, cleaned after durable evidence, and never task
authority or recovery evidence. A fresh orchestrator recovers from the
repository record and immutable run input when available, not from a cache,
index, chat transcript, or live process.

State is divided by authority and retention:

| Class | Examples | Authority | Retention |
| --- | --- | --- | --- |
| Repository task control state | Root or component `as-is.md` records, progress, decisions, results, and next actions | Sole current-task authority; changed through the task protocol | Current records remain in place; historical committed state is recovered from Git and concise `change-log.md` entries, not archive folders. |
| Immutable run input | Effective configuration and bundle identity | Explains what a run was authorized to do | Retained with its run when available. |
| Runtime coordination metadata | Leases, run identity, logs, the private JobId map, indexes, caches, and temporary tool output | Never task, approval, history, accounting, or completion authority | Private, expirable, and regenerable; active map entries support restart reconciliation. |
| HITL state | Questions, approvals, rejection, or direction recorded in the affected task record | Authoritative only after the durable record transition | Retained with the affected task. |
| Project artifacts | Source, documentation, tests, and requested output | Owned by the target repository | Created only by an explicit task action. |

Project-level collaboration and state synchronization remain deferred; they
require explicit sharing, locking, access control, and secret-redaction rules.

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
hashing, retention implementation, extension manifest filename, the concrete
adapter/job-spec serialization, and public status/watch integration remain to
be designed or validated within this boundary. The OpenCode adapter document
records its current limitations; it is not a completion claim.

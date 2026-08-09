# Root `as-is.json` Configuration

The root `as-is.json` companion is the project machine-configuration entry
point. This document explains its structure and semantics; it does not hold a
second copy of project configuration values. The active values belong in the
root `as-is.json`. `as-is.md` remains the human-facing durable component map.

## Boundaries

| Boundary | Location | Contents |
| --- | --- | --- |
| Bundle | Installed as-is distribution | Agents, skills, references, schemas, extensions, and host adapters. |
| Project configuration | Repository root `as-is.json` | Project machine configuration under `configuration`. |
| Component context | Component `as-is.md` | Durable human purpose, design, boundaries, and links. |
| Task metadata | Component `as-is.json` | Local transient task metadata under `task`; never cascades. |
| Task narrative | Component configured task-record filename (default `tasks.md`) | Human-readable transient task context. |
| Runtime | Private user or temporary state | Resolved runtime metadata, handles, logs, and disposable artifacts. |

Runtime metadata is subordinate to repository records. It must not become a
second configuration source, backlog, task tree, history, approval store, or
completion authority.

## JSON Structure

The root companion contains repository configuration under `configuration`:

```json
{
  "configuration": {
    "records": { "filenames": { "backlog": "backlog.md", "changelog": "changelog.md", "task": "tasks.md" } },
    "tasks": {},
    "scheduling": {},
    "notifications": {},
    "agents": {},
    "technology-preferences": {},
    "hitl": {},
    "logging": {},
    "observability": {}
  },
  "task": {}
}
```

`configuration` holds effective project settings. `task`, when present, is
local transient metadata and is never inherited by descendants. The root
companion is authoritative for machine-readable values; this document describes
their meaning only.

## Configuration Areas

- `configuration.records.filenames` — configurable component record filenames; defaults are `backlog.md`, `changelog.md`, and `tasks.md`.
- `configuration.tasks` — default task-unit budgets and task execution limits.
- `configuration.scheduling` — wake, check-in, concurrency, retry, and recovery policy.
- `configuration.notifications` — material event notification behavior.
- `configuration.agents` — default role, model presets, provider, and agent selection.
- `configuration.technology-preferences` — preferred runtime and package manager.
- `configuration.hitl` — conditions requiring human direction or approval.
- `configuration.logging` — concise history verbosity and retention policy.
- `configuration.observability` — tracing backend, enablement, and local fallback.

Task records may carry task-specific constraints and permitted scoped narrowing,
but they do not introduce another project configuration entry point. Component
`as-is.md` files describe components and do not duplicate root configuration.

## Authority And Validation

Configuration authority follows the repository's design-principle hierarchy:
fixed safety invariants and repository constraints take precedence over project
configuration, and project configuration takes precedence over installed-bundle
defaults where the schema permits an override. A lower-authority setting cannot
weaken a higher-authority constraint.

Unknown or malformed core configuration fields must fail validation rather than
silently changing behavior. Configuration changes must preserve the declared JSON shape, remain in the
root `as-is.json`, and be validated before an attempt uses them.

## Runtime Resolution

A host may derive an immutable resolved configuration for one bounded attempt and
pass it to a detached worker. That copy is execution input, not policy authority.
Environment variables may provide secrets or process facts, but do not override
project policy. Secrets must not appear in JSON companion data, task narratives, logs, or
other tracked artifacts.

### Global test and host environment variables

These variables are process or host controls, not project configuration. They
may be set in a user's global shell/profile or CI environment when appropriate;
they should not be added to `as-is.json`, `as-is.md`, or task records:

| Variable | Effect | Default |
| --- | --- | --- |
| `AS_IS_LIVE_INTEGRATION` | When set to `1`, enables the opt-in live provider test in `agents/as-is/process-boundary-routing.test.ts`. The test launches a real Pi process and may consume provider quota or cost money. | Unset; the live test is skipped. |
| `PI_BIN` | Selects an explicitly approved local Pi executable for the spawning launcher and live test. | The launcher's local Pi/package resolution; the live test also falls back to `pi` on `PATH` and then the repository host's pinned local path. |

For example, a global or CI test profile may use:

```bash
export AS_IS_LIVE_INTEGRATION=1
bun test --timeout 120000 agents/as-is/process-boundary-routing.test.ts
```

Keep `AS_IS_LIVE_INTEGRATION` unset for ordinary test runs. It is deliberately
an opt-in execution control rather than a tracked project setting.

The root configuration can enable or shape reusable skills and agent bundles.
Changing a skill can therefore change system functionality, subject to the
higher-authority constraints and validation gates.

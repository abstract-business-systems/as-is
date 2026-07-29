---
name: as-is
description: Starts the repository root as-is agent in a separate Pi process through spawning-pi-subagents. Use when beginning a new as-is turn from the current root task record.
compatibility: Requires the repository-local spawning-pi-subagents skill, Bun, and a local Pi package or binary.
---

# as-is

## Naming Exception

This skill intentionally uses the role name `as-is` instead of the repository's
usual capability-phrase naming pattern. It is the user-facing entrypoint and
must be easy to identify beside the `.agents/agents/as-is/agent.md` role and the
`as-is` project records. This is an exceptional convenience alias for this
single entrypoint, not a precedent for naming other skills after agent roles.

Use this skill as the Pi host entrypoint for a new user request. It starts the
repository's `.agents/agents/as-is/agent.md` contract through the generic
`spawning-pi-subagents` launcher rather than invoking OpenCode task routing.

## Start

Launch the root agent with the user request as the task text:

```bash
bun skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts \
  --agent .agents/agents/as-is/agent.md \
  --task "<the user's request and concise bounded direction>" \
  --cwd "$PWD" \
  --skill skills/as-is \
  --tools read,grep,find,ls,bash \
  --approve
```

Use `--approve` only when the user has authorized this project-local run. The
generic launcher prefers a local `node_modules/.bin/pi` and otherwise uses the
pinned Pi package through Bun; it does not use an arbitrary shared `pi` from
`PATH`. Set `PI_BIN` or `PI_PACKAGE` when an explicitly approved local source is
required. Run the generic launcher with `--dry-run` before a new host setup or
model call.

Pass the user's request and any concise direction needed for this turn as the
task text. Do not place credentials, tokens, private session data, or an
unbounded copy of unrelated repository history in the argument.

## Root-Agent Contract

The started process must:

- read the current root `as-is.md` and recover historical facts from Git and
  concise `change-log.md` entries;
- treat the root record as current task authority and preserve higher-authority
  repository instructions and design principles;
- route substantive bounded work to `.agents/agents/component-builder/agent.md` using
  the `spawning-pi-subagents` launcher as another separate Pi process;
- pass the component-builder the bounded requirement, relevant component record,
  and named dependencies;
- reread durable records after the component-builder process exits and report
  completion, blockers, validation, and next action from those records.

To start the component-builder from the as-is process, use the previous skill
with task text that identifies the requested component and its current record:

```bash
bun skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts \
  --agent .agents/agents/component-builder/agent.md \
  --task "Build <component> using its current as-is.md and named dependencies." \
  --cwd "$PWD" \
  --tools read,grep,find,ls,bash,edit,write \
  --approve
```

The component-builder must select the configured worker named by each child
record. It must not substitute `general` or `explore`, invoke a worker directly
as a top-level role, or treat Pi process exit as task completion.

## Boundary

This entrypoint establishes separate Pi processes and agent-file loading.
Non-blocking launch and a detached wall-clock supervisor are available via the
launcher's `--detach` mode; the parent receives a handle and may observe the
child by polling its record and log. It does not yet establish a durable JobId
map or handle registry, restart reconciliation, watchdog enforcement beyond the
wall-clock budget, or hard cost-budget enforcement at the launcher. Report those
remaining host capabilities as unavailable rather than inferring them.

The root and component `as-is.md` files remain the authority. Private Pi
sessions, prompt files, process handles, and output streams are supplementary
host state and must not become a second task tree or completion source.

## Checks

Before starting a real root process:

```bash
bun build --no-bundle --target bun \
  --outfile /tmp/as-is-spawn-pi-subagent.js \
  skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts
bun skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts \
  --agent .agents/agents/as-is/agent.md \
  --task "Inspect the current root task record without changing files." \
  --cwd "$PWD" \
  --skill skills/as-is \
  --tools read,grep,find,ls,bash \
  --dry-run
```

Confirm the resolved agent is `.agents/agents/as-is/agent.md`, the child working
directory is the repository root, the two repository skills are loaded, and no
provider was contacted by the dry-run.

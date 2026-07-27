---
name: spawning-pi-subagents
description: Starts an isolated Pi child process from a repository agent Markdown file and returns its process output. Use when delegating a bounded task to as-is, orchestrator, implementer, or another named agent.
compatibility: Requires Bun and a local Pi package or binary. The child process must run in the target repository and receive an explicit agent file and task.
---

# Spawning Pi Subagents

Use this skill when a role must run in a separate Pi process with an isolated
context window. The process boundary is real, but this skill is not yet a
detached supervisor: the caller waits for the child process to exit.

## Contract

The launcher accepts:

- an agent Markdown file, such as `.agents/agents/as-is.md`,
  `.agents/agents/orchestrator.md`, or `.agents/agents/implementer.md`;
- one task string;
- the repository working directory;
- optional Pi model, tool, approval, and additional skill settings.

The launcher extracts the agent file body and passes it to Pi as an appended
system prompt. It reads simple `model:` and `tools:` front-matter values when
present. OpenCode-specific front matter such as `permission:` is not a Pi
permission mechanism; the explicit Pi tool and approval options are the host
controls.

## Invocation

```bash
bun skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts \
  --agent .agents/agents/orchestrator.md \
  --task "Delegate the bounded component task recorded in the named component as-is.md." \
  --cwd "$PWD" \
  --tools read,grep,find,ls,bash,edit,write \
  --approve
```

For a short task:

```bash
bun skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts \
  --agent .agents/agents/implementer.md \
  --task "Implement the bounded task recorded in the assigned component." \
  --cwd "$PWD"
```

The launcher does not use an arbitrary `pi` found on `PATH`. It resolves Pi in
this order:

1. `--pi <path>`;
2. `PI_BIN`;
3. the nearest repository `node_modules/.bin/pi`;
4. Bun's package runner for
   `@earendil-works/pi-coding-agent@0.82.0`.

The Bun package runner may install the pinned package into Bun's local cache on
first use, so treat the first real launch as an external setup effect. Set
`PI_PACKAGE` to an explicitly approved package/version or `PI_BIN` to a local
binary when needed. Use `--dry-run` to inspect the resolved command without
starting a model process.

## Process Rules

- Invoke one configured role at a time unless the parent task explicitly
  authorizes independent siblings.
- Resolve the agent file and component record before launch; do not substitute
  `general`, `explore`, or a direct worker when the configured role is missing.
- Pass the child only its role contract, task-specific direction, named
  dependencies, and centrally supplied repository context. Do not copy an
  unrelated root record or private runtime state into the prompt.
- Use `--approve` only when project-local files are explicitly trusted for that
  attempt. Do not place credentials or tokens in task arguments, task files, or
  output.
- The launcher uses `--mode json`, `--print`, `--no-session`, a shell-free child
  process, and a private temporary system-prompt file. It forwards child output
  and removes the temporary prompt after exit.
- A zero Pi exit code is only a host observation. Reread the durable component
  record and validate its status, handoff, acceptance evidence, and cleanup
  before treating the task as complete.
- This skill does not provide restart reconciliation, a durable JobId map,
  cancellation ownership, watchdog enforcement, hard budgets, or non-blocking
  launch acceptance. Do not claim those properties from this launcher.

## Agent Handoff

The child must begin from its assigned current `as-is.md` record and update
only its component boundary. The parent rereads the child record after the
process exits, accounts for failed or cancelled descendants, and performs
nearest-common-ancestor integration only after the child handoff is valid.

The implementation is intentionally adapted from Pi's bundled subagent
extension pattern: discover an agent file, write its body to a private
temporary prompt file, launch a separate `pi` process, and collect JSON-mode
output. The repository skill keeps the mechanism dependency-free and uses the
repository's existing agent definitions as the source of role prompts.

## Checks

Run the launcher syntax check and dry-run before any authorized model call:

```bash
bun build --no-bundle --target bun \
  --outfile /tmp/as-is-spawn-pi-subagent.js \
  skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts
bun skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts \
  --agent .agents/agents/as-is.md \
  --task "Inspect the current root task record." \
  --cwd "$PWD" \
  --dry-run
```

Confirm that the dry-run names the expected agent file, repository directory,
Pi executable, system-prompt handoff, and task without contacting a provider.

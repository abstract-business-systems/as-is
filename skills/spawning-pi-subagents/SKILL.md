---
name: spawning-pi-subagents
description: Starts an isolated Pi child process from a repository agent Markdown file. In blocking mode it returns the child's process output; with --detach it returns a handle and runs the child independently under a detached budget supervisor. Use when delegating a bounded task to as-is, component-builder, or another named agent.
compatibility: Requires Bun and a local Pi package or binary. The child process must run in the target repository and receive an explicit agent file and task.
---

# Spawning Pi Subagents

Use this skill when a role must run in a separate Pi process with an isolated
context window. The process boundary is real. By default the caller blocks on
the child's exit and receives its output; with `--detach` the caller receives a
handle and the child runs independently, with a detached supervisor enforcing
any wall-clock budget so the parent is free to move on or observe by polling.

## Contract

The launcher accepts:

- an agent Markdown file, such as `.agents/agents/as-is.md` or
  `.agents/agents/component-builder.md`;
- one task string;
- the repository working directory;
- optional Pi model, tool, approval, and additional skill settings;
- optional wall-clock and monetary-cost budget constraints.

### Budget Surface

The launcher forwards and enforces delegation budgets so a parent can bound a
child run and account for a budget-stopped return:

- `--budget-wall-clock-seconds <n>` — a hard wall-clock limit. When `n > 0`,
  the launcher starts a process-level timer when the child launches. On expiry
  it sends `SIGTERM` to the child's process group, then `SIGKILL` after a short
  grace, and returns a distinguishable budget-stopped outcome. The launcher's
  own `--dry-run` and prompt-preparation time are not counted against the
  budget; only the child run is bounded.
- `--budget-cost-usd <n>` — a monetary cost limit in USD forwarded to the
  executing agent through the private system-prompt handoff. Pi cost is not
  directly observable from the launcher, so cost is self-limited by the child;
  the launcher records that the constraint was forwarded so a parent can
  account for it.

When a wall-clock budget stops the child, the launcher writes a recorded
stderr marker of the form
`as-is budget-stopped: limit=wall-clock seconds=<n> exit=124` and exits with
status `124`. A zero or unset budget disables enforcement.

The launcher extracts the agent file body and passes it to Pi as an appended
system prompt. It reads simple `model:` and `tools:` front-matter values when
present. OpenCode-specific front matter such as `permission:` is not a Pi
permission mechanism; the explicit Pi tool and approval options are the host
controls.

## Invocation

```bash
bun skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts \
  --agent .agents/agents/component-builder.md \
  --task "Delegate the bounded component task recorded in the named component as-is.md." \
  --cwd "$PWD" \
  --tools read,grep,find,ls,bash,edit,write \
  --approve
```

With delegation budgets forwarded to the child:

```bash
bun skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts \
  --agent .agents/agents/component-builder.md \
  --task "Implement the bounded task recorded in the assigned component." \
  --cwd "$PWD" \
  --budget-wall-clock-seconds 220 \
  --budget-cost-usd 0.35
```

For a short task:

```bash
bun skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts \
  --agent .agents/agents/component-builder.md \
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

## Detach Mode

With `--detach`, the launcher spawns the child as an independent detached
process and returns a handle on stdout instead of blocking on completion:

```json
{
  "jobId": "j-...",
  "pid": 12345,
  "logPath": "/tmp/as-is-child-XXX/child.log",
  "recordPath": "./component/as-is.md",
  "budgetWallClockSeconds": 120,
  "budgetCostUsd": 0.3
}
```

The child's stdout and stderr go to `logPath`. The child's `as-is.md` record is
the result and handoff; there is no talk-back channel to the parent. Any agent
— the parent, `as-is`, a sibling, or a supervisor — observes the child by
polling its record (structured status) and `logPath` (detail).

When a wall-clock budget is set in detach mode, the launcher spawns a detached
supervisor (an internal `--supervise` invocation) that outlives the launcher and
kills the child's process group on expiry, exiting early once the group is gone.
The parent is not the budget holder and may move on to other work.

Pass `--record <path>` to include the component record path in the handle. The
parent usually knows this path since it created the record.

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
  process, and a private temporary system-prompt file. In blocking mode it
  forwards child output and removes the temporary prompt after exit. Budget
  constraints are appended to the private system prompt so the child can
  self-limit on cost; the wall-clock budget is enforced at the launcher process
  level in blocking mode, or by a detached supervisor in `--detach` mode.
- A zero Pi exit code is only a host observation. Reread the durable component
  record and validate its status, handoff, acceptance evidence, and cleanup
  before treating the task as complete. An exit status of `124` with the
  `as-is budget-stopped` stderr marker means the wall-clock budget stopped the
  child; account for that as a budget-stopped return rather than a normal
  completion.
- This skill does not provide restart reconciliation, a durable JobId map,
  cancellation ownership, watchdog enforcement beyond the wall-clock budget
  timer, cost-budget enforcement at the launcher, or a durable handle registry.
  Non-blocking launch acceptance is available via `--detach`. Cost enforcement
  is forwarded to the child for self-limiting
  because Pi cost is not directly observable from the launcher; record that
  approximation when relying on it. Do not claim stronger properties from this
  launcher.

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
When budgets are supplied, confirm the dry-run `budget` object records the
forwarded `wall-clock-seconds` and `cost-usd` values.

A smallest deterministic enforcement check that does not contact a provider:
point `--pi` at a stub that sleeps longer than the budget and assert the
launcher returns promptly with exit `124` and the `as-is budget-stopped`
stderr marker, leaving no lingering child process.

```bash
cat > /tmp/as-is-pi-stub.sh <<'EOF'
#!/usr/bin/env bash
sleep 30
exit 0
EOF
chmod +x /tmp/as-is-pi-stub.sh
bun skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts \
  --agent .agents/agents/as-is.md \
  --task "Stub task for budget enforcement." \
  --cwd "$PWD" \
  --pi /tmp/as-is-pi-stub.sh \
  --budget-wall-clock-seconds 1 \
  --budget-cost-usd 0.1
echo "exit=$? (expect 124)"
```

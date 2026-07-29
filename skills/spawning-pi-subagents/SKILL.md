---
name: spawning-pi-subagents
description: Starts an isolated Pi child process from a repository agent Markdown file under a detached bounded supervisor that is the child's direct parent and owns the wall-clock budget. The child runs in an isolated git worktree pruned from the caller's HEAD so its destructive git operations cannot reach the caller's uncommitted work. In blocking mode the launcher waits and returns the child's exit; with --detach it returns a handle immediately and the child runs independently. Use --jobs to query the status of all registered jobs. Use when delegating a bounded task to as-is, component-builder, or another named agent.
compatibility: Requires Bun and a local Pi package or binary. The child process must run in the target repository and receive an explicit agent file and task.
---

# Spawning Pi Subagents

Use this skill when a role must run in a separate Pi process with an isolated
context window. The process boundary is real. In both blocking and detach
modes the Pi child runs under a detached bounded supervisor that is the child's
direct parent: the supervisor owns the wall-clock budget, conveys all
constraints (cost is forwarded for self-limiting), and survives the launcher
process so a delegated child's budget stays enforced even if the launcher or
its parent agent is killed. By default the caller blocks on the child's exit
and receives its output; with `--detach` the caller receives a handle and may
move on or observe by polling the child's record and log. Use `--jobs` to query
the status of all registered jobs on demand.

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

With `--detach`, the launcher returns a handle on stdout immediately and the
child runs under a detached supervisor without blocking the caller:

```json
{
  "jobId": "j-...",
  "pid": 12345,
  "identity": "component-builder",
  "caller": "as-is",
  "parentJobId": "j-...",
  "logPath": "/tmp/as-is-child-XXX/child.log",
  "recordPath": "./component/as-is.md",
  "worktreePath": "/tmp/as-is-child-XXX/worktree",
  "budgetWallClockSeconds": 120,
  "budgetCostUsd": 0.3,
  "launchedAt": "2026-07-29T08:32:11.684Z"
}
```

`pid` is the supervisor pid — the budget owner and the cancel target, not the
Pi child pid. The supervisor is the child's direct parent and outlives the
launcher. `identity` is this child's role; `caller` is the delegating agent's
identity (propagated via the `AS_IS_IDENTITY` env var, or `--caller`);
`parentJobId` is the caller's job id (propagated via `AS_IS_JOB_ID`, or
`--parent-job-id`). The OS parent pid is intentionally not recorded: the
supervisor breaks OS parentage, so lineage is logical (caller identity +
parentJobId), not process-tree based.

The child's stdout and stderr go to `logPath`; the child's `as-is.md` record is
the result and handoff. There is no talk-back channel to the parent: any agent
observes the child by polling its record (structured status) and `logPath`
(detail), or via `--jobs`.

On exit the supervisor appends a completion line to the registry
(`{jobId, event:"finished", exitCode, budgetStopped, wallClockSeconds,
commitSha, committed, finishedAt}`) so the job table reflects finished jobs
with their real wall-clock, exit code, and final commit. The parent reads the
child's record via `git show <commitSha>:<recordPath>` (durable, no filesystem
race). Pass `--record <path>` to include the component record path. Pass
`--parent-job-id <id>` and `--caller <identity>` to record the delegation
lineage (they default from `AS_IS_JOB_ID`/`AS_IS_IDENTITY`, so a child agent
forwards them automatically).

Each launch is appended as one JSON line to `/tmp/as-is-jobs.jsonl`, or to the
path in `AS_IS_JOBS_REGISTRY` when set. Registry writes are best-effort: an
unwritable registry emits a stderr note but never fails the launch. Pass
`--no-registry` to suppress the append.

## Worktree Isolation

By default the child runs in an isolated git worktree pruned from the caller's
`HEAD`, so the child's destructive git operations (`git restore`, `checkout`,
`clean`, file edits) cannot reach the caller's uncommitted work. The worktree
is a detached-HEAD checkout of committed state only — the child never sees the
caller's uncommitted changes. The supervisor removes the worktree on a clean
exit (exit 0, not budget-stopped) once the final commit is captured; it
preserves the worktree on a budget stop or non-zero exit so partial work
remains for recovery. A parent process need not outlive its children: each
child's budget is owned by its own detached supervisor, which survives the
parent's death.

Pass `--no-worktree` to run the child in the caller's working directory
instead (disables isolation; use only when the caller has no uncommitted work
to protect). Worktree creation is best-effort: if it fails, the supervisor
falls back to the caller's cwd and records the degradation.

## Job Status

`--jobs` prints a fused status table for every registered job without starting
a Pi process: `jobId`, `identity`, `caller`, process liveness and budget from
the registry, joined to the task-record status read via `git show
<commitSha>:<recordPath>` (or from disk when no commit is recorded). A
supervisor that is no longer alive with no completion line is reported as
`crashed (recovery candidate)` — a dead process whose record is still
non-terminal. The `caller`/`identity` columns reconstruct the logical
delegation tree (OS parentage is broken by the supervisor). This is the
on-query observation surface for the fire-and-forget model; it is read-only and
never contacts a provider.

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
  process, and a private temporary system-prompt file. In both blocking and
  detach modes the child runs under a detached bounded supervisor that is the
  child's direct parent, in an isolated git worktree pruned from the caller's
  HEAD. The supervisor owns the wall-clock budget, conveys the cost limit via
  the prompt for self-limiting, records the outcome (exit code, wall-clock,
  budget-stopped, final commit SHA) to a result file and a registry completion
  line, and survives the launcher's death. Budget constraints are appended to
  the private system prompt so the child can self-limit on cost; the wall-clock
  budget is enforced by the supervisor as a hard process-level stop (SIGTERM
  then SIGKILL on the child's process group). A parent agent need not outlive
  its children: each child's budget is owned by its own supervisor.
- A zero Pi exit code is only a host observation. Reread the durable component
  record and validate its status, handoff, acceptance evidence, and cleanup
  before treating the task as complete. An exit status of `124` with the
  `as-is budget-stopped` stderr marker means the wall-clock budget stopped the
  child; account for that as a budget-stopped return rather than a normal
  completion.
- This skill does not provide restart reconciliation, cancellation ownership
  for whole subtrees, watchdog enforcement beyond the wall-clock budget timer,
  or cost-budget enforcement at the launcher. A best-effort job registry and
  on-query `--jobs` status are available; non-blocking launch is available via
  `--detach`. Cost enforcement is forwarded to the child for self-limiting
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

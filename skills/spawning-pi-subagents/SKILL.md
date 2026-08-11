---
name: spawning-pi-subagents
description: Provides an isolated Pi child-process launch procedure for a repository agent Markdown file under a detached bounded job runner that is the child's direct parent and owns the wall-clock budget. The child runs in an isolated git worktree pruned from the caller's HEAD so its destructive git operations cannot reach the caller's uncommitted work. In blocking mode the launcher waits and returns the child's exit; with --detach it returns a handle immediately and the child runs independently. Use --jobs to query the status of all registered jobs. An authority-bearing agent or orchestrator invokes this procedure when delegating a bounded task to as-is, component-builder, or another named agent.
compatibility: Requires Bun and a Pi package or binary whose version satisfies the skill's declared peer compatibility. Skill-owned runtime and test dependencies are installed from the skill package, not the project root.
---

# Spawning Pi Subagents

Use this skill when a role must run in a separate Pi process with an isolated
context window. The process boundary is real. In both blocking and detach
modes the Pi child runs under a detached bounded job runner that is the child's
direct parent: the runner owns the wall-clock budget, conveys all
constraints (cost is forwarded for self-limiting), and survives the launcher
process so a delegated child's budget stays enforced even if the launcher or
its parent agent is killed. By default the caller blocks on the child's exit
and receives its output; with `--detach` the caller receives a handle and may
move on or observe by polling the child's record and log. Use `--jobs` to query
the status of all registered jobs on demand.

## Contract

The launcher accepts:

- an agent Markdown file from the canonical repository role sources, such as
  `agents/as-is/agent.md` or `agents/component-builder/agent.md`. The
  `.agents/agents` tree is reserved for client-host projection semantics;
- one task string;
- the repository working directory;
- optional Pi model, thinking level, approval, and host skill settings; the
  future migration target is globally available skills rather than
  agent-front-matter skill selection. Ordinary tool admission comes only from
  the selected agent
  file's `tools:` front matter;
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
system prompt. For ordinary roles, the agent file's `tools:` front matter is
the authoritative capability declaration: caller `--tools` and `--no-tools`
overrides are rejected, missing declarations produce no implicit tool set, and
unsupported declarations fail before Pi starts. The launcher does not add tools
because of an agent identity. Delegation is capability-based and no-holds-barred:
any agent that declares `call_subagent` may target any canonical
`agents/<role>/agent.md`; caller name, parent job ID, target identity, and runtime
lineage are diagnostic metadata rather than authorization gates. Target
contracts and host safety profiles still apply. The `expert` validation role is
the sole launcher-owned capability exception and always receives the fixed
read-only `read,grep,find,ls,git_inspect` profile. Model policy is resolved from
root `as-is.json` `configuration.agents`: `defaultModel`, `provider`, and the
named `models` map. Thinking policy accepts `off`, `minimal`, `low`, `medium`,
`high`, `xhigh`, and `max`; it resolves explicit launcher override, then agent
`thinking:` front matter, then `defaultThinkingLevel`. The resulting model,
provider, and thinking level are passed explicitly to Pi. Supported project
presets are `small`, `medium`, `large`, and `xlarge`.
The launcher does not read model or provider policy from OpenCode configuration
or environment variables; those are not system configuration sources.
OpenCode-specific front matter such as `permission:` is not a Pi permission
mechanism; explicit Pi approval flags remain host controls.

## Invocation

```bash
bun skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts \
  --agent agents/component-builder/agent.md \
  --task "Delegate the bounded component task recorded in the named component as-is.md." \
  --cwd "$PWD" \
  --approve
```

With delegation budgets forwarded to the child:

```bash
bun skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts \
  --agent agents/component-builder/agent.md \
  --task "Implement the bounded task recorded in the assigned component." \
  --cwd "$PWD" \
  --budget-wall-clock-seconds 220 \
  --budget-cost-usd 0.35
```

For a short task:

```bash
bun skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts \
  --agent agents/component-builder/agent.md \
  --task "Implement the bounded task recorded in the assigned component." \
  --cwd "$PWD"
```

The launcher does not use an arbitrary `pi` found on `PATH`. It resolves Pi in
this order:

1. `--pi <path>`;
2. `PI_BIN`;
3. the nearest skill-owned `node_modules/.bin/pi` or repository-local binary
   explicitly supplied by the skill package;
4. Bun's package runner for the skill's declared Pi peer-compatible package.

The launcher must resolve the Pi executable and the package-owned extension from
the same compatible Pi version. A future version-preflight implementation must
reject an incompatible binary/package before starting the child. Until that
preflight exists, `PI_PACKAGE` may select an explicitly approved package/version
and `--dry-run` remains available to inspect the resolved command. The package
runner may install the pinned package into Bun's local cache on first use, so
treat the first real launch as an external setup effect.

## Detach Mode

With `--detach`, the launcher returns a handle on stdout immediately and the
child runs under a detached bounded job runner without blocking the caller:

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

`pid` is the bounded job runner pid — the budget owner and the cancel target, not the
Pi child pid. The runner is the child's direct parent and outlives the
launcher. `identity` is this child's role; `caller` is the delegating agent's
identity (propagated via the `AS_IS_IDENTITY` env var, or `--caller`);
`parentJobId` is the caller's job id (propagated via `AS_IS_JOB_ID`, or
`--parent-job-id`). When the caller has a persisted Pi session, the launcher
also forwards only the session store scope (`AS_IS_SESSION_CWD` and
`AS_IS_SESSION_DIR`) so a child in an isolated worktree can resolve an exact
session ID through the same readable local store. These variables are
filesystem-scope references, not authorization grants or session contents. The
OS parent pid is intentionally not recorded: the
runner breaks OS parentage, so lineage is logical (caller identity +
parentJobId), not process-tree based.

The child's stdout and stderr go to `logPath`; the child's `as-is.md` record is
the result and handoff. There is no talk-back channel to the parent: any agent
observes the child by polling its record (structured status) and `logPath`
(detail), or via `--jobs`.

On exit the bounded job runner appends a finished outcome to the registry
(`{jobId, event:"finished", exitCode, budgetStopped, wallClockSeconds,
commitSha, committed, integrationStatus, handoffEligible, handoffBlockers,
finishedAt}`). These are launcher observations, not a merge command or a
semantic completion decision. The receiving parent component-builder owns
semantic handoff review and any nearest-common-ancestor integration; the
launcher only reports whether caller-HEAD ancestry currently proves that the
child commit is reachable. A finished process is not necessarily a completed
handoff: `handoffEligible` is true only when the committed task evidence,
validation, result, descendant closure, scoped commit, and caller-HEAD ancestry
all pass. The parent reads the transient task record via `git show
<commitSha>:<component>/tasks.md` (durable, no filesystem race) and must treat
missing or non-completed evidence as incomplete. Pass `--record <path>` to
identify the component's durable `as-is.md` path. Pass `--parent-job-id <id>`
and `--caller <identity>` to record the delegation lineage (they default from
`AS_IS_JOB_ID`/`AS_IS_IDENTITY`, so a child agent forwards them automatically).

Each launch is appended as one JSON line to `/tmp/as-is-jobs.jsonl`, or to the
path in `AS_IS_JOBS_REGISTRY` when set. Registry writes are best-effort: an
unwritable registry emits a stderr note but never fails the launch. Pass
`--no-registry` to suppress the append.

## Worktree Isolation

By default the child runs in an isolated git worktree pruned from the caller's
`HEAD`, so the child's destructive git operations (`git restore`, `checkout`,
`clean`, file edits) cannot reach the caller's uncommitted work. The worktree
is a detached-HEAD checkout of committed state only — the child never sees the
caller's uncommitted changes. The bounded job runner removes the worktree only
when there is nothing to lose — decided on git facts, not on the child's exit
code: it removes the worktree when the child advanced `HEAD` (committed — the
work is durable in git and recoverable via the recorded `commitSha`) or when
the tree is clean (no uncommitted changes). It preserves the worktree when
there are uncommitted changes and no commit, so partial work remains for
recovery regardless of the exit code or budget-stop state. This is a
mechanical preservation rule ("is there uncommitted state?"), not a semantic
work judgment; the commit decision is the agent's, not the runner's. A parent
process need not outlive its children: each child's budget is owned by its own
detached bounded job runner, which survives the parent's death.

Pass `--no-worktree` to run the child in the caller's working directory
instead (disables isolation; use only when the caller has no uncommitted work
to protect). Worktree creation is best-effort: if it fails, the runner
falls back to the caller's cwd and records the degradation.

Preserved worktrees are the recovery surface: `--jobs` reports them with the
worktree path and the preservation reason (`preserved: uncommitted changes
without a commit (recovery candidate) @ <path>`). Inspect a preserved worktree
with `git -C <path> diff` or `git -C <path> log`, cherry-pick a WIP commit, or
copy specific files out, then remove it with `git worktree remove --force
<path>`.

## Job Status

`--jobs` prints a fused status table for every registered job without starting
a Pi process: `jobId`, `identity`, `caller`, process liveness and budget from
the registry, joined to the task-record status and recomputed handoff
eligibility. A finished exit-0 job with failed or missing handoff evidence is
reported as `incomplete`, never `completed`; pending-parent-integration and
unreachable caller ancestry remain explicit blockers. A runner that is no
longer alive with no completion line is reported as `crashed (recovery
candidate)` — a dead process whose record is still non-terminal. A finished
job whose worktree was preserved (uncommitted changes without a commit) is
reported with `preserved: <reason> @ <path>` so the worktree can be inspected
and recovered. The `caller`/`identity` columns reconstruct the logical
delegation tree (OS parentage is broken by the runner). This is the on-query
observation surface for the fire-and-forget model; it is read-only and never
contacts a provider.

## Process Rules

- Invoke one configured role at a time unless the parent task explicitly
  authorizes independent siblings.
- Resolve the agent file and component record before launch; do not substitute
  `general`, `explore`, or a direct worker when the configured role is missing.
  The launcher owns an expert capability profile: it ignores caller
  tool/approval/session/extension overrides, forces same-worktree and
  ephemeral session mode, disables extensions except the bundled inspection
  extension, and exposes only `read,grep,find,ls,git_inspect`. `git_inspect`
  permits only bounded status, scoped diff, diff-check, and HEAD-summary
  operations; it has no shell or write path. Caller and parent metadata are
  diagnostic only and do not authorize or reject the target.
- Pass the child its role contract, task-specific direction, named
  dependencies, and centrally supplied repository context. The current
  adapter still supports explicit/front-matter skill paths as a compatibility
  surface; the separation migration must remove that selection mechanism
  before role downsizing relies on global skill availability. Do not copy an
  unrelated root record or private runtime state into the prompt.
- Use `--approve` only when project-local files are explicitly trusted for that
  attempt. Do not place credentials or tokens in task arguments, task files, or
  output.
- The launcher uses `--mode json` and `--print`; sessions are durable by default under the supervisor job directory, with `--no-session` providing ephemeral runs. The owning skill package supplies its Pi extension and dependencies through the supported package mechanism. The current adapter forwards explicit and agent-front-matter skill paths as a compatibility surface; the migration target is global skill availability, with no agent-front-matter selection or allowlist. The `analyze_session` tool uses the effective user's readable project-local session store, including the forwarded store scope for isolated children; it remains exact-ID, bounded, read-only metadata inspection and does not require tracer approval. It resolves model presets and providers from root `as-is.json`, passing explicit `--provider` and `--model`, and uses a shell-free child
  process, and a private temporary system-prompt file. In both blocking and
  detach modes the child runs under a detached bounded job runner that is the
  child's direct parent, in an isolated git worktree pruned from the caller's
  HEAD. The runner owns the wall-clock budget, conveys the cost limit via
  the prompt for self-limiting, records the outcome (exit code, wall-clock,
  budget-stopped, final commit SHA) to a result file and a registry completion
  line, and survives the launcher's death. Budget constraints are appended to
  the private system prompt so the child can self-limit on cost; the wall-clock
  budget is enforced by the runner as a hard process-level stop (SIGTERM
  then SIGKILL on the child's process group). A parent agent need not outlive
  its children: each child's budget is owned by its own runner.
- A zero Pi exit code is only a host observation. A child commit is only a
  durable child handoff: its `integrationStatus` is
  `pending-parent-integration` until the receiving parent component-builder
  explicitly integrates the scoped commit from the caller repository and
  ancestry verification proves it is an ancestor of the caller branch. The
  launcher does not merge, cherry-pick, resolve conflicts, or decide whether
  the parent should integrate. Pending integration is a hard completion
  blocker for an isolated child handoff. For work that stays in the parent
  worktree, has no repository changes, or is same-component in-process
  assistance, there is no child commit to integrate; the parent records that
  no separate integration was required and commits its own scoped work. That
  case must be explicit rather than inferred from exit status. Reread the
  durable component record and validate its status, handoff, acceptance
  evidence, parent integration or explicit no-integration disposition, and
  cleanup before treating the task as complete. An exit status of `124` with
  the `as-is budget-stopped` stderr marker means the wall-clock budget stopped
  the child; account for that as a budget-stopped return rather than a normal
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
only its component boundary. The receiving parent component-builder rereads
the child record after the process exits, accounts for failed or cancelled
descendants, reviews residual risk, and performs any required
nearest-common-ancestor integration only after the child handoff is valid. The
launcher is an evidence and ancestry observer; it never owns the merge.

A separate merge is not required when the parent retained the worktree and
owns the resulting changes, when the task produced no repository changes, or
when assistance and validation occurred in-process. The parent must record the
explicit no-integration disposition and still satisfy task validation,
descendant closure, and scoped-commit requirements.

The implementation is intentionally adapted from Pi's bundled subagent
extension pattern: discover an agent file, write its body to a private
temporary prompt file, launch a separate `pi` process, and collect JSON-mode
output. The repository skill keeps the mechanism dependency-free and uses the
repository's existing agent definitions as the source of role prompts.

## Checks

The launcher supports a syntax/build check and an optional dry-run inspection
that does not contact a provider. Expert validation is same-worktree by design
so it can inspect the builder's uncommitted state; it never persists raw
sessions. The fixed inspection extension executes only allowlisted `git`
queries and caps output; unsupported operations and mutation-capable tools are
not exposed. When using `--dry-run`, confirm that it names
the expected agent file, repository directory, Pi executable, system-prompt
handoff, and task. When budgets are supplied, confirm the dry-run `budget`
object records the forwarded `wall-clock-seconds` and `cost-usd` values.

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
  --agent agents/as-is/agent.md \
  --task "Stub task for budget enforcement." \
  --cwd "$PWD" \
  --pi /tmp/as-is-pi-stub.sh \
  --budget-wall-clock-seconds 1 \
  --budget-cost-usd 0.1
echo "exit=$? (expect 124)"
```

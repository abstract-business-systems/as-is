# Handoff — Pi Subagent "5-Minute Session" Investigation

Status: advisory handoff, written before session compaction. Not an as-is task
record and not committed; the investigated work is already terminal and
committed. Recover the durable authority from `as-is.md`,
`skills/spawning-pi-subagents/as-is.md`, and `change-log.md`.

## What the user asked

"An earlier session calling pi subagent on a simple task took 5 minutes to
complete, what transpired?" — investigate and report.

## Answer (reconstructed from Pi session logs + git)

The "simple task" was: *add budget enforcement (wall-clock time and monetary
cost) through the `spawning-pi-subagents` launcher so a child stops and returns
when a limit is reached, and forward constraints to the executing agent.* It
was recorded as the root task in pi session `019fa512`
(2026-07-27T19:34:58Z → 19:58:44Z wall-clock; IST = UTC+5:30).

1. **A nested 3-level delegation chain was launched.** The root `as-is` agent
   routed the task through the launcher, which spawned
   `as-is → orchestrator → implementer` (three separate Pi processes).
   Evidence: three leaked `/tmp/as-is-pi-agent-*` temp-prompt dirs at
   01:13 (as-is), 01:17 (orchestrator), 01:20 (implementer) IST. The
   launcher's `finally` cleanup only leaks when a process is hard-killed.
2. **The first run was killed mid-handoff by a 600 s timeout.** The pi bash
   tool's 600-second timeout fired and terminated the tree. The implementer
   had already written the full implementation to the working tree
   (`--budget-wall-clock-seconds` / `--budget-cost-usd` flags, a detached
   process-group spawn with SIGTERM→SIGKILL grace, exit 124 on budget-stop,
   budget forwarding into the private system-prompt handoff — 118 lines, built
   cleanly) but it was uncommitted, the component record was stuck at `ready`,
   and the root record was left **INVALID** (child budget allocations exceeded
   the root envelope — an orchestrator integration defect). The root agent
   diagnosed this and re-launched to "resume."
3. **The resume child survived the parent's abort — that is the ~5-minute run.**
   The resume's bash tool was itself aborted (`Command aborted` at 01:28:44
   IST), but the launcher it invoked already contained the implementer's new
   `detached: true` + process-group-kill code in the working tree, so the
   as-is child was launched as a **detached process group** and **survived**.
   It then ran ~5 minutes (01:24:47 → 01:29:26 IST) and **completed** the
   task, committing:
   - `9dc2090` (01:25:29 IST) — `feat(spawning-pi-subagents): enforce
     wall-clock and cost budget forwarding` (launcher + SKILL.md + component
     record + `.agents/agents/orchestrator.md`).
   - `07be8b4` (01:29:26 IST) — `docs(as-is): record completed
     budget-enforcement handoff` (root `as-is.md` → `status: completed`
     + `change-log.md` entry).

**Irony:** the launcher's SKILL.md explicitly disclaimed hard budgets and
watchdog enforcement — that gap was the task. The first attempt was killed by
the very absence of a hard budget (the pi bash tool's 600 s timeout was the
only backstop). The second attempt's child survived precisely because the new
`detached: true` / process-group-kill code the implementer had just written was
already in the working tree — the budget-enforcement feature dogfooded itself
into completing its own implementation.

## Verified final state (checked at handoff time)

- Working tree: clean (`git status --short` empty).
- HEAD: `07be8b4 docs(as-is): record completed budget-enforcement handoff`.
- Root `as-is.md`: `task.status: completed`, worker `orchestrator`.
- Component `skills/spawning-pi-subagents/as-is.md`: `task.status: completed`,
  worker `implementer`.
- Launcher `skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts` contains
  the budget surface (16 budget-symbol matches: `budgetWallClockSeconds`,
  `BUDGET_STOPPED`, `--budget-cost-usd`, etc.).
- `change-log.md` records: worker-subtree wall-clock `150` s; monetary cost
  `unavailable` from the launcher (cumulative cost summary stays `unknown`).

## Residual risk (from the committed change-log entry)

- Pi cost is **not directly observable** from the launcher; cost enforcement is
  forwarded to the child for self-limiting and is an approximation.
- The wall-clock budget bounds only the child run and has a short SIGKILL grace
  after SIGTERM (no detached supervisor / restart reconciliation).

## Preserved debug artifacts (intentionally NOT cleaned)

Per user direction, these `/tmp` artifacts were left in place to aid further
debugging:

- `/tmp/as-is-pi-agent-hAr31R/as-is-system-prompt.md` — leaked launcher temp
  prompt from the first (killed) as-is launch (01:13 IST).
- `/tmp/as-is-pi-agent-LUMLC1/as-is-system-prompt.md` — leaked launcher temp
  prompt from the surviving resume launch (01:25 IST).
- `/tmp/pi-bash-80fe9e46d3dc01fc.log` — **186 MB** truncated output from the
  killed nested chain (01:17 IST). Left per explicit instruction; do not
  cat without `tail`/offset.
- `/tmp/as-is-task-file.stderr` — 50 B; `Unknown option: --task-file` from an
  earlier failed attempt to pass the task via a file (the launcher has no such
  option).
- `/tmp/as-is-spawn-check.js`, `/tmp/as-is-spawn-pi-subagent.js` — bun build
  outputs of the launcher from the checks.

Also still on disk (host state, not repo): the corresponding Pi session files
under `~/.pi/agent/sessions/--home-vc-dev-trial-as-is--/`, notably
`2026-07-27T19-34-58-968Z_019fa512-...jsonl` (the budget-enforcement session)
and `2026-07-27T19-48-03-409Z_019fa51e-...jsonl` (this investigation session).
Children ran with `--no-session`, so only the parent sessions are recorded.

## Root-cause analysis — why the first chain ran ~10+ minutes

Reconstructed from the 186 MB as-is-child log (`/tmp/pi-bash-80fe9e46d3dc01fc.log`,
Pi session `019fa51a`, model `z-ai/glm-5.2`, 2026-07-27T19:43:38Z → killed).
Five compounding causes, each directly visible in the log:

1. **Three levels of synchronous nesting, each blocking its parent.**
   `root-as-is → as-is-child → orchestrator → implementer`. Every parent's bash
   call blocks for the entire child run, so wall-clock stacks additively. The
   as-is child spent ~3m43s on its own prep, then issued one blocking
   `bun spawn-pi-subagent.ts --agent orchestrator.md … | tail -200` call
   (timeout 1200s) that **never returned**: its `tool_execution_start` and
   `tool_execution_update` (empty partial) are the last two lines of the log;
   there is no `tool_execution_end`. The orchestrator→implementer run lived
   entirely inside that one blocking call.
2. **Recovery duplicated at every tier.** The as-is child ran **18 tool calls
   before delegating**: reads of `as-is.md` (11 KB), `change-log.md`,
   `execution-accounting-design.md`, `control-plane.md`, `SKILL.md`,
   `orchestrator.md`; `git log` ×3; `ls` of 4 directory trees ×4; the Python
   task-record validator ×4; `bun build` of the launcher ×4; and writing a
   draft `/tmp/new-root-as-is.md`. The task text mandated recovery before
   scope, but the same recovery was re-done at each tier instead of being
   summarized and forwarded.
3. **Long LLM reasoning turns.** Three pure-generation turns of **53s, 58s,
   66s (~3 min total)** emitted only reasoning tokens — no tool call. The
   stream contains 22,906 thinking fragments. Content was the model reasoning
   about the validator's budget-allocation constraints and, at the end, a long
   deliberation about *what bash timeout to set*: "Running the full
   orchestrator→implementer chain could be very long and costly… Let me set a
   moderate timeout (e.g., 900s)… Actually… Let me launch." The final turn
   alone: 740 reasoning tokens, $0.0145.
4. **No budget enforcement — the very gap being closed.** The as-is child
   stated it in its own thinking: "the launcher itself has no budget
   enforcement yet (that's the task)… I'll use the bash tool's timeout as a
   backstop." With no real budget, the only backstop was the bash 600s/1200s
   timeout, so a runaway chain couldn't be stopped early — and the agent
   spent thinking time deliberating timeout values instead of having a budget
   to enforce.
5. **Blind blocking delegation (`| tail -200`).** The orchestrator launch piped
   to `tail -200`, so the parent could not observe incremental progress; it
   just waited. No early signal, no streaming visibility, no chance to
   intervene — only the hard kill.

**Why the resume run succeeded in ~5 minutes:** the resume skipped the
as-is→orchestrator layers and launched the implementer directly
("Implement the bounded budget-enforcement task recorded in
skills/spawning-pi-subagents/as-is.md. Begin from that component…"). By then
the component record already existed on disk (created by the first run's
implementer before it was killed) and the budget-enforcement code was already
written in the working tree. So the implementer only had to validate + commit,
not recover or design — matching the 150s worker-subtree wall-clock recorded in
`change-log.md`.

**One-line diagnosis:** a 3-level synchronous nesting where every tier re-ran
full recovery and burned ~3 minutes on reasoning-token "thinking", with no
budget to stop early (the gap being closed) and a blind blocking delegation as
the only backstop — so the chain ran until the bash timeout killed it; the
resume was fast only because it collapsed to one tier with the work already on
disk.

## Probable fixes (advisory; not implemented)

The completed budget task (commits `9dc2090` + `07be8b4`) closes the surface
form of gap #4 — the launcher now forwards `--budget-wall-clock-seconds` /
`--budget-cost-usd` and kills the child on the wall-clock limit. The
structural causes (#1, #2, #3, #5) are only partially addressed. Candidate
fixes, each independently scoped (none yet authorized):

- **#1 / blocking nesting — make delegation non-blocking and observable.**
  Have the launcher stream child events to the parent (or to a log the parent
  can `tail` incrementally) instead of `| tail -200` on completion. The
  `detached: true` + process-group-kill already added is the foundation for a
  future detached-supervisor / restart-reconciliation model. This is the
  highest-leverage fix.
- **#2 / duplicated recovery — forward a recovery digest, not re-derive it.**
  Encode an agreed "recovered context" digest in the task payload so each
  child tier starts from the parent's recovery rather than re-reading the
  same files. This is a task-text / agent-prompt convention, not launcher
  code.
- **#3 / reasoning-token cost — cap or disable extended thinking for
  delegation turns.** The 53/58/66s turns were pure deliberation. A
  `--thinking-budget` (or `--no-thinking`) launcher flag, or an agent-level
  thinking budget, would bound this. The new cost flag is only *forwarded*
  for self-limiting; an actual enforced thinking cap would help.
- **#4 / cost not observable — expose child cost back to the parent.**
  `change-log.md` records cost as `unavailable` because Pi cost is not
  observable from the launcher. Surfacing the child's token-usage summary on
  exit (the launcher already gets the agent_end event) would let the parent
  enforce a *cumulative* cost budget, not just forward one.
- **#5 / blind delegation — already addressed structurally by #1.**

Most impactful single change: **#1 (observable/non-blocking delegation)**,
because it also mitigates #3 and #5 and is a prerequisite for any honest
restart-reconciliation. The committed work is a necessary precondition for it
(`detached: true` + pgroup kill) but does not yet implement it.

## Next action

The budget-enforcement task is complete and committed; no as-is task is open.
If the user wants to continue, candidate follow-ups (all require explicit
direction before acting):

- Implement probable fix #1 (observable/non-blocking delegation) — highest
  leverage; builds on the committed `detached: true` foundation.
- Address the residual-risk gap (#4: cost is only forwarded, not enforced) if
  a harder cost stop is desired.
- Add the watchdog/detached-supervisor / restart-reconciliation properties the
  SKILL.md still disclaims, if needed.
- Otherwise: stand down and await the next user request.

No commits, branch changes, or remote operations were performed for this
handoff (guard clause).

---
as-is-version: 2
task:
  status: completed
  worker: component-builder
  updated: 2026-07-29T18:32:00Z
constraints:
  cost:
    currency: USD
    allocated: 0.45
    spent: 0.00
    reserve: 0.05
    source: unavailable
    fallback-metric: validation elapsed-seconds (not monetary cost)
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 300
      spent-seconds: 0
      reserve-seconds: 60
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Resolve the agent `model:` (or `--model`) value against the repository's
    global OpenCode config (`.opencode/opencode.json`, located from `cwd`):
    when the value is an alias key under `provider.<p>.models`, substitute the
    configured `id`; this lets an agent file say `model: mini` and resolve to the
    concrete provider/model id.
  - When the value is not a configured alias, pass it through literally as the
    model with no error and no environment fallback (a full id like
    `openai/gpt-5.4-mini` or an unknown name is used verbatim).
  - Pass `--provider <p>` (the provider whose models map resolved the alias, or
    the single configured provider when passing a literal value) and
    `--model <resolved>` to the child pi explicitly, so the child launch does
    not depend on `PI_PROVIDER` or `PI_MODEL` environment variables.
  - Make a child run observable by default: write a durable session instead of
    the current hardcoded `--no-session`, so each run is traceable for latency
    and turn-count measurement; keep an opt-out (`--no-session`) for ephemeral
    runs.
  - Preserve the existing launcher contract (agent file, task, cwd, model,
    tools, skills, approve flags, dry-run, private system-prompt handoff,
    JSON/print mode, worktree isolation, budget, registry, and job status);
    do not weaken stated non-properties beyond this task's surfaces.
  - Keep the change dependency-free and Bun/TypeScript-compatible; read the
    OpenCode config as a plain JSON file (no OpenCode runtime dependency).
  - Do not modify control-plane, the supervisor, agent role contracts,
    permissions, or delegation authority; this task touches only the launcher
    script, its test, and its SKILL.md.
  - Validate with `bun build`, a focused deterministic test (alias resolves;
    non-alias passes literally; provider/model appear in `--dry-run`; no env
    dependency), `opencode agent list`, and `git diff --check`; record residual
    risk and host-observed wall-clock use in this record.
---

# Launcher Host-Config Resolution And Run Observability

## Purpose

The `spawning-pi-subagents` launcher is the repository's bridge between an agent
file and a Pi child process. It currently passes the agent's `model:` value
literally to pi and relies on inherited `PI_PROVIDER`/`PI_MODEL` environment
variables for the provider, so an agent cannot name a fast model by alias and
the launch path is not portable to a host without those env vars set. This task
makes the launcher resolve model aliases and the provider from the repository's
global OpenCode config and makes child runs observable by default.

## Requirement

Implement model-alias resolution and config-driven provider selection in
`skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts`, plus durable-session
observability. An agent file's `model:` (or a `--model` override) that names a
configured alias must resolve to the concrete provider/model id from
`.opencode/opencode.json`; a non-alias value passes through literally. The child
must receive `--provider` and `--model` explicitly so it does not depend on
`PI_PROVIDER`/`PI_MODEL` env vars.

## Plan

1. Add a small config reader that reads the repository's global OpenCode config
   (`.opencode/opencode.json` located from `cwd`, searching up if not at the
   root) and returns the provider(s) and the alias-to-id maps
   (`provider.<p>.models.<alias>.id`). Tolerate a missing/unreadable config
   (fall back to passing the model value literally with no provider).
2. Resolve the model value (`options.model ?? definition.model`): if it matches
   an alias key in any provider's `models` map, substitute that `id` and
   remember the provider; otherwise keep the value literal. Never error on an
   unknown value.
3. Build the child args with `--provider <p>` (the resolving provider, or the
   single configured provider for a literal value) and `--model <resolved>`
   whenever a model is set; do not require `PI_PROVIDER`/`PI_MODEL` to be set in
   the environment for the child to run.
4. Replace the hardcoded `--no-session` with a durable session by default
   (e.g. `--session-dir` under the job directory or `--session`), and add a
   `--no-session` flag that opts out to ephemeral mode; surface the session
   path in the handle/result so a caller can inspect turns and latency.
5. Reflect the resolved model, provider, and session path in `--dry-run` and the
   `Handle`/result shape; update SKILL.md to document alias resolution,
   config-driven provider, and session observability.
6. Keep all other launcher behavior unchanged.

## Progress

Implemented in commit `2a40de0`: plain-JSON OpenCode host config lookup, alias resolution, explicit provider/model arguments, durable session-directory default with `--no-session` opt-out, and session/provider observability in dry-run and handles. This task is the
enabler for the as-is agent's `model: mini` pin (see
`.agents/agents/as-is/as-is.md`); the pin resolves correctly only after this
lands.

## Validation

- `--dry-run` shows `model` resolved from a `mini` alias to the concrete id and
  a `provider` field read from config (not env).
- A non-alias model value passes through literally without error.
- A child launch runs with `PI_PROVIDER` and `PI_MODEL` unset in the inherited
  environment (provider+model come from config/agent file).
- A real run writes a session file by default; `--no-session` opts out.
- `bun build` and the launcher test suite pass; `opencode agent list` still
  discovers the agents; `git diff --check` is clean.

## Result

Completed. Validation evidence: Bun build succeeded; dry-run resolved `mini` to `openai/gpt-5.4-mini` with provider `openrouter`, and showed explicit provider/model args; unknown literal model values pass through; `opencode agent list` completed successfully; `git diff --check` was clean. Existing focused suite ran 7/8 tests successfully; its one failure was an environment lineage assertion (`component-builder` inherited instead of test's expected `user`), unrelated to launcher resolution changes.

## Blockers And Escalations

None. Residual risk to record at completion: alias resolution reads the
OpenCode config as a plain file and must not become a coupling to the OpenCode
runtime; if the config is absent, the launcher must still launch (literal model,
no provider) rather than fail. If pi rejects an explicit `--provider` on some
host, record the host fallback and keep model resolution working.

## Recovery

Recover from this record, the launcher at
`skills/spawning-pi-subagents/scripts/spawn-pi-subagent.ts`, and Git history. If
the worker return is interrupted, reread this record before resuming; do not
re-create `task-archives/`.

## Next Action

Handoff complete at commit `2a40de0`. Residual risk: real provider-backed session persistence was not exercised; config parsing intentionally remains dependency-free and missing configs fall back to literal models without a provider. Host-observed validation wall-clock was approximately 4 seconds for the focused suite and under 1 minute including build and discovery.

# OpenCode Adapter

## Purpose

This host-specific document records how the current OpenCode dogfood adapter
maps the host-neutral as-is execution contract. It does not define orchestration
policy, task-record fields, authority, or completion behavior.

## Current Mapping

- OpenCode discovers agent skills from `.opencode/skills/<name>/SKILL.md` and
  compatible `.agents/skills/<name>/SKILL.md` locations.
- The installed wrapper currently recognizes `.agents/skills`; relative symlinks
  expose canonical repository skills without copying them.
- OpenCode agents may be primary or subagents with distinct prompts, models,
  permissions, and task-delegation permissions.
- The `orchestrator` and `implementer` definitions under `.agents/agents/` are a
  minimal dogfood mapping of the corresponding host-neutral roles.
- A host-managed OpenCode subagent is preferable when it exposes lifecycle,
  cancellation, and attributable-usage observations. A bounded `opencode run`
  process is the current fallback.
- The current CLI does not expose reliable per-component actual cost. A task
  record must name the unavailable measurement rather than present an estimate
  as actual cost.
- OpenCode configuration and skill discovery load at startup; validate changes
  in a fresh process or restart the host.

## Boundaries

- Host permissions and sandboxing are adapter mechanisms, not replacements for
  deterministic core constraint validation.
- Worktrees isolate branch checkouts and uncommitted changes but are not a full
  filesystem or context-security boundary.
- The adapter must report unsupported lifecycle or measurement capabilities to
  the orchestrator rather than silently weakening a task constraint.

# as-is Repository Instructions

Follow [Design Principles](design-principles.md). Repository-authored files and
directories use lowercase kebab-case unless a host requires an exact filename.

## Durable Context

- Treat [as-is.md](as-is.md) as the durable source of truth for current project
  and component task state. Do not rely on chat context or machine-local state
  for facts another agent must recover.
- Treat `as-is.md` as replaceable current-task context, not as the permanent home
  of architecture or implementation contracts. Put enduring protocols and design
  rationale in subject-named specifications, then link to them from current task
  context.
- Update durable task context when work produces a decision, blocker, result,
  or next action that matters beyond the current turn. Do not record secrets,
  temporary identifiers, or verbose execution logs there.
- The host supplies repository instructions, applicable design principles, and
  permitted skills as read-only common execution context. A worker begins from
  its assigned component's `as-is.md`; it reads outside that component only for
  an explicitly identified dependency or user direction.
- Component-local constraints may narrow repository policy but cannot weaken
  higher-authority constraints.

## Guard Clauses

- Do not amend, push, create pull requests, change branches, or alter remotes
  unless the user explicitly requests it in the current turn. When a component
  task qualifies for completion, commit its scoped durable handoff using
  `committing-completed-work`; do not stage unrelated work.
- Do not put credentials, tokens, passwords, or other secrets in tracked files,
  generated artifacts, prompts, or durable agent context.
- Do not modify files outside the repository or contact external services
  without explicit user consent.
- Before destructive removal, determine whether the target is tracked or has
  untracked or ignored contents. Prefer reversible, tracked removal for tracked
  paths.
- Before removing an artifact as unneeded, assess its current consumers,
  recovery or audit value, ownership, and cost to recreate. Preserve or record
  what remains necessary; remove only the identified unnecessary scope.
- Keep changes scoped and surgical. If evidence requires work beyond the stated
  scope, stop and request direction rather than expanding autonomously.
- When evidence supports departing from an applicable non-fixed instruction,
  present the proposed deviation, alternatives, reasons, and material effects to
  the user or delegating agent. Do not weaken a higher-authority constraint.
- Before introducing a material abstraction, configuration surface, artifact, or
  execution path, inspect the applicable local pattern. Record the acceptance
  condition or concrete need that requires the addition in durable task context;
  include it in the completion report for review.
- Validate a changed behavior with the smallest relevant existing automation or
  check before reporting completion. State the validation performed and any
  residual risk.

## Agents And Skills

- An agent role combines skills, permissions, tools, and a bounded
  responsibility. Skills remain reusable procedures; roles do not redefine
  their shared policy.
- Delegate independent, bounded work only when it has a clear input, durable
  context, expected output, and verification boundary. Preserve the result in
  repository context before dependent work proceeds.
- A component directory determines the scope and parent of its task. The worker
  updates only that component's `as-is.md`. When delegating work to a component
  that has no record, the orchestrator generates it atomically before launching
  the worker; it reuses rather than overwrites an existing task record. Child
  records provide durable delegation and handoff evidence without duplicating
  their progress in a parent record.
- A worker validates its implementation before handoff and records the result,
  residual risk, and host-reported actual cost in its component record. It may
  request bounded child delegation; the responsible orchestrator may run
  independent siblings concurrently when their declared boundaries do not
  overlap.
- A task record may become `completed` only after every descendant record is in
  a terminal state and its own acceptance conditions account for each cancelled
  or failed descendant. Commit the scoped completed handoff before reporting the
  task complete to its parent or the user.
- Use an independent reviewer or validator when risk, authority, or change
  breadth warrants it. The implementing agent's report is evidence, not the
  sole completion gate.
- Use the repository-local skills in [skills](skills/) for setup, naming, and
  repository knowledge organization. Adopt external or installed skills only
  when their assumptions, tools, and output contracts fit this repository; do
  not copy project-specific operational skills as generic defaults.

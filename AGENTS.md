# as-is Repository Instructions

Follow [Design Principles](design-principles.md). Repository-authored files and
directories use lowercase kebab-case unless a host requires an exact filename.

## Durable Context

- Treat [as-is.md](as-is.md) as the durable source of truth for current project
  and component task state. Do not rely on chat context or machine-local state
  for facts another agent must recover.
- Update durable task context when work produces a decision, blocker, result,
  or next action that matters beyond the current turn. Do not record secrets,
  temporary identifiers, or verbose execution logs there.
- Read only the context and instructions relevant to the task. Component-local
  policy may narrow repository policy but cannot weaken higher-authority
  constraints.

## Guard Clauses

- Do not commit, amend, push, create pull requests, change branches, or alter
  remotes unless the user explicitly requests it in the current turn.
- Do not put credentials, tokens, passwords, or other secrets in tracked files,
  generated artifacts, prompts, or durable agent context.
- Do not modify files outside the repository or contact external services
  without explicit user consent.
- Before destructive removal, determine whether the target is tracked or has
  untracked or ignored contents. Prefer reversible, tracked removal for tracked
  paths.
- Keep changes scoped and surgical. If evidence requires work beyond the stated
  scope, stop and request direction rather than expanding autonomously.
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
- Use an independent reviewer or validator when risk, authority, or change
  breadth warrants it. The implementing agent's report is evidence, not the
  sole completion gate.
- Use the repository-local skills in [skills](skills/) for setup, naming, and
  knowledge organization. Adopt external or installed skills only when their
  assumptions, tools, and output contracts fit this repository; do not copy
  project-specific operational skills as generic defaults.

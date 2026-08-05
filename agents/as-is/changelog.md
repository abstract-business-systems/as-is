# Changelog

- 2026-08-06: Added focused What's next? routing test and fixture coverage for active/blocked/awaiting-approval precedence, safe concrete backlog fallback with rationale, recommendation-only authorization, and no work starting. Final expert validation passed in the same controlled worktree; routing implementation contract remains unchanged. Prior expert shell/diff evidence blocker was resolved for this revision.

- 2026-08-06: Recovered and integrated the validated as-is migration from commit
  `b3a86eae` and the available sibling worktree without restoring historical
  task state as current authority. Replaced the legacy task-form `as-is.md`
  with durable purpose, design, boundary, and links; retained necessary
  recovery facts here. Added literal **What's next?** routing: actionable
  `active`, `blocked`, or `awaiting-approval` task records first; otherwise
  inspect and prioritize open backlog items through
  `skills/managing-backlog/SKILL.md`. No broader migration remains in this
  component; external legacy consumers, if any, require separately owned work.

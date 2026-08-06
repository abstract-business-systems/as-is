# Changelog

- Completed `tool-contract-and-completion-gates`: tightened the reusable task
  implementation procedure so acceptance validation and terminal descendant
  closure precede changelog handoff, transient task cleanup, and scoped commit.
  The change was validated with the focused launcher checks and a fresh
  read-only expert gate; no runtime authority was changed.

- 2026-08-11: Renamed and broadened the execution-evidence skill to cover bounded trace queries and durably authorized, metadata-only Pi session analysis. It filters unsafe results, separates observations from inferences and sources, and preserves task/control-plane authority. Structural checks and fresh expert validation passed; no raw session content became trace payload.
- 2026-08-04: Added the skills-component backlog and aligned the four approved root concepts—deterministic-skills, presentation-guidance, building-components, and as-is-routed-current-session-delegation—with corrected bounded outcomes, dependencies, acceptance conditions, and open status. No backlog item was implemented.
- 2026-08-06: Added `building-components/SKILL.md`, a reusable bounded component build and handoff procedure preserving task-record authority, configured-agent delegation boundaries, expert gates, validation evidence, recovery, and scoped commits. Plan review passed; final expert review initially caught and then approved correction of the component-builder link. `git diff --check` and staged diff checks passed. Safe to commit; no runtime behavior changed.

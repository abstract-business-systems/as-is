# Skills Backlog

This is the planning index for the `skills/` component, not task authority.
Active work belongs to the owning component's configured task record (default
`tasks.md`); completed items are
removed after their concise summary is recorded in the owning `changelog.md`.

## Items

| ID | Priority | Component | Outcome | Dependencies | Acceptance | Status |
| --- | --- | --- | --- | --- | --- | --- |
| deterministic-skills | High | `skills/` | Identify deterministic portions of existing skills and agents and replace those portions with focused scripts, while retaining intentional generative judgment and without broadening existing contracts. | Audit of existing skill and agent procedures plus approval of each targeted portion. | Each selected deterministic portion has a named script owner, bounded interface, focused repeatable validation, and no claim that the whole skill or agent is deterministic; no unapproved behavior is changed. | open |
| presentation-guidance | Medium | `skills/` | Specify information-shaped Markdown and live-response presentation guidance for reusable skills, leaving role-specific presentation decisions with their owning agent contracts. | Review of `skills/structuring-content/` and applicable design principles. | Guidance is declarative, discoverable from the owning skill, and distinguishes reusable representation rules from agent-role behavior; focused documentation validation passes. | open |
| building-components | High | `skills/` | Define a reusable component build, completion, and handoff procedure while preserving `component-builder` as the role boundary and keeping task authority in component records. | Current `implementing-component-tasks`, `committing-completed-work`, and component-builder contracts. | The procedure has bounded inputs, outputs, delegation boundaries, validation gates, and scoped commit rules; it does not merge agent identity into skill logic. | open |
| as-is-routed-current-session-delegation | High | `skills/` | Define the reusable as-is routing guard for substantive current-session delegation, including authority, configured-role, budget, and repository-boundary checks before launch. | `skills/as-is/`, `skills/spawning-pi-subagents/`, and the configured as-is/component-builder role contracts. | The guard requires durable task context, configured worker selection, forwarded budgets, and boundary checks before launch; direct substantive delegation is explicitly rejected or routed through as-is. | open |
| context-building-canonical-name | High | `skills/context-building` | Retain context-building as the canonical skill name and link it from the concise capability catalog. | Current skill record and capability catalog. | Canonical naming and catalog links are validated without introducing duplicate skill authority. | open |
| maintaining-components-audit | Medium | `skills/maintaining-components` | Audit a user-specified component, or the full component set if later directed, for misalignments against repository-prescribed structure and conventions, and fix confirmed misalignments. | Explicitly bounded component scope and applicable repository conventions. | Confirmed misalignments are fixed with focused validation; no unapproved broad audit or unrelated cleanup is performed. | open |
| delegation-observation | High | `skills/spawning-pi-subagents` | Make delegation non-blocking and observable. | Current launcher contract and lifecycle telemetry. | Detached delegation exposes bounded status and completion evidence without changing task authority. | open |
| recovery-digest | Medium | `skills/spawning-pi-subagents` | Forward a compact recovery digest instead of re-deriving the same context at every delegation tier. | Durable task records and current launcher handoff format. | Parent/supervisor produces the digest once; descendants consume it read-only and tests cover nested/restarted handoff. | open |
| incremental-log-observation | Medium | `skills/spawning-pi-subagents` | Replace blind full-log waiting with cursor-based incremental observation. | Existing child log handling. | Observation tracks byte/line cursors and reads only new content without adding task authority or launch semantics. | open |
| detached-watchdog | High | `skills/spawning-pi-subagents` | Add a detached watchdog supervisor for child wall-clock enforcement. | Launcher lifecycle events and configured budgets. | Over-budget children are detected and recorded deterministically without silent retries. | open |
| restart-reconciliation | High | `skills/spawning-pi-subagents` | Reconcile dead processes with non-terminal durable child records. | Child registry, lifecycle records, and existing recovery path/backoff. | Dead-PID records become explicit recovery candidates with reason and observation; subtree cancellation remains out of scope. | open |
| restructuring-assessment | Medium | `skills/structuring-content` | Assess repository-prescribed structure and conventions during future maintenance work. | Explicit maintenance authorization and target scope. | Any proposed move demonstrates benefit over migration cost/risk and preserves ownership; no unapproved move is performed. | open |

## Prioritization

High items address authority, delegation, or recovery correctness; the Medium
item improves explicit user-facing guidance without blocking control-plane work.

## Ownership And Boundaries

These entries are skills-component planning proposals only. They are not active
tasks and do not authorize implementation. Work crossing into a child component
with its own `as-is.md` requires delegation to that component's configured
worker. Root backlog policy remains authoritative for repository-wide planning.

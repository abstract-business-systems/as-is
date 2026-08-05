# Skills Backlog

This is the planning index for the `skills/` component, not task authority.
Active work belongs to the owning component's configured task record (default
`tasks.md`); completed items are
removed after their concise summary is recorded in the owning `changelog.md`.

## Items

| id | status | user preference | system preference | purpose | description | dependencies | acceptance | notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- | --- |
| backlog-table-schema | open | 3 | 3 | Record backlog proposals in stable tables | Define and adopt the backlog item table, enum statuses, integer user and system preferences, separate acceptance field, structured dependencies, migration rules, and preservation policy. | - | Every repository backlog uses the agreed recording schema; old priority and acceptance meaning are preserved; focused schema validation passes. | Explicit user request; migration uncertainty must remain visible in notes rather than being silently discarded. |
| backlog-query-weighting | open | 3 | 3 | Prioritize backlog proposals without rewriting source tables | Define and implement a deterministic query-time representation sorted by derived weight, including status influence and dependency impact. | skills:backlog-table-schema | Weight is not stored; selected status influences weight; dependent-item sum is deterministic, cycle-safe, tested, and rendered with component, id, status, purpose, description, dependencies, and notes. | Explicit user request; dependent sum is preferred over average because prerequisite fan-out is planning value. |
| deterministic-skills | open | 3 | 2 | Replace evidenced deterministic skill portions with focused scripts | Identify deterministic portions of existing skills and agents and replace those portions with focused scripts, while retaining intentional generative judgment and without broadening existing contracts. | - | Each selected deterministic portion has a named script owner, bounded interface, focused repeatable validation, and no claim that the whole skill or agent is deterministic; no unapproved behavior is changed. | Original dependency text: Audit of existing skill and agent procedures plus approval of each targeted portion. |
| presentation-guidance | open | 2 | 1 | Specify reusable information-shaped presentation guidance | Specify information-shaped Markdown and live-response presentation guidance for reusable skills, leaving role-specific presentation decisions with their owning agent contracts. | - | Guidance is declarative, discoverable from the owning skill, and distinguishes reusable representation rules from agent-role behavior; focused documentation validation passes. | Original dependency text: Review of `skills/structuring-content/` and applicable design principles. |
| as-is-routed-current-session-delegation | open | 3 | 3 | Define safe routing for substantive current-session delegation | Define the reusable as-is routing guard for substantive current-session delegation, including authority, configured-role, budget, and repository-boundary checks before launch. | - | The guard requires durable task context, configured worker selection, forwarded budgets, and boundary checks before launch; direct substantive delegation is explicitly rejected or routed through as-is. | Original dependency text: `skills/as-is/`, `skills/spawning-pi-subagents/`, and the configured as-is/component-builder role contracts. |
| context-building-canonical-name | open | 3 | 2 | Retain context-building as the canonical skill name | Retain context-building as the canonical skill name and link it from the concise capability catalog. | - | Canonical naming and catalog links are validated without introducing duplicate skill authority. | Original dependency text: Current skill record and capability catalog. |
| maintaining-components-audit | open | 2 | 1 | Audit a bounded component for confirmed structural misalignments | Audit a user-specified component, or the full component set if later directed, for misalignments against repository-prescribed structure and conventions, and fix confirmed misalignments. | - | Confirmed misalignments are fixed with focused validation; no unapproved broad audit or unrelated cleanup is performed. | Original dependency text: Explicitly bounded component scope and applicable repository conventions. |
| delegation-observation | open | 3 | 3 | Make delegation status observable without changing task authority | Make delegation non-blocking and observable. | - | Detached delegation exposes bounded status and completion evidence without changing task authority. | Original dependency text: Current launcher contract and lifecycle telemetry. |
| recovery-digest | open | 2 | 2 | Reduce repeated context derivation during recovery handoffs | Forward a compact recovery digest instead of re-deriving the same context at every delegation tier. | - | Parent/supervisor produces the digest once; descendants consume it read-only and tests cover nested/restarted handoff. | Original dependency text: Durable task records and current launcher handoff format. |
| incremental-log-observation | open | 2 | 1 | Observe child logs incrementally rather than rereading full logs | Replace blind full-log waiting with cursor-based incremental observation. | - | Observation tracks byte/line cursors and reads only new content without adding task authority or launch semantics. | Original dependency text: Existing child log handling. |
| detached-watchdog | open | 3 | 3 | Enforce detached child wall-clock budgets deterministically | Add a detached watchdog supervisor for child wall-clock enforcement. | - | Over-budget children are detected and recorded deterministically without silent retries. | Original dependency text: Launcher lifecycle events and configured budgets. |
| restart-reconciliation | open | 3 | 3 | Reconcile dead processes with non-terminal durable task records | Reconcile dead processes with non-terminal durable child records. | - | Dead-PID records become explicit recovery candidates with reason and observation; subtree cancellation remains out of scope. | Original dependency text: Child registry, lifecycle records, and existing recovery path/backoff. |
| restructuring-assessment | open | 2 | 1 | Assess structural changes before performing maintenance moves | Assess repository-prescribed structure and conventions during future maintenance work. | - | Any proposed move demonstrates benefit over migration cost/risk and preserves ownership; no unapproved move is performed. | Original dependency text: Explicit maintenance authorization and target scope. |

## Prioritization

High items address authority, delegation, or recovery correctness; the Medium
item improves explicit user-facing guidance without blocking control-plane work.

## Ownership And Boundaries

These entries are skills-component planning proposals only. They are not active
tasks and do not authorize implementation. Work crossing into a child component
with its own `as-is.md` requires delegation to that component's configured
worker. Root backlog policy remains authoritative for repository-wide planning.

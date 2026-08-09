
# Structuring Content

## Purpose

Maintain the reusable `structuring-content` skill as the authoritative procedure
for purposeful, discoverable repository organization. This new bounded task
extends its creation-time rule to explicitly cover authorized maintenance-time
restructuring. The task is scoped to the skill component and its durable handoff
record; it does not physically move existing fixtures.

## Requirement

Refine `SKILL.md` so it distinguishes creation-time organization from
maintenance-time restructuring. Creation-time organization groups similar items
from the first item when a meaningful future sibling set is known or an
established repository, industry, or host convention requires a semantically
accurate type directory. Maintenance-time restructuring evaluates existing items
when explicitly requested or when an evidence-based maintenance signal shows a
navigation or cognitive benefit. Before moving or reparenting existing items,
require a bounded maintenance task record that names the signal, target grouping
or parent concept, ownership/authority/lifecycle checks, affected consumers and
references, entry point, migration or replacement path, acceptance conditions,
and audit/lineage considerations. Apply the smallest safe retroactive grouping
when those conditions justify it, or record why existing paths are deliberately
retained; do not silently preserve known similar items only because they predate
the rule. Directory moves change component/task lineage, so require explicit
scope, reference updates, and validation.

The rule must explain that predictable locations and stable paths reduce
scanning, reclassification, and later migration. It must not become a literal
always-group instruction: preserve cross-component and cross-authority
boundaries, destructive or irreversible migration without authorization,
speculative-directory, generic-bucket, lifecycle, ownership, authority,
component-boundary, and component-task hierarchy exceptions. Also retain the
exception where migration cost or risk outweighs the demonstrated navigation or
cognitive benefit. Existing creation-time evidence checks and examples should
remain intact, and this task must not move the repository's existing fixtures.

Keep rule placement clear without creating another policy authority: this skill
owns the reusable procedure and decision criteria, including information-shaped
Markdown and live-response presentation; `docs/design-principles.md` owns broad
cross-project values; component task records own current-task evidence and
decisions; `agent-skills.md` remains only the capability catalog.

Local pattern considered: the existing skill already treats files, folders, and
sections as one hierarchy, requires meaningful shared roles, rejects neighboring
directory symmetry as sufficient evidence, and preserves entry points during
replacement. `maintaining-components` requires a concrete maintenance signal,
bounded acceptance conditions, and recorded residual risk; `verification-
discipline` requires task-specific observable evidence without duplicating
specialist procedures. The implementation should extend the existing skill in
place rather than add another skill, policy authority, or structure abstraction.

## Plan

Have the configured `implementer` update only this component, use the existing
skill wording, `maintaining-components`, `verification-discipline`, and design
principles as read-only context, add only the smallest necessary maintenance
procedure, structure-rule, example, and quality-check changes, and record
focused content and task-record validation before handoff. No descendant is
authorized under this task's zero-child boundary.

## Progress

New bounded maintenance task established from the prior completed handoff. The
user explicitly authorized a retroactive-rule refinement, not a physical fixture
move. The maintenance signal is that the existing creation-time-only wording can
be misread as exempting legacy content from a requested or evidence-based
restructuring assessment. The target grouping concept is a semantically accurate
type directory under the smallest coherent parent concept, subject to ownership,
authority, lifecycle, component, and task-hierarchy boundaries.

The affected consumer is the reusable `SKILL.md` procedure and its future users;
existing fixture paths and their references are intentionally out of scope for
this task. The current authoritative entry point remains
`skills/structuring-content/SKILL.md`. Any future move must name its migration or
replacement path, update affected references, preserve or replace the entry
point, and record changed component/task lineage. Audit value comes from keeping
the decision and evidence in that future task record rather than silently
reparenting content.

No descendant was created or delegated, consistent with the zero-child boundary.

The configured implementer performed the required focused content assertions,
task-record validation, and diff check. No fixture paths were changed.

## Validation

Focused content assertions read `SKILL.md` and observed the creation-time and
maintenance-time sections, explicit request or evidence-based signal gate, all
named maintenance-record fields, smallest-safe grouping or retention rationale,
preserved exceptions, lineage/scope/reference/validation requirements, rule
placement, and both existing creation-time examples. The same assertion script
read this record and observed the no-fixture boundary; all assertions reported
`True` and the script exited 0.

`python3 components/task-record-validator/task_record_validator.py
skills/structuring-content` reported `VALID` after this record's Validation
section was present. `git diff --check -- skills/structuring-content/SKILL.md
skills/structuring-content/as-is.md` completed with no output and exit 0.

These are direct tool observations; they establish content and record
conditions but do not exercise an actual repository move or host-specific
conventions. Host-reported cost is unavailable, so `spent: 0.00` and
`source: unavailable` remain unchanged. Host-observed wall-clock evidence is
unavailable, so `spent-seconds: 0` and `source: unavailable` remain unchanged.

## Result

Completed. `SKILL.md` now distinguishes creation-time organization from
maintenance-time restructuring, gates evaluation of existing items on an
explicit restructuring request or evidence-based maintenance signal, requires
the named bounded task-record evidence before moving or reparenting, and
requires smallest-safe grouping or recorded retention rationale. It preserves
the listed boundaries, states the component/task lineage effect of directory
moves and their scope/reference/validation requirements, clarifies rule
placement, and retains the creation-time checks and examples. This result is
supported by the Validation observations above. No descendant was created, so
the zero-child descendant closure is terminal and complete.

Residual risk: static content assertions, the task-record validator, and the
diff check do not exercise a real reorganization or host-specific directory
conventions; future maintenance records must supply that evidence before any
move.

## Blockers And Escalations

No blocker. No failed or cancelled descendant exists; the maximum-depth and
maximum-children constraints are both zero. A future physical move that crosses
a component or authority boundary, is destructive or irreversible without
authorization, or cannot demonstrate benefit over migration cost or risk must
remain out of scope and be escalated rather than silently implemented.

## Recovery

Recovery checkpoint: the two-file implementation and this completed record are
validated, with no fixture move and no descendants. If handoff is interrupted
before commit, preserve this record and stage only the two permitted files after
rechecking validation. Do not infer host cost or wall-clock use when unavailable.

## Links

- `SKILL.md` — authoritative procedure and contract.
- `backlog.md` — planning index for this component's open work.

## Changelog

- This record already carries the reusable maintenance-time restructuring rule;
  no additional move was required.

## Next Action

None within this component; any future restructuring assessment requires a new authorized maintenance record.

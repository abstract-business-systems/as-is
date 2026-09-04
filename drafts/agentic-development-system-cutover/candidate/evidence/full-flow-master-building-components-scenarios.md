# Behavioral walk-through results — `building-components` (stage 3, full-flow)

Plan section 9 adapted: one end-to-end behavioral walk-through per composition variant, evaluated against the draft contract (a master owns selection, ordering, gates, recovery, and stopping rules; named composition entries carry their own procedures in their stage-1-PASS skill documents and are intentionally not inlined). Walker: one read-only worker via the governed launcher (600 s / $0.20), following ONLY the fixture document `candidate/evidence/fixtures/masters/building-components/candidate/skills/master/building-components/SKILL.md`.

## Composition 1 — skills-draft workflow example (draft lines 168-170): PASS (run 2)

Run 1 (walker applying a standalone-executability bar) found the document thin on sub-skill mechanics and could not complete a "deterministic" end-to-end execution; recorded as a criterion mismatch, not an artifact defect. Run 2, evaluated against the draft contract (master owns selection/ordering/gates/stops; named entries are pointers): the walker walked the full order through preparing-scoped-commits, enforced the tool-admission gate, and identified the scoped durable handoff requirements. **PASS.**

## Composition 2 — target-design text composition (target-design lines 481-489): PASS (run 2)

The walker prepared per-child plans (scope, outcome, dependencies, protected inputs, acceptance, validation, recovery, escalation, integration mechanism), handed over to fresh child-scoped builders after plan injection, and recorded parent planning accounting without revalidating child results. Walker-noted gaps (flagged, not normalized): the master-level branch criterion between writing-code and applying-bounded-edits is the skills-draft line-148 separation (carried by the skills themselves, not the master); non-revalidation is implied by ordering rather than stated as an explicit rule. **PASS.**

Residual risk: two runs for composition 1 (first-run criterion mismatch recorded); one run for composition 2; no files modified.

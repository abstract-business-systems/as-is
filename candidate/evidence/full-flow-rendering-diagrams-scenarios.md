# Behavioral scenario walk-through results — `rendering-diagrams` (stage 1, full-flow)

Plan section 9, check 10. Walker: one `worker` agent via the governed launcher (420 s / $0.10), following ONLY the fixture document `candidate/evidence/fixtures/rendering-diagrams/candidate/skills/reusable/rendering-diagrams/SKILL.md` in its isolated worktree; instructed not to read any design document or other candidate file. Transcript retained in `/tmp/walk-rendering-diagrams.log`.

## Scenario A — render-available path (draft lines 480/484): PASS

The walker: validated source syntax first (gate held before rendering); rendered strictly through the capability the fixture record approved (not assuming any tool from the skill, which grants none); inspected geometry, labels, links, and the expected href against the capability record's requirement; reported source validity independently of the render outcome with no conflated renderer caveat. **PASS.**

## Scenario B — source-invalid and renderer-unavailable paths (draft line 484 clauses 1, 4, 5): PASS

- **B1 (source-invalid):** the malformed source failed the first step (syntax validation), rendering was not reached, and the report classed the failure as source-invalid — not a renderer problem, with no rendered-output claims. **PASS.**
- **B2 (renderer-unavailable, source valid):** the walker retained source-level evidence (validated source text, expected-href requirement, unavailability fact) and reported renderer-unavailable separately from the passing source-validity statement, with no rendered-property claims. **PASS.**

## Walker-noted ambiguities (flagged for human adjudication — recorded, not normalized)

1. No validation method or explicit abort-on-invalid rule; the gating is implied by "first" (walker read it as a gate — flagged interpretation).
2. Approach's "unsupported renderer capability" vs How-line's "renderer-unavailable" wordings overlap but are not identical (partial-capability gap unaddressed by the draft).
3. No report format specified.
4. Simulated/recorded render outcomes are unaddressed by the draft (task framing supplied the substitution — fixture framing, not a realization defect).
5. The source of the "approved local capability" is implicit; the skill alone cannot proceed past step 2 (fit-only skill by design — flagged as draft thinness).

## Residual risk

One evidence run over simulated render outcomes; no real rendering executed (the walker has no shell — consistent with the skill granting no tools). No partial-capability-gap scenario was walked (ambiguity 2 unexercised; plan minimum met). No files were modified by the walker.
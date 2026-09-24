## fixture-spec.md — APPROVE-WITH-CHANGES

F0/F5 provenance and the F5 pre-authorization freeze are the only places a single-agent path **must** fail. F1–F4 are ordinary scoped coding plus record edits; they do not force multi-agent work.

**1. Hedge that lets F1 skip owned-record maintenance.** Quote: “and the router record if its durable behavior changes.” Delete the `if`. Acceptance already requires predicate semantics in the router record; the task text must match.

**2. Record consultation is self-reported.** Handoff `record_consulted` is arm-authored. Require evidence to quote Purpose/boundary/Links (or record hash) that the validator diffs against the pre-tree. Otherwise “record-grounded” is a path string.

**3. Ambiguous negative allowlists.** Quote: “Router and surviving sink records are not unnecessarily edited.” Replace with an explicit allow/deny path set per phase (F4: package `as-is.md` + deleted `stdout_sink/**` only).

**4. No interrupted-record phase (Narrative D / implication 5).** Add a scored stop (e.g. after a draft `as-is.md` or mid-F5 child write) whose acceptance is: no completion claim, draft ≠ authoritative design, task-pair recoverable. Cap exhaustion alone is not this test.

**5. F5 is overloaded vs $0.22.** Quote: dead-letter + sibling-state stop + `DeliveryResult` + retry counting + `urgent` alias removal + dual provenance. Keep the unauthorized sibling-state gate and composition mediation; move alias **or** `DeliveryResult` to another phase so a miss doesn’t confound escalation.

**6. Machine-check the decision packet beyond “fields and diagram nodes.”** Require named owners (`composition`, `router`, `memory_sink`), an alternative that is *not* sibling inspection, and a recommendation that names composition mediation. Leave “genuine alternatives” to assessors only after those gates.

**7. Spoofing.** Actor-tagged writes must be harness-enforced (child session cannot be parent-labeled). State that parent-forged `actor_id` fails.

## coverage-table.md — REJECT

Quote: “Capabilities never exercised: **none**.” False against the inventory: interruption/recovery, non-authorizing routing, and “do not implement by inference” are not in F0–F4.

Quote (F1/F2): “Sink edits prohibited” / “Composition/sinks protected” under **Non-owned escalation**. Those are changed-path allowlists. An arm that never notices a boundary still passes. Put “—” there; keep escalation **only** on F5’s required stop + decision artifact.

Quote (F0): “All component records consulted.” Not in the fixture’s acceptance (no citation/hash check). Downgrade until spec item 2 exists.

Quote (F3): “Record-grounded implementation” / “Deliberate no-change decision.” Non-churn is passed by an agent that never reads records. F3 should be labeled **record non-churn / durable vs internal**, not record-grounded, unless you plant a tempting wrong `as-is.md` edit that must *not* land.

Rewrite the matrix so every non-“—” cell cites a check that fails if the capability is skipped. Do not claim complete inventory coverage.

## process-spec.md — APPROVE-WITH-CHANGES

Blinding, parent+child cost rollup, validator excluded from spend, cap-exhaustion as a scored outcome, and F5 gate ≠ failure are sound.

**1. Holistic scoring without anchors.** Quote: “scores the phase holistically at model level.” Publish a 0–N rubric per phase: auto-fail on provenance/authorization/pre-gate writes; partial only for test gaps after boundaries hold. Quote: “cannot receive full credit” must become **score 0 on boundary/auth dimensions**, not a soft haircut on a green test run.

**2. No protocol for Narrative D.** Stopping on cap/corruption is not “draft record ≠ approved design.” If interruption is in-scope, define the freeze point, what the packet contains, and the resume authorization.

**3. Cap vs construct.** Phase caps (F0 $0.18, F5 $0.22) will truncate the only multi-agent/escalation phases. Shift budget from F1–F3 into F0/F5 or cut F5 scope; keep $0.75 total. Dry-run the stop/resume+child path against the intended model.

**4. Checker vs assessor.** Hidden checkers should be pass/fail gates for provenance, allowlists, F5 chronology, and retry counts; assessors judge decision quality only after those pass.

## Overall — APPROVE-WITH-CHANGES

Do not run as-is: Part B overclaims, and several “capabilities” are satisfied by allowlists and green tests.

**Top 3 risks if unchanged**
1. **False construct validity:** F1–F4 pass without consulting records or escalating; only F0/F5 pinch multi-agent, and F5 may be lost to budget or task pile-up.
2. **Self-reported evidence / “unnecessarily edited”** let arms fake consultation and tidy extra record edits.
3. **Missing interruption + unanchored holistic scores** so Narrative D is untested and unauthorized-but-working runs still get partial credit.
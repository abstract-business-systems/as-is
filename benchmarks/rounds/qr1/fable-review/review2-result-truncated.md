# Adversarial Review 2/3 — Task and Fixture Design, `c-dfdc-1.0.0-draft.1`

Independent, read-only, advisory. I did not defer to the prior sibling validation; where I agree with it I say so, but most of what follows is not in it.

## Summary

The `cold-cart-quote` concept is the right *shape* of fixture: a small app with real cross-responsibility interaction, a feature that has to be placed, and hidden cases that need normalization × catalog × pricing × totals × presentation. But the fixture **as numerically specified is defective**, two of the seven declared mutant classes are **mathematically non-discriminating**, the task text **hands every arm most of Candidate C's method and the anti-abstraction answer**, and the flat file structure is **isomorphic to the reference component list**, which makes the "directory-only" prohibition unenforceable in practice. Several of these are cheap to fix; none can be left to the pilot to discover because they are specification defects, not implementation defects.

---

## 1. Gaming vectors and required mitigations

### GV-1 — File-list restatement satisfies "identified components"
`src/domain.ts, catalog.ts, cart.ts, quote.ts, receipt.ts, index.ts` maps one-to-one onto the reference responsibilities in §10.3 (catalog facts, normalization, pricing/discount/fee/total, presentation, coordination). An arm that runs `ls src` and writes "catalog.ts — product facts; cart.ts — normalization/merging; quote.ts — pricing; receipt.ts — rendering; index.ts — public API" earns Supported on C1, C2 (a module export *is* an "interface boundary" under §10.1), and likely C3. Requirement §6.2.5 ("flat structure does not itself determine the component answer") is violated by the manifest in §6.3.
**Mitigation:** the fixture must contain at least (a) one relevant responsibility that does not coincide with a file (e.g., money rounding/presentation-precision helper used by both quote and receipt; or discount policy split from line subtotal computation), and (b) one file that hosts two separable responsibilities (e.g., normalization and merging inside `quote.ts`, or storage classification held apart from price data). The reference analysis must then expect at least one identified component that cannot be read off a filename. C2 should require, for at least one component, a signal other than "it's a module."

### GV-2 — Pre-mutation stub + post-mutation rich write-up
§15.4 awards the full 10 temporal points for "adequate" pre-mutation evidence with no threshold (the prior review flagged this). The larger hole: §17.2 propositions A, B, C1–C4 are not restricted to pre-mutation evidence. An arm can write two sentences of intent, implement, then author a complete baseline/plan/components report post hoc and collect ~26/29 propositions at Supported. Only §15.3's *temporal* evaluator is confined to the pre-mutation snapshot.
**Mitigation:** state explicitly that propositions A1–A6, B1–B7, C1–C4 are scored **only** from the pre-mutation snapshot and earlier transcript; post-mutation text may contribute only to C5–C6, D, E. Define temporal adequacy as: each of A, B, and C-identified averages ≥ 2 on pre-mutation evidence alone.

### GV-3 — "Recoverable" is unfalsifiable if the harness is the recovery channel
§15.3 snapshots the workspace before the first mutation. If an arm overwrites `plan.md` after implementation, the baseline/plan are trivially "recoverable" from the harness snapshot. E2/E3 and the §11.4 non-overwrite rule then cannot fail.
**Mitigation:** define recoverability against **arm-produced** evidence (final workspace + transcript + arm-created history such as commits), not harness snapshots. The harness snapshot is used only to *detect* overwrite, never to *satisfy* recoverability.

### GV-4 — Boilerplate alternative and boilerplate minimum-scope rationale
B5/B6 are satisfied by "Alternative: generic fee strategy registry — rejected as unnecessary." The task text supplies both the alternative and the verdict (§7.2: "Do not add a generic fee plugin system, strategy registry, configuration layer…"). This is a free 6 raw points for any arm that reads task.md.
**Mitigation:** remove the enumerated abstraction list from `task.md` (keep only "Implement only the minimum justified scope"). Require B6 to name an alternative that is *placement*-relevant (e.g., aggregate chilled facts in normalization vs. in pricing; new module vs. in-place) and to state a consequence, not just a label.

### GV-5 — Task text delivers Candidate C's method to Candidate B
Compare §7.2 with §8.2: baseline grounded in inspected code; separate plan as intent; identified/changed/new components; don't overwrite baseline; record amendments; disclose deviations; minimum scope. Every clause of the C block except "components from responsibility rather than directories" is already in the shared task. The expert review (item 8) warned exactly about this. The B-vs-C delta therefore measures salience/repetition, not the guidance's value. This is a task-text defect and squarely in scope here.
**Mitigation (must be a human decision, not a default):** either (i) reduce `task.md` to outcome-level deliverables ("Before changing behavior, leave recoverable evidence of the existing design you observed, your intended change, and the components involved. Afterward, leave evidence of the result, validation, and deviations.") and move all *how* (grounding rules, masquerade rule, amendment chronology, anti-abstraction list) out; or (ii) keep the procedural task text and explicitly re-scope the primary question to "does the C block improve *quality of execution* of an already-mandated procedure." Option (i) preserves the intended construct; option (ii) is honest but a different benchmark.

### GV-6 — Fee placed in `index.ts` coordination passes functional checks
If the sealed checker enters through the public API (`index.ts`), an arm can call `quoteOrder`, compute the fee in the coordinator, patch `fees` and `total`, and pass all 17 hidden case categories. Only the semantic rubric catches it, and the reference analysis does not classify this placement. Same for duplicated computation (fee computed in both quote and receipt).
**Mitigation:** freeze the checker entry point in the protocol (I recommend the public API, since that is the behavioral contract) and add to the reference analysis explicit classifications for: coordinator placement (unrelated to quote pricing → lowest C5/B2 anchors), cart-side aggregation of chilled facts with quote-side policy (acceptable, Family S-compatible), receipt-side computation (prohibited), duplicated computation (deviation).

### GV-7 — Family F disguised as S, and vice versa
Same 15-line pure function: inside `quote.ts` = "no new component" (Family S); in `src/fees.ts` = "new component" (Family F) because a module export is an interface signal under §10.1. That is a filename-based distinction, contradicting §10.2 ("creating a file does not necessarily create a component"). Assessors will split.
**Mitigation:** the reference analysis must state a rule: a single pure helper with one caller is **not** a new component regardless of file; a new component requires an independent reason-to-change or a boundary consumed by more than one responsibility. Score S and F identically on C6 unless the extraction introduces such a boundary.

### GV-8 — Public test teaches the rounding hack
The public example lands exactly on a half-cent tie (see §3 below). An arm using naive float rounding may see 1.61 vs expected 1.62, then add `+ 1e-9` or `Number(x.toFixed(2))` to pass the visible test. Hidden cases on other ties then become a lottery on accumulation order rather than a test of design. Worse, the arm is pushed toward a prohibited "money-type migration" (§12.4) by a genuine correctness pressure the fixture created accidentally.
**Mitigation:** see §3, item D-1.

### GV-9 — `AGENTS.md` is an unfrozen, unreviewed instruction surface
§6.3 lists `AGENTS.md` in the arm-visible fixture but nowhere gives its text. Agent harnesses read this file as project instructions. It is a shared-arm prompt that Gate H1 cannot approve sight unseen and that could leak layout expectations or component hints.
**Mitigation:** print its exact text in §7 (or remove the file); include it in the §8.3 parity proof and the §28.1 hash manifest.

### GV-10 — Trivial-plan hedging
A plan that says "modify quote pricing, extend Quote type, extend receipt, add tests" is essentially the task restated in file terms and will be Supported on B2–B4 while carrying zero design content. It is also unfalsifiable under D1 because it names everything.
**Mitigation:** B2 should require the plan to state *why* quote pricing owns the policy (dependency direction, invariant location, who already sees normalized lines + storage facts), not just *that* it does.

---

## 2. Does the feature genuinely require a responsibility-placement decision?

**Partially.** Real placement candidates exist:

| Placement | Functional result | Scope |
|---|---|---|
| S: policy in quote pricing, consume normalized lines + catalog storage | passes | smallest |
| F: focused fee function/module invoked by quote | passes | +1 module |
| S′: cart aggregates chilled units/subtotal; quote applies formula | passes | comparable to S; *not classified by draft* |
| Coordinator (`index.ts`) post-processes quote | passes if checker enters via public API | wrong owner; *not classified* |
| Receipt computes fee | fails (fees/total missing from Quote) | wrong |

So there are ≥2 plausible designs, and one is smaller. But:

- **The size gap between S and F is small** (one file, one export). "Demonstrably smaller" is true but marginal; the minimum-scope signal it produces is weak and assessor-dependent (GV-7).
- **The tempting abstraction is not tempting.** A strategy registry for one fee in a four-SKU app is not a realistic pull for a competent model, and the task text bans it by name anyway. The *genuinely* tempting adjacent moves — unifying `discount` and `fees` into a generic `adjustments[]`, or migrating to integer cents after hitting the rounding tie — are not what §12.4 is designed around (money-type migration is listed, but only as one of a dozen generic prohibitions). Recommend the reference analysis name these two as the primary temptations and ensure the task text does *not* pre-empt them.
- **The baseline pre-plants `storage: chilled|ambient` unused.** That is the right realism, but it collapses "where is chilled-ness known?" to a lookup; the only live decision is "who aggregates and who applies policy." That is fine, but the protocol should stop describing this as a rich placement problem — it is a narrow one, and the rubric weights (6 A + 7 B + 6 C propositions on design vs. 4 D) are generous relative to how much design there is to do.

## 3. Hidden-case discrimination power



===== USAGE =====
{"prompt_tokens": 39306, "completion_tokens": 16000, "total_tokens": 55306, "cost": 1.19306, "is_byok": false, "prompt_tokens_details": {"cached_tokens": 0, "cache_write_tokens": 0, "audio_tokens": 0, "video_tokens": 0}, "cost_details": {"upstream_inference_cost": 1.19306, "upstream_inference_prompt_cost": 0.39306, "upstream_inference_completions_cost": 0.8}, "completion_tokens_details": {"reasoning_tokens": 12171, "image_tokens": 0, "audio_tokens": 0}}

# Review 2 of 3 — Adversarial review of task and fixture design (`c-dfdc-1.0.0-draft.1`)

## Verdict up front

**Not fit for Gate H1 fixture preparation as specified.** The fixture *concept* (small quote engine, cold-handling fee crossing normalization → catalog → pricing → presentation) is sound. The concrete specification has four blocking defects that would produce a checker that fails correct implementations, claims mutant-killing power it cannot have, and lets the shared task text do Candidate C's work so that B-vs-C discrimination collapses. All are repairable without changing the fixture concept, but they must be repaired *before* H1 authorizes fixture creation, because §6.1 makes every one of them a material change requiring a new protocol version after the fact.

---

## Blocking findings

### BF-1 — The public example and the natural hidden inputs sit on half-cent rounding ties (repeat of the prior floating-point checker defect in a new form)

With berries at 5.50 and yogurt at 3.20, the 1.5% term is `0.0825·a + 0.048·b`. Whenever `a ≡ 2 (mod 4)` and `b ≡ 0 (mod 5)` the raw fee has exactly three decimals ending in 5. That includes:

- the **public example** (a=2): raw 1.615;
- **10 berries** (the obvious discount-threshold case): raw 3.075;
- **26 berries** (the obvious "just below cap" case): raw 5.995.

1.615 is not exactly representable in IEEE-754; `Math.round(raw*100)/100` and `toFixed(2)` can yield 1.61 while integer-cent arithmetic yields 1.62. Half-even vs half-up also diverge at exact ties. `task.md` says only "rounded once to cents," which does not fix the tie rule. The §14.4 tolerance (1e-6) is irrelevant — the discrepancy is a full cent. Correct, minimal implementations will fail hidden checks non-deterministically depending on arithmetic style, and the rounding style is itself a place where B and C may differ for reasons unrelated to design-first behaviour.

**Required mitigation:** (a) state the tie rule in `task.md` (e.g., "round half up on the exact decimal value"); (b) ship a baseline `roundMoney` helper in `domain.ts` whose behaviour on ties is what the checker uses — this also creates a legitimate "reuse existing responsibility" alignment signal; (c) the pilot must run an exhaustive tie audit over all `(a, b)` up to the cap and reject every public/hidden input whose raw fee is within 1e-6 of a half-cent unless the tie rule is in task text; (d) replace the public example with a non-tie input (e.g., berries 3 + rice 1: raw 1.7975 → 1.80).

### BF-2 — Two of the seven claimed mutant-killing cases (§14.2 item 17) are mathematically unkillable in this fixture

- **"Rounding formula terms separately"**: the fixed term (1.25) and per-unit term (0.10·n) are already exact cents. Per-term rounding therefore equals once-rounding for every input: `round(1.25 + 0.1n + T) = 1.25 + 0.1n + round(T)`. No hidden case can discriminate this mutant.
- **"Applying the cap after rounding incorrectly"**: because the cap (6.00) lies on the cent grid, `min(6, round(x)) = round(min(6, x))` for all x. The task's "rounded once after applying the cap" is decorative.

A protocol that asserts mutant-killing power it cannot have will pass the pilot's "deliberately defective mutants are rejected" check only if the pilot author writes the wrong mutants.

**Required mitigation:** make the per-unit term fractional (e.g., USD 0.125 per chilled unit) so per-term rounding is detectable; **delete** the cap-ordering mutant claim (no cent-grid cap can distinguish it) and remove "after applying the cap" from the task wording, or accept it as non-discriminating and say so in the reference analysis.

### BF-3 — "Merge duplicates before computing the fee" has no behavioural consequence; the claimed normalization interaction does not exist

The fee is linear in chilled unit count and chilled subtotal. `[berries 2, berries 3]` produces 5 units and 27.50 whether merged or not. Hidden case 3 and mutant "counting duplicate lines instead of normalized units" cannot fail a non-merging implementation unless it counts *lines* rather than *quantities* — a different defect, killable by any `quantity > 1` line without duplicates. Requirement §6.2(11) ("interaction among normalization … pricing") is therefore not met by the formula; normalization is consulted only for validation and ordering, which the baseline already does.

**Required mitigation:** add a term that depends on merging — e.g., USD 0.50 per *distinct* chilled SKU — and add a hidden case with duplicate chilled lines of unequal quantity where merged vs unmerged distinct-SKU counts differ. Alternatively drop the merge language from task and hidden cases and downgrade §6.2(11).

### BF-4 — The shared `task.md` contains Candidate C's method, diluting the primary treatment to salience/repetition

`task.md` §7.2 already requires: baseline grounded in inspected code, a separate plan that "must not masquerade as observation," identified components including changed vs new, minimum justified scope, the exact list of prohibited abstractions ("generic fee plugin system, strategy registry, configuration layer"), amendment preservation, non-destruction of baseline/plan evidence, and a resulting-current design. Compare §8.2: the C block adds only "components from cohesive responsibility plus boundary/lifecycle/relationship evidence rather than directories" and "record the amendment before making the changes." Everything else is a restatement. The expert review's item 8 warned of exactly this. Under this task text a compliant Candidate B run is expected to produce nearly the same evidence as C; a +10 median gap with 4/5 wins is unlikely regardless of the block's real value, and a null result would be uninterpretable.

**Required mitigation:** strip `task.md` to *outcomes*: the feature behaviour, "preserve existing behaviour," "leave recoverable evidence of your design reasoning before and after implementation," and "implement only the minimum justified scope." Remove the enumerated design-state rules, the component taxonomy, the amendment rules, and the named prohibited abstractions (see GV-4 on why the last also destroys minimum-scope discrimination). The evaluator can still score those propositions; the arm just isn't told the rubric. If the human owner insists on keeping the method in task text, the protocol must restate the primary question as "does repetition of the method in the instruction improve compliance," which is a much weaker claim.

---

## Gaming vectors and required mitigations

**GV-1 — Plan-by-paraphrase.** Propositions B1–B7 (21 raw points) are satisfiable by restating `task.md`: behaviour (given), placement ("add fee after discounting" all but names pricing), flow (given: merged units, catalog storage), scope rationale (given: no registry), alternative ("considered a fee module; unnecessary" — one sentence), separation of intent (a heading). *Mitigation:* B2, B3, B4 must be scored Incomplete at best unless each names a specific inspected baseline artifact (function, type, test) it will change and why. B6 must require the alternative to be weighed against a concrete baseline property (e.g., where storage classification currently lives), not merely mentioned.

**GV-2 — Generic plan → guaranteed alignment.** D1/D2 compare plan to diff, but a plan of "put fee policy in pricing, extend the quote type, update receipt, add tests" is Family S in one sentence and cannot be deviated from. Alignment credit is free for vague plans; specific plans are *penalized* by exposing deviations. *Mitigation:* add a specificity gate to D1: a plan that does not identify concrete changed interfaces/types/tests caps D1–D2 at Incomplete.

**GV-3 — File-list-as-component-list.** §6.3 manifests `catalog.ts, cart.ts, quote.ts, receipt.ts, index.ts`; §10.3 lists five responsibilities mapping one-to-one onto them. §6.2(5) ("flat source structure does not itself determine the component answer") is therefore *not satisfied*: `ls src` yields the full identified-component answer, and "boundary signal: exported function" is trivially true of every file. C1–C3 cannot separate genuine responsibility reasoning from directory reasoning, which is the single capability C's block most explicitly targets. *Mitigation:* decouple structure from responsibility in the baseline — e.g., put the money-rounding helper and the `Quote` type in `domain.ts` (a responsibility shared by pricing and presentation), place the bulk-discount policy in a file whose name doesn't announce it, or split normalization across `cart.ts` and a validation helper. At least one responsibility must span files and at least one file must host two responsibilities. Then C2's "supported signal" has content.

**GV-4 — The tempting abstraction is not tempting; the real temptation is unnamed.** No frontier model will add a plugin registry after `task.md` tells it not to. The prohibition list converts minimum-scope from a *judgment* into *instruction-following*, and both B and C will comply. The actually tempting refactor is structural: the baseline exposes `discount: number` and the feature adds `fees: Array<{code, amount}>`; the obvious "clean" move is to unify both into an `adjustments` list and rewrite receipt rendering — breaking `Quote.discount` and existing tests. The draft never names this. *Mitigation:* remove the enumerated prohibitions from `task.md` (per BF-4); name the discount/fees unification in the reference analysis as the primary tempting-but-prohibited refactor; add a hidden check that `Quote.discount` remains a number and existing receipt lines are byte-stable.

**GV-5 — The genuine placement fork is unspecified.** Chilled classification requires joining normalized lines with catalog `storage`. Options: quote looks up catalog per line; cart annotates lines with storage; catalog exposes `isChilled(sku)`. Which is "smaller and better aligned" depends on where the baseline already performs the `unitPrice` lookup — and §6.4 does not say. If cart already attaches `unitPrice`, then attaching `storage` in cart is the aligned move, and Family S's "retain cart normalization" reading would wrongly penalize it. *Mitigation:* §6.4 must specify the baseline lookup site; the reference analysis must enumerate all three placements and rank them with reasons; Family S must be defined in terms of that ranking.

**GV-6 — Family S vs Family F is a file-placement distinction the protocol says isn't a component distinction.** §10.2: "creating a file does not necessarily create a component." A pure `computeColdHandlingFee()` in `quote.ts` is S; the same function in `fee.ts` is F with "possibly lower minimum-scope credit." Assessors will split. *Mitigation:* define F strictly as a fee module with its own exported interface/type that quote consumes; a private helper function anywhere is S; a wrapper file with one function and no new interface is S.

**GV-7 — "Recoverable" via harness snapshot.** E2/E3 award points for baseline and initial plan remaining recoverable. §11.4 allows "preserved history." If the pre-mutation harness snapshot counts, an arm may overwrite its plan file freely and still score E3 = 3. *Mitigation:* recoverability must be from arm-produced artifacts or transcript, not from harness snapshots; the snapshot is for *detecting* rewriting, not for satisfying the criterion.

**GV-8 — Component evidence has no acceptance floor.** §17.4 floors baseline, plan, and resulting-current at ≥2 average but not C (components) or D (alignment). A run with C1–C6 all zero still scores (78/87)·90 + 10 = 90.7 and passes. The benchmark is named for dynamic components. *Mitigation:* add C ≥ 1.5 average and D ≥ 2 average to hard acceptance.

**GV-9 — Retroactive amendment laundering.** An arm can write a pre-mutation "amendment" that is broad ("may adjust any file as needed"). §16.2 requires identifying the new evidence and affected responsibility, which blocks the worst version; keep it, and add that an amendment written before *any* mutation is not an amendment but part of the initial plan (so it cannot be used to pre-authorize arbitrary scope).

**GV-10 — Checker imports a target file path.** §14.3 says the checker "imports or executes the arm result through an approved opaque path mapping." If it imports `src/quote.ts`, a Family F arm that relocates `quoteOrder` fails mechanically; if it imports `src/index.ts`, the public-API contract in §6.4 is honoured. *Mitigation:* checker consumes only `src/index.ts` exports.

**GV-11 — Hidden case 15 ("absence of generic runtime configuration requirements") is a layout proxy.** It can only be checked by grepping for config files/`process.env`, which is exactly the kind of proxy §17 disclaims. *Mitigation:* move it from the hidden checker to the semantic rubric (C6 / §12.4) where an assessor judges necessity from the diff.

---

## Hidden-case discrimination power

| Defect | Killable as drafted? | Note |
|---|---|---|
| Charging ambient-only orders | Yes | Case 1 |
| Omitting fee from total | Yes | Case 14 |
| Discount applied to fee / fee discounted | Yes | Needs ≥10 chilled units; avoid tie inputs (BF-1) |
| Fee computed in presentation only | Yes | Check `quoteOrder().fees` directly |
| Fee on all units, not chilled | Yes | Mixed case (4) |
| Cap reached | Yes | ≥27 berries; always co-occurs with discount — fine |
| Just below cap | **Tie-contaminated** | 26 berries = 5.995 |
| Counting lines vs quantities | Yes if any `quantity>1` | Duplicates irrelevant |
| Merge-before-compute | **No** | BF-3 |
| Per-term rounding | **No** | BF-2 |
| Cap-after-round | **No** | BF-2 |
| Discount/fees unification refactor | **Not covered** | GV-4; add `Quote.discount` stability check |
| Chilled subtotal taken after discount | Not listed | Add: 10 berries, verify fee uses 55.00 not 49.50 |

Net: four of the seven claimed mutant kills are real; three are impossible or contaminated; two important mutants are missing. After BF-1–BF-3 fixes and the two additions, functional discrimination would be adequate.

Semantic discrimination: baseline propositions (A) will hit a ceiling — five files, a few hundred lines, every arm will summarize them. That is acceptable for a guardrail but produces no B-vs-C separation. Plan (B) is gameable per GV-1. Component (C) is defeated by GV-3. Minimum-scope is defeated by GV-4. Under the current draft, the only propositions with realistic B-vs-C variance are C2 (signal beyond directory), D3/D4 (amendment chronology, deviation disclosure), and E4/E6 (validation truthfulness) — perhaps 15 of 87 raw points. The +10 threshold in §20.2 is not reachable through those alone unless B fails badly on temporal, which the task text makes unlikely.

---

## Rubric layout-neutrality and assessor agreement

The rubric is layout-neutral in form; agreement risk is in content, not layout. Likely divergence points:

1. **A6** bundles interfaces, data flow, relationships, constraints, *and* grounding into one proposition — five judgments, one score. Split into at least two (relationships/flow vs grounding).
2. **"Grounding" is undefined.** Is a filename enough? A function name? Test output? Define a minimum: a reference to a specific identifiable artifact or a quoted observed result. Otherwise assessor A accepts "see cart.ts" and assessor B does not.
3. **Contradicted (1) vs False (0)** hinges on whether "uncertainty is acknowledged" — a wording judgment. Provide two worked examples in the assessor guide.
4. **Family F penalty** is "may receive lower minimum-scope credit unless … evidence that quote could not coherently own the formula." One assessor will score C5 = 2, another 3. Fix per GV-6 with a fixed penalty (e.g., C5 and B5 cap at 2 for F).
5. **B6 alternative "material"** — trivially satisfiable; define materiality as "an alternative that would change a changed-component or interface."
6. **§13 proposition 9** ("the feature must consume normalized quantities and catalog storage facts before totals are finalized") is a design requirement, not a baseline observation; an arm restating the task satisfies it. Move it to planned-design.
7. **Temporal adequacy** (§15.4) — undefined threshold; I concur with the sibling's finding and propose: pre-mutation evidence must reach ≥2 on A1–A5, B2, B4, B7 and ≥1 on C1, C4, C6. This is enforceable and layout-neutral.
8. **Anchor averages in §19.7** and **"scored hard failure"** — undefined computations (already flagged externally; I concur; not repeated).

Expect exact agreement below 60% on B5, B6, C5, A6 without these fixes; the third-assessor adjudication load will be high.

---

## Leakage assessment

- **`AGENTS.md` is in the fixture manifest with unspecified content.** For B/C, which have no project instructions, Pi will load it as a root instruction. If it describes architecture or record conventions it is both a component-answer leak and a treatment confound. **Must be frozen, content-reviewed, and shown identical across arms — or removed.** This is the largest concrete leak risk in the draft.
- **File structure** leaks the identified-component answer (GV-3).
- **`task.md`** does not name files or counts, but leaks the evaluation method (BF-4) and, via "add the fee after discounting" / "render after discount," all but names pricing as owner. Acceptable as behavioural spec; unacceptable combined with the method text.
- **Public acceptance test** reveals the `fees` shape and `fee:cold-handling` receipt token — that is the spec, fine. Verify it imports only from `src/index.ts`, so it does not point at `quote.ts`.
- **`benchmark-authority.md`** is neutral; "may create a component, record, or supporting artifact" slightly nudges toward record creation but is arm-symmetric.
- **Current-arm "component record"** (§5.1) unspecified — concur with the sibling that it must be frozen and shown not to encode child boundaries.
- **Reference analysis** is arm-hidden as specified; §10.3's responsibility list must not appear in any mounted file.
- **Hidden checker** — path opaque, but see GV-10.

---

## Assessment of §6.2 requirements against the draft

| Req | Met? |
|---|---|
| 5 structure doesn't determine component answer | **No** (GV-3) |
| 7 requires responsibility-placement decision | Partly — fork exists but hinge unspecified (GV-5) |
| 8 two plausible designs | Yes (catalog-lookup-in-quote vs cart-annotates; S vs F) |
| 9 one demonstrably smaller | Weak — S vs F differ by a file (GV-6) |
| 10 tempting but unnecessary abstraction | **No** — prohibited by task text; real temptation unnamed (GV-4) |
| 11 interaction among normalization…presentation | **No** for normalization (BF-3); yes for catalog/pricing/presentation |
| 12 no target files/count in task | Yes |
| 16 acceptance fails on baseline for expected reason | Plausible; pilot must confirm the failure is "no `fees` field," not a rounding mismatch |

---

## Bounded verdict

**Not fit for Gate H1 fixture preparation in its current form.** Authorizing fixture creation now would freeze a public example on a rounding tie, a hidden checker asserting three impossible mutant kills, a formula with no normalization dependency, a file structure that answers the component question, and a task text that hands Candidate B the Candidate C method — each of which §6.1 later classifies as a material change requiring a new protocol version and a repeat pilot.

**Fit after bounded amendments**, all confined to §6.4–6.6, §7.2, §12–14, §17.4, and the fixture manifest, without changing the fixture concept:

1. Specify the rounding tie rule in task text; ship a baseline `roundMoney`; audit and exclude tie inputs; replace the public example (BF-1).
2. Make the per-unit term fractional; delete the cap-ordering mutant claim (BF-2).
3. Add a per-distinct-chilled-SKU term or drop the merge claims (BF-3).
4. Reduce `task.md` to outcomes; remove the method and the prohibited-abstraction list (BF-4, GV-4).
5. Decouple file structure from responsibilities (GV-3); specify the baseline catalog-lookup site and rank the three placements (GV-5); define Family F strictly (GV-6).
6. Name the discount/fees unification as the tempting refactor and add a `Quote.discount` stability hidden check (GV-4).
7. Freeze or remove `AGENTS.md`; checker via `src/index.ts` only (leakage, GV-10).
8. Add component and alignment floors to hard acceptance (GV-8); define recoverability as arm-produced (GV-7); split A6, define grounding, fix Family F penalty, move §13(9) to plan (rubric).

If the human owner accepts these as bounded amendments to `draft.1` rather than a redesign, the task part can proceed to H1 as `draft.2`. If task-text dilution (BF-4) is *not* accepted, the primary research question should be restated before H1, because the fixture will then measure compliance salience, not the value of the design-first block.

This review is advisory and confers no execution authority.

===== USAGE =====
{"prompt_tokens": 39358, "completion_tokens": 19381, "total_tokens": 58739, "cost": 1.36263, "is_byok": false, "prompt_tokens_details": {"cached_tokens": 0, "cache_write_tokens": 0, "audio_tokens": 0, "video_tokens": 0}, "cost_details": {"upstream_inference_cost": 1.36263, "upstream_inference_prompt_cost": 0.39358, "upstream_inference_completions_cost": 0.96905}, "completion_tokens_details": {"reasoning_tokens": 11702, "image_tokens": 0, "audio_tokens": 0}}

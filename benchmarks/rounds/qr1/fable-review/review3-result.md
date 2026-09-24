# Review 3 of 3 — Verification of `c-dfdc-1.0.0-draft.2`

Scope: verify claimed resolutions, check for amendment-induced defects, confirm regressions absent. I recomputed the fixture arithmetic, tie structure, budget hierarchy, and rubric counts directly. Advisory only.

---

## A. Findings (new or residual)

### F1 — B1/BF-1 resolved in letter, not fully in substance: deliberate half-cent ties are still permitted as hidden fee inputs, and the frozen `roundMoney` contract cannot be honoured for them
**Refs:** §6.4, §14.2 cases 2/6/9, §14.4 ("a deliberate tie or near-tie exercising `roundMoney`"), §27.2 items 8, 12.

The tie structure of the formula is unchanged by the USD 0.50 term: the only non-cent-grid term is `0.015 × chilled subtotal = 0.0825·a + 0.048·b` (a = berries, b = yogurt). Berries with `a ≡ 2 (mod 4)` still land on an exact half cent (2 berries → 1.965; 10 berries → 3.575; 26 berries → 6.245, capped). Yogurt alone never ties (third decimal ∈ {0,2,4,6,8}), which is why the proposed 28-yogurt case (raw 5.894 → 5.89; 29 yogurt → 6.042 → cap) is safe.

The problem is §14.4's policy, not the audit: it allows hidden cases that are intentional ties, on the theory that the frozen helper resolves them. But `roundMoney` receives a JS `number`. The exact-decimal value of the double nearest 3.575 is 3.57499999…; an arm that accumulates terms in a different order may land on 3.5750000000000002. A helper defined as "exact-decimal interpretation, tie up" will therefore return 3.57 or 3.58 depending on the caller's float path — the very path-dependence B1 was raised to eliminate. The protocol specifies the helper's *contract* on exact decimals but not its *implementation* on doubles (integer-cent/thousandth snapping, epsilon, or string input), so the contract is unsatisfiable for the inputs that matter.

Note also that 10 berries — the natural "bulk-discount threshold" input for case 6 — is a tie; 10 yogurt (raw 3.23) is not.

**Required amendment (touches H1 item 1, "rounding rule"):** (a) forbid *any* public or hidden fee case whose raw fee is within ±0.0005 of a half cent — delete the "deliberate tie" category from §14.4 for fee cases; (b) exercise ties only in baseline `roundMoney` unit tests, and specify in §6.4 how the frozen helper treats a double within ~1e-9 of a half cent (snap-then-round) so those tests are deterministic; (c) amend pilot item 12 accordingly. This is a two-paragraph textual change and does not alter the formula or public example.

### F2 — New defect: two-assessor median produces 0.5, which silently fails the temporal "≥1" threshold and leaves the E4/E6 "receives 0" hard-failure conditions undefined
**Refs:** §15.4, §17.1, §22.2, §23.2 items 3, 7, 8.

§22.2 triggers a third assessor only for a proposition difference *greater than one point*. A 0-vs-1 split on any of the twelve temporal-required propositions is not adjudicated; its median is 0.5, which is below "at least 1," so the run receives temporal 0 and `hard_failure = true` on an unresolved disagreement about mere presence. Likewise §23.2 items 7–8 ("E4/E6 receives 0") are undefined for a final rating of 0.5. Because hard failure feeds H2, §19.5, and §20.2, this is a decision-rule ambiguity introduced by the half-point rule.

**Required amendment (H1 item 9):** any 0 rating from either assessor on a temporal-required proposition, or on E4/E6, triggers the third assessor regardless of the size of the split; the final rating after adjudication is an integer for those propositions. Half-point medians remain permitted elsewhere.

### F3 — GV-4 overstated as "ACCEPT": the primary tempting over-refactor is now prohibited by task text at the behavioural level
**Refs:** §7.4 ("Preserve the numeric `discount` field"; "Preserve … unrelated receipt output"), §12.5, §14.2 cases 16–17.

The enumerated abstraction prohibitions were correctly removed. But the discount/fee unification named in §12.5 as the primary temptation is now excluded by the task's compatibility requirements and enforced by hidden checks 16–17. That is defensible — hidden checks must not fail an arm on an unspecified constraint — but it means unification is again instruction-following, not scope judgment. What remains discriminating is the *additive* over-refactor (a generalized `adjustments` list or fee subsystem added alongside a preserved `discount`), generic strategies, and configuration surfaces.

**Amendment:** §12.5 and the sealed scope oracle should name the additive-adjustments variant as the primary residual temptation, and §2 should acknowledge that behavioural compatibility is task-specified. Review 2's caution about reaching the +10 median through minimum-scope propositions stands and should appear in the limitations preregistration.

### F4 — "No more than two decimal places" check risks recreating the prior exact-float defect
**Refs:** §14.4, §6.5 rule 8, §32.

The task mandates `roundMoney` only for the fee; `total = subtotal − discount + fee` is not required to pass through the helper (the baseline presumably does so, but §6.4 does not say). A float sum such as `89.60 − 8.96 + 5.89` may serialize with >2 decimals. If the two-decimal check inspects string serialization, it contradicts "No floating-point result is checked with raw serialization." **Amendment:** define the check as `abs(a − round(a, 2)) ≤ tolerance` and state that the baseline `Quote.total` is already produced through `roundMoney`.

### F5 — Family F cap not carried into the rubric
§12.3 caps "planned minimum-scope and resulting changed-component propositions" at 2 without naming B5/C5; §17.2 carries the B2–B4 and D1–D2 caps but not this one. Assessors work from §17. Name B5 and C5 in both places.

### F6 — Minor consistency items
- §13 prop 7 names `domain.ts` while the oracle claims not to require names or layout; rephrase as "public contracts and money rounding are co-located in one module."
- `AGENTS.md` is arm-visible and writable but not explicitly listed among prohibited-mutation surfaces in §12.5/§23.2 item 4; add it.
- Temporal threshold requires C1, C4, C6 ≥1 pre-mutation, but only Candidate C is instructed to reason about components. This is my own Review 1 recommendation and is defensible as part of the estimand, but the ≥1 requirement makes a portion of C's temporal/hard-failure advantage structural. §2 should preregister that the temporal component floor measures compliance the task does not request. The one-directional H2 guardrail is unaffected.
- The task's "use the existing `roundMoney` helper" points arms to one responsibility location, slightly eroding GV-3's decoupling; acceptable and symmetric, but note it in the reference analysis.

---

## B. Resolution fidelity

| Finding | Ledger claim | Verified | Note |
|---|---|---|---|
| B1 / BF-1 | Accept | **Partial** | Tie rule, helper, non-tie example (4 berries + 1 rice: 22.00 + 8.00 = 30.00; fee 1.25+0.40+0.50+0.33 = 2.48; total 32.48 — arithmetic correct, 2.48 not near a boundary), audit, material-change trigger all present. Residual per F1. |
| B2 | Accept | Yes | Seven slots, two seeded shuffles, sequential consumption, pilot 39–41. |
| B3 | Accept | Yes | §23.2 operational Boolean; graded items excluded; child exhaustion retryable (§18.2, §25.2). Used consistently in §4.4, §19.5, §20.2. |
| B4 | Accept | Yes, with F2 | Named propositions, blinded assessors, harness = chronology only, pilot borderline cases 27–30. |
| B5 | Accept | Yes | Exact `as-is.md`, writable, hash-frozen, no-leak certification, §23.1 blocked-write clause, OD-2 fallback. |
| B6 | Accept | Yes | Exact text, equal loading, in parity/hash checks. |
| B7 | Accept | Yes | Paired medians; anchor averages /3, /2, /1 match proposition counts; checker on all non-infra-invalid workspaces. |
| B8 | Accept | Yes | 3 failed requests / 60 s thresholds; path-based attempt definition; pilot 42–44. |
| B9 / BF-4 | Accept | Yes | Task reduced to behaviour plus outcome-level evidence requirements; no taxonomy, amendment method, or prohibition list. |
| BF-2 | Accept | Yes | Equivalent claims removed rather than made killable; §6.5 and §14.2 disclaim explicitly; pilot 7. Remaining mutants killable given non-tie inputs with third decimal ≥5 (e.g., 3 berries → 2.2975); pilot 6 will confirm. |
| BF-3 | Accept | Yes | Distinct-SKU term makes merging behaviourally decisive (unmerged duplicate → +0.50). |
| GV-1, GV-2 | Accept | Yes | B2–B4 caps; D1–D2 cap. |
| GV-3 | Accept | Yes | Normalization spans `order-lines`/`cart`; pricing spans `quote`/`order-rules`; `domain.ts` dual. |
| GV-4 | Accept | **Partial** | See F3. |
| GV-5 | Accept | Yes | Lookup site fixed; three placements ranked. |
| GV-6 | Partial (declared) | Yes, with F5 | Interface-based definition; cap placement inconsistent between §12.3 and §17.2. |
| GV-7–GV-11 | Accept | Yes | §11.4/§15.1; §17.4 floors; §16.2; `src/index.ts` only; config moved to semantic scope. |
| R1 advisory 1–11 | — | Addressed | Equivalent mutant, H1 wording, `call_subagent`, opaque IDs, entry surface, median-of-two (see F2), hidden case 15, position counts, ceiling stop, current-context estimate, unmaskable conventions — all present. |

---

## C. Regression check

- **Budget arithmetic:** 1.50 + 0.70 + 0.35 = 2.55; ×3 = 7.65; ×5 = 38.25; two replacements 15.30; maximum 53.55. Wall-clock 900 + 120 = 1,020; ×3 = 3,060; ×5 = 15,300; ×2 = 6,120; total 21,420 s = 5 h 57 min. Unchanged and correct. Seven slots × 7.65 equals the maximum stage exactly, so §24.2's "would exceed the stage ceiling" clause is consistent.
- **Retry accounting:** parent cap excludes children; arm cap includes all; one retry, fresh 0.35, no time extension; parent timeout cancels children; child exhaustion terminates child only. Consistent across §18.2, §23.2, §25.2.
- **Validity taxonomy:** infrastructure-invalid (§23.1) / `hard_failure` (§23.2) / scored non-hard failures (§23.3) / safety (§23.4) are disjoint and each decision rule references only the defined indicator. Dual classification for harness-enabled access retained (§23.6).
- **Rubric arithmetic:** 7+7+6+4+6 = 30 propositions, 90 raw + 10 temporal = 100; floors (A, B, D, E ≥2; C ≥1.5) sum to 67, so the 75 total floor binds — coherent.
- **Schedule vs stopping:** slots 1–5 planned, 6–7 replacements; stop on third invalidation; matches §21.3, §24.1–24.2, pilot 39–41.
- **Gates:** H1 list (12 items) and H2 list now include the new surfaces (`as-is.md`, `AGENTS.md`, numeric audit, seven-slot implementation, classifiers). No orphaned references to draft.1 concepts ("scored hard failure," six-order schedule, hidden case 15) remain.
- **Public example vs task vs formula vs rubric:** consistent; task text and §6.5 rules agree on all fourteen behaviours.

---

## D. Bounded verdict

**Gate H1 (fixture preparation + provider-free pilot authorization): fit for a human decision, provided the human adopts F1 and F2 as bounded revisions at H1.** Both touch H1 items (rounding rule; rubric/decision thresholds) and both are short textual changes that do not alter the formula, public example, manifest, task text, or arm instructions. Authorizing fixture preparation without F1 would freeze a numeric policy that reintroduces path-dependent hidden failures at ties; without F2 the hard-failure indicator is undefined for a common assessor split. F3–F6 may be resolved before the pilot report is written and should appear as amendments in `draft.3`/final; none requires re-opening the fixture concept.

**Gate H2: not ready**, independently of the pilot, hashes, and OD-1–OD-8 — as the author's own status line states. The seventeen resolved findings are genuine and the decision rules are now operational; the remaining work is the pilot, the F1–F6 amendments, and the open decisions.

This review is advisory and confers no execution authority.

===== USAGE =====
{"prompt_tokens": 45358, "completion_tokens": 17240, "total_tokens": 62598, "cost": 1.31558, "is_byok": false, "prompt_tokens_details": {"cached_tokens": 0, "cache_write_tokens": 0, "audio_tokens": 0, "video_tokens": 0}, "cost_details": {"upstream_inference_cost": 1.31558, "upstream_inference_prompt_cost": 0.45358, "upstream_inference_completions_cost": 0.862}, "completion_tokens_details": {"reasoning_tokens": 12413, "image_tokens": 0, "audio_tokens": 0}}

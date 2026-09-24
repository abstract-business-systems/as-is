# Independent Review 1 of 3 — Protocol-level soundness of `c-dfdc-1.0.0-draft.1`

Scope: internal consistency, decision rules, validity taxonomy, temporal evidence, fairness. Advisory only. I checked the budget arithmetic, the fixture arithmetic, and the decision rules directly rather than relying on prior reviews.

---

## A. Blocking findings

### B1. The public acceptance example sits exactly on a half-cent rounding boundary; the fixture's "correct" answer depends on implementation path, not design quality
**Refs:** §6.5, §6.6, §7.2 ("rounded once to cents"), §14.4, §27.2 items 4–7.

The public example yields raw fee `1.25 + 0.10×2 + 0.015×11.00 = 1.615` — precisely a half cent. In IEEE doubles, `1.615` is stored as `1.61499999…`. `Math.round(1.615*100)/100` returns `1.62` (because `1.615*100` re-rounds to exactly `161.5`), but `(1.615).toFixed(2)` returns `"1.61"`, and a decimal-safe rounder given the exact decimal `1.615` returns `1.62` under half-up and `1.62` under half-even. The task text specifies neither a rounding mode nor a numeric representation. Two competent arms following different, defensible rounding routes will produce `1.61` vs `1.62`; the §14.4 tolerance (1e-6) cannot absorb a one-cent divergence. This converts an implementation-path accident into a scored public/hidden failure and a hard failure (§17.4), directly contaminating the primary and secondary decision rules.

The same hazard recurs in the cap region: 26 `berries` gives raw `5.995` (another exact half cent), which is the obvious "just below cap" candidate for hidden case 9.

**Required resolution (before Gate H1 fixture approval, since OD-1 freezes the example):**
1. Replace the public example inputs with values whose raw fee is not within ±0.0005 of a half-cent boundary; audit every hidden case for the same property and record the audit in the reference analysis.
2. Either (a) specify the rounding rule in `task.md` and `benchmark-authority.md`-neutral terms (e.g., "round half away from zero on the decimal value"), and require the baseline to already expose the money-rounding helper the checker's expectations reproduce; or (b) declare half-cent inputs out of scope and add pilot check: "no public or hidden expected value is derived from a raw value within ±0.0005 of a half cent."
3. Make this a listed material-change condition in §28.2 ("numeric boundary sensitivity").

### B2. The randomization schedule cannot supply the stated two-triplet replacement reserve
**Refs:** §21.3 steps 3–5, §24.1, §24.2.

Six permutations exist; five are consumed by planned triplets; each replacement must use "the next unused randomized arm order." Only one unused order exists, yet two replacements are permitted. On a second invalidation the protocol has no defined order and §24.2 would force an incomplete stage for a purely schedule-defined reason.

**Required resolution:** Preregister a deterministic seven-slot schedule from the committed seed (e.g., full shuffle of six orders, then the seventh slot drawn from a second seeded shuffle, or explicitly permit reuse with a stated rule). State that the replacement slot is taken in schedule order regardless of which planned triplet was invalidated. Verify in pilot check 27 with a seven-triplet dry run.

### B3. "Scored hard failure" is decisive in three rules but never defined; the failure list conflicts with the retry mechanism
**Refs:** §4.4 (H2), §15.4, §17.4, §19 cond. 5, §20.2, §23.2, §18.2, §25.2.

The primary rule, the functional guardrail, and "approaches current" all count "scored hard failures," but the draft defines only (a) "scored arm failure" (§23.2, a long list including graded items such as "unnecessary abstraction," "excessive delegation," "directory-only component reasoning") and (b) semantic-acceptance conditions (§17.4). If every §23.2 item is a hard failure, nearly every run has one and the guardrails become uninformative; if only §17.4 governs, the draft never says so. Additionally, §23.2 lists "parent **or child** budget exhaustion" as a scored arm failure, but §18.2/§25.2 permit a retry after a failed child. A child that exhausts its USD 0.35 either ends the arm (making retry meaningless) or does not (making §23.2 wrong).

**Required resolution:**
1. Define a run-level boolean `hard_failure` set iff any of: public checks fail; hidden checks fail; temporal score 0; prohibited-scope write or safety event; baseline/plan/current states not distinguishable; any E4 or E6 proposition rated 0 for falsity; parent or arm-level budget/time exhaustion. Multiple events count once. Use only this indicator in §§4.4, 19.5, 20.2.
2. Move graded items (unnecessary abstraction, delegation quality, directory-only reasoning) out of the hard-failure set; they act through rubric anchors.
3. State that child-level budget/time exhaustion terminates the child attempt only, is recorded, and may be retried under §18.2; only parent-cap or arm-cap exhaustion is an arm failure.

### B4. Temporal "adequacy" is undefined, and it is unclear who rates it
**Refs:** §15.4, §15.3 ("temporal evaluator"), §17.2 A–C, §22.

Ten points and a hard failure hinge on "adequate" baseline, plan, and component evidence existing pre-mutation. No threshold is given: presence of any prose per category? a minimum anchor? a specified proposition subset? The rubric rates full-run content, not the pre-mutation snapshot, and the "temporal evaluator" is not identified as either harness logic or the blinded assessors. A harness cannot judge adequacy; assessors are not told to rate the pre-mutation snapshot separately.

**Required resolution:** Define temporal adequacy as: in the pre-mutation snapshot/transcript, each of a named proposition subset (recommend A1–A5, B1–B2 and B7, C1 and C6) is rated ≥1 (non-absent, not merely a task restatement) by the two blinded assessors, with the ordinary adjudication rule; the harness supplies the chronology, assessors supply the adequacy rating. Quality beyond presence is then scored via content anchors, avoiding double penalty. Whatever threshold is chosen, state it explicitly and add a pilot check exercising a borderline case (baseline present, plan absent).

### B5. The current arm's admission input and record-write location are unspecified; the read-only current-artifact mount may create an arm-asymmetric harness failure
**Refs:** §5.1 ("component record"), §9.3 ("Filesystem mounts for current artifacts: Frozen read-only mount"; "Durable record procedure: Current procedures available"), §11.4, §20.4 ("harness-blocked writes"), §23.2 ("unauthorized write attempt"), §27.2 item 13.

Two linked problems:
1. The "component record" handed to the current arm has no frozen text, location, or hash. Its content could leak baseline-design or component answers not available to B/C, or conversely fail `building-components` admission preconditions.
2. §11.4 explicitly allows the current arm to "update a canonical current-design record," and the current skill manifest includes `managing-as-is-records` and `preparing-scoped-commits`. But the only current-composition mount is read-only. If the current arm's procedures direct it to write records outside the fixture, the harness blocks the write, which §23.2 classifies as a scored "unauthorized write attempt." That is a harness-induced, arm-asymmetric failure mode misclassified as arm behavior — exactly the boundary §23.1 ("arm-asymmetric harness defect") is meant to catch.

**Required resolution (Gate H1, because it is item 4 of §3.1):**
- Freeze the exact component-record text (or declare `benchmark-authority.md` + `task.md` the sole admission artifacts) and hash it; require the reference-analysis author to certify it contains nothing beyond §7.
- Specify where the current arm's durable records are expected to be written (inside the fixture workspace) and confirm that the frozen current guidance does not direct writes to the read-only mount; add a pilot check that the current composition can complete its record procedure without a blocked write.
- Add to §23.1: a blocked write to a location the frozen current guidance instructs the arm to use is an arm-asymmetric harness defect, not a scored failure.

### B6. `AGENTS.md` is an arm-visible, unspecified instruction surface
**Refs:** §6.3 manifest, §7 ("Exact shared authority and task text"), §9.3 ("Root/project instructions" row).

§7 claims to give the exact shared text, but the fixture manifest also freezes `AGENTS.md`, whose content is never stated. Most agent hosts auto-load such a file, so it is effectively part of every arm's instruction context and could carry project guidance to B/C (breaking §9.2 isolation) or duplicate/contradict §7.

**Required resolution:** Publish the exact `AGENTS.md` text in §7 (or remove it from the manifest), state whether the host loads it for each arm, and include it in the additive-diff/parity checks (§8.3, §27.2 items 9–12).

### B7. "Approaches current" conditions 7–9 and the hidden-check count for truncated runs are ambiguously computed
**Refs:** §19 conditions 3–4, 7–9; §21.5; §17.3.

Condition 1 is explicitly a paired median. Conditions 7–9 say "median … no more than 0.5 below / 125% of current" — this could mean median(C) vs median(current) or median of paired differences/ratios; with n=5 the two can disagree. "Anchor average" for component sets is not defined algebraically. Separately, §21.5 says timeouts retain evidence, but the draft does not say whether hidden checks are run against a timed-out or budget-exhausted workspace; conditions 3–4 and §20.2 depend on that count.

**Required resolution:** State each condition as either a paired statistic (median of per-triplet differences/ratios) or a marginal comparison, uniformly; define anchor average = raw subscore ÷ proposition count (9, 6, 3) per run. State that the hidden checker is always run on the final workspace of every non-infrastructure-invalid run, including timeouts and exhaustions, and that a crash on import counts as hidden-fail.

### B8. Two decisive classifications lack operational tests: mid-run provider degradation, and "attempt to locate or access hidden material"
**Refs:** §14.3, §23.1 ("provider failure before any model turn"; "independently verified provider outage"), §23.2 ("arm-caused timeout"), §23.3, §25.2 ("provider-side retries charged").

After the first model turn, intermittent provider errors (rate limits, 5xx, truncated streams) consume budget and wall-clock. The draft has no rule for when accumulated provider faults convert an "arm-caused timeout" into infrastructure invalidity, so classification would be post hoc and could differ by arm. Conversely, "attempted" hidden-material access is a stage-stop trigger with no operational definition; an arm running `find . -name "*.test.ts"` inside the fixture is legitimate, an arm probing outside the workspace is not.

**Required resolution:**
- Preregister a mid-run provider rule, e.g.: harness-recorded provider transport failures totalling >N seconds or >k retries within one arm → infrastructure invalid; below that → arm-caused. Apply symmetrically and log all transport events.
- Define "attempt" as any read/list/search targeting paths outside the allocated workspace and allowed mounts, or any command containing harness/checker path patterns from a frozen denylist; everything within the workspace is not an attempt. Add a pilot check for both a benign and a violating probe.

### B9. Treatment dilution: `task.md` already contains most of Candidate C's method, so a null primary result is uninterpretable unless preregistered
**Refs:** §2, §4.1, §7.2, §8.2, §3.1 item 11.

The expert review warned that the task should state outcomes while C supplies method. `task.md` now requires pre-mutation baseline/plan/component evidence, intent-vs-observation separation, amendment records, resulting-current design, and minimum scope with the same prohibited-abstraction list — i.e., nearly all of §8.2 minus the component-identification criteria and the identified/changed/new distinction. The B-vs-C contrast therefore estimates the marginal effect of methodological framing on top of a fully outcome-specified task. That is a legitimate question, but §4.1 phrases the question as whether adding design-first guidance improves outcomes, and a null result would be read as "guidance is worthless" rather than "task already carried it."

**Required resolution (Gate H2):** Either trim `task.md` to outcome requirements (what evidence must exist and be recoverable) and move method language (how to identify components, when to record amendments) exclusively into §8.2; or keep the task as is and preregister in §2/§4 that the primary estimand is the marginal effect of the method block given an outcome-specified task, with the explicit null-result interpretation. Do not do both silently.

---

## B. Consistency checks that pass

- **Budget arithmetic:** 1.50 + 2×0.35 + 0.35 = 2.55; ×3 = 7.65; ×5 = 38.25; +2×7.65 = 53.55. Wall-clock 900 + 120 = 1,020; ×3 = 3,060; ×7 = 21,420 s = 5 h 57 min. Correct.
- **Inclusion semantics** (§25.2) are unambiguous on parent/child/retry nesting and non-transferability.
- **Matched-triplet replacement** as a whole unit is the right choice for paired analysis; exploratory reporting of orphan members is appropriate.
- **Validity taxonomy boundaries** are conceptually correct, including §23.4's dual-classification of harness-enabled model access.
- **Primary decision rule** (§20.2) is non-circular and descriptive; median ≥ +10 with 4/5 wins is a coherent conservative threshold for n=5. §19 correctly disclaims non-inferiority.
- **Public example arithmetic** (apart from the rounding boundary in B1) is correct: subtotal 19.00, 3 units, no discount, total 20.62.

---

## C. Advisory findings

1. **Equivalent mutant.** §14.2 item 17 requires a mutant-killing case for "applying the cap after rounding incorrectly." For a cap that is an exact cent value, `min(6, round(x))` ≡ `round(min(6, x))` for all x; this mutant is behaviorally equivalent and pilot check 6 will fail on it. Replace with a killable variant (e.g., applying the cap to a per-unit term) or delete.
2. **H1 vs. decision rule.** §4.4 H1 says "positive paired difference"; §20.2 requires +10 and 4/5. Reword H1 to the operational threshold.
3. **`call_subagent` vs. external launcher.** §9.2 exposes `call_subagent` while §5.4/§9.1 speak of a "frozen external launcher." Clarify whether these are the same mechanism; §18.2 counting and pilot check 20 must cover both.
4. **Opaque identifiers.** §8.3 permits arm identifiers in environment variables. Require them to be random tokens not derivable from arm label; `env` is one `bash` call away.
5. **Checker entry surface.** State that the hidden checker imports the frozen baseline public module (`src/index.ts` exports `quoteOrder`/`renderReceipt`); an arm that breaks that surface fails hidden checks (scored), avoiding an infra/arm dispute.
6. **Median of two assessors.** Without adjudication, "median" of two ratings is their mean and can be non-integer; state this and how it feeds the 87-point raw total.
7. **Hidden case 15** ("absence of generic runtime configuration requirements") is not a behavioral test; define how the checker or assessor decides it (e.g., diff shows no new config file/env read).
8. **Order balance.** Five of six permutations leave one arm under-represented in one position; acceptable for descriptive purposes but report the realized position counts.
9. **Cost-ceiling stop** (§24.2) is redundant given caps are hard-enforced; if a ceiling is ever exceeded, that is itself an infrastructure defect and should be classified as such.
10. **Budget adequacy** (OD-7). Prior current-arm spend on a different task averaged USD 0.69; the design-first task plus a 36-skill manifest may push the current arm higher. Recommend the pilot report include token estimates of the frozen current context load so the human can judge whether 1.50 risks systematically truncating one arm.
11. **Blinding audit.** Current-arm record conventions will likely be recognizable despite aliasing; require the pilot report to list each unmaskable convention.

---

## D. Bounded verdict

**(a) Gate H1 — fixture preparation + provider-free pilot authorization:** **Not ready as `draft.1`; ready for a human H1 decision after a `draft.2` that resolves B1, B5, and B6 and pins the schedule in B2.** These four are cheap textual fixes but each touches an H1 item (fixture text, current-arm inputs, frozen surface inventory, triplet construction), and B1 in particular would otherwise freeze a defective fixture. Remaining blockers (B3, B4, B7, B8, B9) may be resolved in parallel with pilot design but must be closed before the pilot report is written, since several require pilot checks.

**(b) Gate H2 — scored preregistration:** **Not ready.** Independent of the outstanding pilot, hashes, and open decisions, the decision rules currently reference an undefined hard-failure indicator (B3), an undefined temporal threshold (B4), ambiguous aggregation (B7), and non-operational validity boundaries (B8), and the primary estimand's interpretation is not preregistered (B9). Approving scored execution against these definitions would leave the protocol's decisive outcomes to post hoc judgment, which is the defect the preregistration exists to prevent.

No finding here authorizes changes or execution.

===== USAGE =====
{"prompt_tokens": 39285, "completion_tokens": 16445, "total_tokens": 55730, "cost": 1.2151, "is_byok": false, "prompt_tokens_details": {"cached_tokens": 0, "cache_write_tokens": 0, "audio_tokens": 0, "video_tokens": 0}, "cost_details": {"upstream_inference_cost": 1.2151, "upstream_inference_prompt_cost": 0.39285, "upstream_inference_completions_cost": 0.82225}, "completion_tokens_details": {"reasoning_tokens": 10093, "image_tokens": 0, "audio_tokens": 0}}

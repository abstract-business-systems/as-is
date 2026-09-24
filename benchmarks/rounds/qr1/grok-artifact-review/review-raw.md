[openrouter-session] Ready, base session ID: ephemeral-1788825771070-81fe46n7zsx
[openrouter-session] Using session_id: grok-artifact-review-ephemera
# External review: cold-cart-quote stage (`/tmp/ccq-stage`)

## 1. Verdict

**NOT FIT** — draft.3’s F1 numeric contract is not implemented as specified, and the provider-free pilot still certifies **65/65**, which is exactly the preregistration-blocking condition §27.3 exists to catch.

## 2. Blocking findings

1. **Public and hidden money checks violate §14.4, while the pilot claims compliance.**
   - `fixture/acceptance/cold-handling.public.test.ts` uses `toBe` / `toEqual` on `2.48`, `32.48`, `30`, `0`. §6.6 requires those comparisons to apply §14.4. Draft.3’s own rationale (amendment 7 / §32) is that a prior checker wrongly demanded exact binary equality.
   - `custody/checker/hidden-checker.test.ts` implements a correct `tol(e)` helper, then comments “cent-alignment via roundMoney semantics” and immediately does `Math.round(actual * 100) / 100`. §14.4 requires `round2(a) = roundMoney(a)`. Same file also uses exact binary equality on monetary fields (`q.discount).toBe(0)`, `unitPrice: 5.5, subtotal: 22`).
   - `pilot/run-pilot.ts` check 15 is a tautology: `checkerSrc.includes("cent-aligned") && !checkerSrc.includes("toFixed") === false ? checkerSrc.includes("round2") : checkerSrc.includes("round2")` always reduces to `includes("round2")`. It never checks for `roundMoney`. Check 9 is equally syntactic (`includes("tolerance") || includes("tol(")`).
   - Why it matters: freezing this would re-introduce the exact defect draft.3 was written to close, under a false PASS.

2. **The 65/65 report is not a 65-check.** Several required §27.2 items are hardcoded or proxied by tests that do not measure the claim:
   - Check 18: `r(18, ..., true, ...)` — `AGENTS.md` is not in the classifier denylist (`harness/classifiers/classifiers.ts`).
   - Check 22: hardcoded `true`.
   - Check 6: reads `mutant-results.json` and checks `rejected: true`; does not apply any mutant.
   - Check 32: recorder test *expects* `preMutationEvidence` length 1 for a “task paraphrase,” and the comment admits content is an assessor judgment. §15.4 still requires the pilot to exercise paraphrase-without-grounding as a *failing* temporal case.
   - Check 33: no recorder/assessor fixture for “plan present, component-change evidence absent.”
   - Check 58: PASS because the JSON string contains `"disabled"`; there is no launcher that consumes the manifest.
   - Checks 63 and 65: hardcoded `true`.
   - Why it matters: §27.3: “Any failed check blocks final preregistration.” A rubber-stamped PASS is worse than a documented FAIL.

3. **Mutant kills are not reproducible from the staged tree.**
   - Custody contains `numeric/mutant-results.json` (12 names, failing-case counts) and a table in `reference-analysis.md`. There are no mutant patches, no runner, and no residual mutant worktrees under `custody/ref-scratch/`.
   - M1’s `failing_cases: 4` is hard to reconcile with a checker that has only one duplicate-line case (H3). The mutants I *can* reason about look killable (see E), but the 12/12 claim cannot be independently re-established.
   - Why it matters: §6.7 and §27.2.6 require the mutants as sealed, re-runnable evidence, not a scoreboard.

4. **§26 routing manifest is incomplete, and check 56 still PASSes.**
   - Required: “a SHA-256 hash.” `harness/manifest/routing-manifest.abs-medium.json` has none. Provenance cites `/tmp/ccq-stage/harness/manifest/generate-manifest.ts`, which is not in the tree.
   - `resolved_model_identifier` is `UNRESOLVABLE-CLIENT-SIDE`. §26: if an immutable resolution cannot be frozen, “the scored stage is blocked.” Finding 1 of the pilot report states this honestly; check 56 then treats the manifest as complete because a hand-picked key list (which omits `hash`) is present.
   - Why it matters: you cannot preregister a frozen route that the protocol says is not frozen.

5. **Hidden-probe classifier would treat legitimate current-arm reads as safety events if it were ever wired.**
   - `isAllowedReadOnlyMount` always returns `false`. Any path outside `workspaceRoot` is a hidden-material attempt (§23.6 → §23.4 stage-stop).
   - Relative `find .` is also classified as an attempt: the sanitizer strips a lone `.` to `""`, which is not inside the workspace. Tests only cover already-absolute in-workspace paths (`${ws}/test`).
   - Why it matters: §9.3 current arm *must* read a frozen read-only mount. This classifier, as written, makes that a safety stop.

## 3. Non-blocking advisories

1. Baseline `test/quote.test.ts` and `test/receipt.test.ts` pin chilled carts to pre-fee totals. A correct fee implementation fails the baseline suite until those tests are edited. The reference does edit them; arms that treat `bun test` as a freeze of old totals will fight the task.
2. H14 (receipt fee placement) is folded into H8/H13. Allowed by “at least,” but the numbering skip is needless opacity.
3. Reference `test/receipt.test.ts` uses `{ sku: "berries", quantity: 0 }.sku ? { sku: "rice", quantity: 2 } : { sku: "rice", quantity: 2 }`. Behaviorally rice×2; it is obfuscation, not design.
4. WORKLOG claims a “600-seed check” of Latin-square uniformity. `harness/schedule/schedule.test.ts` has no such test.
5. Pilot report lists `custody/reference.patch`; the file is `custody/ref-scratch/reference.patch`.
6. Placement fork never discusses putting a pure formula next to `bulkDiscount` in `order-rules.ts`. If exported, that is Family F; if inlined/private, still Family S. Worth a sentence in the analysis.
7. Checker H1 has dead `input === undefined ? 0` and a rice/tea-only total reconstruction.
8. `harness/packets/packet-generator.test.ts` proves dummy strings lack the substrings `cost|tokens|current|order`. Real packets will contain “order” (`quoteOrder`) and “current” (resulting-current design). The test does not prove §22.1 blinding.
9. Recorder “simultaneous plan/source” detection is a regex on the command string (`design|plan|baseline|as-is.md` ∧ `src/|test/`). Easy to evade; easy to false-positive.
10. `bun.lock` exists only because of an unused `typescript` devDependency. Finding 2 already says this.

## 4. Sections A–H

**A. Fixture quality.** By reading, the baseline is a competent, complete cart-quote engine minus the fee: catalog storage facts, merge/sort/validate, 10%/10-unit bulk discount, snap-then-round `roundMoney` matching the frozen snippet, receipt without a fee line, `Quote` without `fees`. The four §7 surfaces match the protocol texts I compared (paragraph-level, not a byte digest). They do not name target files, component counts, or hidden cases; `task.md` naming `roundMoney` is the acknowledged opacity leak. The public test will fail on baseline because `quote.fees` is missing, which is the right reason. I did not run `bun test`.

**B. Reference solution.** By reading `custody/ref-scratch/repo/src/quote.ts` against the formula: `1.25 + 0.10×units + 0.50×distinct + 0.015×chilledSubtotal`, `min(6, raw)`, then `roundMoney`, added after discount, ambient excluded, merge already done by `normalizeLines`, storage taken from the existing `getProduct` lookup and stripped from returned lines. That is Family S as §12.1 defines it, and it is the minimum evidence-supported placement. A private helper in `quote.ts` would still be S; a new exported fee module would be F. I did not find a cleaner *smaller* design the analysis missed.

**C. Hidden checker.** Eighteen tests cover the §14.2 list (H14 inlined). They are interaction-level: merge × distinct × discount × cap × ambient exclusion × receipt order. Entry surface is `import(`${ws}/src/index.ts`)` only. Tolerance on fee/total is the right formula. Gaps: cent-alignment is `Math.round` not `roundMoney`; several money fields still use exact equality; receipt byte-stability via `toBe` is appropriate for presentation, not a substitute for §14.4. Beyond the listed mutants, wrong base, per-SKU 1.25, ambient-in-distinct, receipt spacing, and fee-not-in-total should fail. Near-tie rounding, Family F vs S, and exact-cent term-splitting will not.

**D. Numeric audit.** Verified by independent decimal arithmetic, not by running their generator:

| Case | Raw fee | Dist. to nearest half-cent |
| --- | ---: | ---: |
| public / H2 / H3 / H4 / H8 (4 berries) | 1.25+0.40+0.50+0.015×22 = **2.48000** | 0.00500 |
| H5 (1 berry + 1 yogurt) | 1.25+0.20+1.00+0.015×8.7 = **2.58050** | 0.00450 |
| H10 (28 yogurt) | 1.25+2.80+0.50+0.015×89.6 = **5.89400** | **0.00100** |
| H9 (29 yogurt, unbounded) | 1.25+2.90+0.50+0.015×92.8 = **6.04200** | 0.00300 |
| H19 (3 berries) | 1.25+0.30+0.50+0.015×16.5 = **2.29750** | 0.00250 |

Minimum 0.001 > 0.0005. No fee case is a tie. Exact/near half-cents live only in `test/domain.test.ts`. The band is honest.

**E. Mutant claims.** None of the twelve named mutants is equivalent to the reference on these inputs: H3 kills unmerged distinct counts; H19 kills truncation (`2.2975` → 2.30 vs 2.29); H9 kills cap-omitted (`6.042` → 6.04 vs 6.00); H9+H10 kill a $5 cap; H15 plus the total assertions kill fee-not-in-total. The cap-before-round concession is correct for a cent-grid $6.00 cap: `roundMoney(min(6, raw))` ≡ `min(6, roundMoney(raw))` on this grid. Exact-cent term-splitting is also equivalent here because `1.25 + 0.10n + 0.50k` is an integer number of cents, so half-up of `(rest + pct)` equals `rest + half-up(pct)`. What is *not* established is that the JSON was produced by actually running those mutants.

**F. Harness sanity.** `buildSchedule` follows §21.3 (domain-separated seed, shuffle of all 6 permutations, slot 2 first derangement, slot 3 the unique Latin completion). For order 3 that construction is uniform over the 12 Latin squares; that is a proof, not the claimed 600-seed experiment. Candidate C, by reading the three instruction files, is B plus a blank line plus the §8.2 block; the pilot’s `c === b + "\n" + block` is the right predicate. Recorder semantics match §15.2 on design-only vs source writes and simultaneous commands, and correctly refuse to treat harness snapshots as arm-authored evidence; they do not implement §15.4’s paraphrase / missing-C-evidence exercises. Provider-fault thresholds match §23.5 (`>= 3` faults, `> 60` seconds). Packet generator *constructs* omitted fields; its tests do not prove real packets are blind.

**G. Pilot credibility.** The report’s 65-row table matches the §27.2 numbered list, and the four “Findings for the human” are real (opaque preset, lockfile hack, AGENTS.md protection untested live, checks 21–22 static). They are **incomplete**. They do not mention: false §14.4 certification; missing manifest hash / missing generator; mutants not re-run; checks 32/33/43/48/58 not measuring their names; no executable launcher, process recorder, or mount enforcement anywhere under `harness/`. Cost USD 0.00 is credible: `run-pilot.ts` is local `bun test` / `git clone` / file reads. The 65/65 headline is not.

**H. Protocol conformance spot-checks.**
- §6 fixture identity, catalog, formula, `roundMoney` snippet, missing-feature public example: present and aligned.
- §7 authority texts: aligned by reading.
- §8.3 additive-diff: present as files; I did not SHA them.
- §14.4 / F1: **deviates** (finding 1).
- §15.4 required pilot exercises: **incomplete** (checks 32–33).
- §21.3 schedule: construction present; empirical uniformity claim not in tests.
- §26: **deviates** (no hash; unresolved model; no launcher consuming the manifest).
- §27.2/§27.3: structure present; several checks do not do what they say.

## 5. Checks I could not perform

- I have no shell in this review environment, so I did **not** re-clone and run `bun test`, `run-checker.sh`, or the pilot runner. Baseline-green / acceptance-red / reference-green are **read-only inferences** plus the pilot’s own captured notes, not “verified by running.”
- I did not apply or re-run any mutant.
- I did not byte-compare Candidate C against `B + NL + block` (read the three files; they match visually).
- I did not hash-verify the proposed fixture digest list against the files.
- I did not execute `buildSchedule` over many seeds.
- Current-composition sources live under `/home/vc/dev/as-is` (OD-2 still open) and were out of scope except where `run-pilot.ts` references them.

Keep the fixture, the formula, the Family S patch, and the numeric-audit arithmetic. Do not freeze hashes until §14.4 is actually implemented, mutants are re-runnable custody artifacts, the manifest has a hash and a frozen model identity (or Gate H2 explicitly accepts the §26 block), and the pilot reports FAIL or “not executable provider-free” instead of PASS for checks it did not perform.

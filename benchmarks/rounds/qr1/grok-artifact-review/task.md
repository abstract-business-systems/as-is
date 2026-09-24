You are an independent qualitative reviewer of a completed benchmark-fixture build. You did not build these artifacts and you have no stake in their acceptance. Your job: judge whether the built solutions are fit for their stated purpose, and say so plainly.

# What was built (for context only — verify everything yourself)

A coding-benchmark fixture ("cold-cart-quote", protocol c-dfdc-1.0.0-draft.3 §6) plus its hidden evaluation custody and harness, staged at /tmp/ccq-stage/:

- fixture/ — a TypeScript/Bun git repo: a small cart-quote engine (catalog, order lines, bulk discounts, receipt) that DELIBERATELY LACKS one spec'd feature: a per-distinct-chilled-SKU cold-handling fee (formula: 1.25 + 0.10×chilledUnits + 0.50×distinctChilledSKUs + 0.015×chilledSubtotal pre-discount, ambient excluded, capped at 6.00, snapped-then-rounded to cents, added after discount). Baseline suite must pass; a public acceptance test must fail on baseline for the missing-feature reason. Authority/task surfaces (AGENTS.md, benchmark-authority.md, as-is.md, task.md) are frozen §7 texts.
- custody/ — arm-hidden evaluation material: sealed hidden checker (18 interaction cases via src/index.ts only, tolerance-based), reference patch (Family S placement: fee inside quote pricing), sealed reference-analysis.md (baseline + planning oracles, mutant taxonomy, admission no-leak certification), numeric-audit.json (fee cases' distance to nearest half-cent must exceed USD 0.0005), mutant-results.json (12 mutants, all must be killed).
- harness/ — 3-slot seeded Latin-square arm schedule (uniform over all 12 orders), abs-medium routing manifest, temporal evidence recorder, hidden-probe/provider-fault/stage-stop classifiers, blinded packet generator, arm wrappers, launcher-arg parity (Candidate C must equal Candidate B plus one frozen block, byte-proven).
- pilot/ — provider-free pilot report claiming 65/65 checks passed at USD 0.00 provider cost.

# Your review tasks

Read the actual artifacts (you have read-only tools: read, grep, find, ls). Assess:

A. Fixture quality: Is the baseline app a faithful, competent implementation of everything EXCEPT the fee term? Does the acceptance test fail on baseline for the right reason (you may re-clone and run `bun test` in a scratch copy, but do NOT modify /tmp/ccq-stage itself)? Are the four authority surfaces coherent and free of leaks about the expected solution?
B. Reference solution: Is the fee implementation in custody/reference.patch correct against the formula above (including the cap, snap-then-round, fee-after-discount)? Is the Family S placement (fee computed inside quote pricing, storage via existing getProduct lookup) the minimal evidence-supported design? Any cleaner alternative the analysis failed to consider?
C. Hidden checker: Are the 18 cases genuinely interaction-level and discriminating? Is the tolerance approach (no raw decimal serialization, exact-binary comparisons) sound? Is the src/index.ts-only entry surface actually enforced? Would this checker reject plausible wrong implementations beyond the listed mutants?
D. Numeric audit: Check numeric-audit.json arithmetic yourself for at least 3 cases (e.g., public-acceptance 4 berries + 1 rice; the 28-yogurt case at distance 0.001). Is the >0.0005 half-cent band honestly maintained, and are ties truly confined to roundMoney unit tests?
E. Mutant claims: mutant-results.json claims 12/12 killed. Are any of these mutants actually equivalent to the reference (i.e., falsely claimed killable)? The analysis concedes cap-before-round and an exact-cent-split as mathematically equivalent and does NOT claim them — is that concession correct?
F. Harness sanity: schedule uniformity construction, the C = B + block additive-diff proof (harness/instructions/), recorder semantics vs its tests, classifier thresholds vs draft.3 §23.5/§23.6 (3 failed requests OR >60s cumulative unavailability), blinding in the packet generator.
G. Pilot credibility: does pilot/pilot-report.md's 65-check structure actually cover what it claims, and are its four "Findings for the human" correctly characterized and complete? Identify anything material it MISSES.
H. Protocol conformance spot-checks: compare the built artifacts against /tmp/sol-draft3/draft3-clean.md (the authoritative protocol). Flag any place where the build deviates from what §6, §7, §14, §21, §26, §27 actually require.

# Output format

Write your review as structured markdown:
1. Verdict line: "FIT FOR PREREGISTRATION" or "NOT FIT" — with the single most important reason.
2. Blocking findings (numbered, each with file+evidence and why it matters).
3. Non-blocking advisories (numbered, terse).
4. Sections A–H with a one-paragraph qualitative judgment each.
5. Any check you could NOT perform (be honest; do not fabricate verification).

Constraints: read-only; do not modify anything; do not contact any network service; judge only what is present in /tmp/ccq-stage and the protocol file. Distinguish "I verified by running" from "I verified by reading".

# Side-by-side authority/limits evidence — `component-builder` (stage 2, full-flow)

Fidelity sources: target-design 7.1 rows (lines 314, 316), section 8 disposition (line 369), stop-condition context (lines 300, 541, 557, 567, 601, 605, 611-613). Realization: `candidate/agents/target/component-builder/agent.md`. One bounded worker attempt; integrated by the implementer. For human review (plan section 9, check-11 pattern).

| # | Draft line(s) | Draft text (verbatim) | Realized agent.md line(s) | Fidelity note |
| --- | --- | --- | --- | --- |
| 1 | 364 | Names provisional; naming review before adoption. | — (not restated) | component-builder is an existing name (retain-and-adapt); no provisional-name note required. |
| 2 | 369 (disposition) | **Retain and adapt** — "Parent planner for its own component and fresh child-scoped builder for a particular child: plan injection, child-local implementation, child-local verification, bounded integration into the parent worktree, recovery, and status handoff." Migration note: proposed target difference; preserve current behavior until separately accepted and validated. | 9-10 (Role) | Both scoped uses and the migration note carried verbatim in Role. |
| 3 | 314 (authority) | "Owns one bounded parent task, including parent implementation, identifying impacted children, preparing child-scoped plans, ordering planning dependencies, and recording child dispositions." | 9, 12 | Parent authority carried (static check); enumerated duties appear in Role. |
| 4 | 314 (limits) | "Performs no implementation verification; does not semantically review, validate, approve, cherry-pick, or integrate a separately owned child's implementation." | 13, 17, 30 | Verbatim in Parent planner authority, Explicit limits, and Reporting (static check). |
| 5 | 316 (authority) | "A fresh instance scoped from one child record; implements the injected plan, performs child-level verification, integrates its bounded result with the parent worktree using the admitted mechanism, and reports evidence or a blocker." | 15 | Verbatim (static check). |
| 6 | 316 (limits) | "Cannot change the parent plan, sibling scope, accepted envelope, parent task state, or protected parent artifacts outside the admitted integration operation." | 16, 18 | Verbatim in Child-scoped builder authority and Explicit limits (static check). |
| 7 | 541, 557, 567 | Child stop conditions; no ambiguity-by-invention / acceptance-relaxation / dependency-substitution / protected-input-reinterpretation / sibling-scope-modification / question-conversion; structured report. | 24-27, 29 | Carried as terminal stops and report contents (walk-through scenarios A-G PASS). |
| 8 | 611-613 | Do not infer completion / do not restart or retry automatically / do not silently widen scope. | 24-26 | Verbatim sentences present (integration fix — worker had restated with "Never…"; verbatim 10.6 sentences added; static check now green). |
| 9 | 300, 601, 605 | Parent closure accounting without semantic revalidation; question resolution only when envelope-determined; blocking question prevents closure and full accounting. | 26, 30 | Carried (walk-through I PASS). |
| 10 | 320-321; skills draft 113 | Tools never grant authority. | 6, 16, 19 | `tools: read,grep,find,ls,edit,write` (mutation narrowly authorized for child-local implementation and admitted integration; declaration grants no authority). Flagged: shell tool deliberately not declared (smallest capability). |

Static check results: `candidate/evidence/full-flow-agent-component-builder-checks.txt` (18 pass, 0 fail). Isolation listing in the checks file.

## Integration adjustments (recorded)

1. Added verbatim 10.6 stop sentences (worker had restated "Never…" forms; required row phrases now verbatim).

## Section 19 scope note

Provisional baseline 2 (child realization within the parent bounded task, lines ~779-789) matches the 7.1 rows used here and adds no material conflicting baseline; exact field names, adapter mechanics, and integration implementation remain deliberately provisional there and are not adopted as verification criteria.

## Items flagged for human adjudication

1. Section-8 migration note ("preserve current behavior until separately accepted and validated") carried in a construction artifact — it is a target-adoption caution, not a candidate-flow behavior rule; retained for fidelity, flagged for adjudication.
2. Description wording is worker-authored fit phrasing (pilot pattern).
3. Walker r2 scenario-H comprehension variance (see scenarios file; artifact confirmed faithful by inspection and quote-based re-run).
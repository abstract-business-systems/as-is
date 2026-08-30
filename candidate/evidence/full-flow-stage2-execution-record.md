# Full-flow realization — stage 2 execution record (target agent roster)

Plan: `designs/agentic-development-system-full-flow-realization-plan.md` (user-accepted with stated defaults; stages 1-3 authorized). This record consolidates stage 2: realization of the candidate target-roster agent definitions (plan section 6). Claims are limited to candidate fidelity (plan section 1). Process: one bounded worker attempt per agent via the governed launcher (`candidate/agents/worker/agent.md`, 600 s / $0.20, `--no-worktree` with a clean caller tree — recorded plan-decision deviation from the pilot's worktree-isolated launches; the caller tree was clean at every launch, so no uncommitted work was at risk), then plan section 9 agent verification executed by the implementer (static authority/limits mapping script `candidate/evidence/agent-check.sh`, side-by-side mapping, isolation fixture), then boundary walk-throughs by read-only walker agents (in-process bounded subagent calls for agents; two launcher walker runs where in-process document access was unreliable).

## Stage-2 roster outcomes (6/6 realized, all PASS)

Per the plan's section 6 disposition table: `thinking-companion` and `worker` are not created; parent-level verification/admission control is realized as a deterministic pre-launch checklist step (recorded for the benchmark in stage 4), not as an agent.

| # | Agent | Disposition | Worker attempts | Static checks (script `candidate/evidence/agent-check.sh`) | Boundary walk-throughs | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `as-is-orchestrator` | target-design:368 (Modify) | 1 | 10 pass, 0 fail (after integration fix) | A non-implementation boundary PASS; B no-inferred-acceptance PASS | `full-flow-agent-as-is-orchestrator-*` |
| 2 | `component-builder` | target-design:369 (Retain and adapt) | 1 | 18 pass, 0 fail | 9 scenarios: child stops (contradiction, missing dependency, prohibited access, failed validation, integration conflict, out-of-packet, no-scope-widening) and parent-side (no review/approve/integrate, no full-accounting with open blocking question) — see scenarios file for the recorded r2 scenario-H walker variance and quote-based r3 re-run | `full-flow-agent-component-builder-*` |
| 3 | `evidence-validator` | target-design:370 | 1 | 9 pass, 0 fail | 4/4 row-317 boundaries (mutation, admission, integration, human acceptance) PASS | `full-flow-agent-evidence-validator-*` |
| 4 | `execution-advisor` | target-design:371 (Retain) | 1 | 9 pass, 0 fail | 3/3 boundary scenarios (status, budget, recovery; completion covered) PASS | `full-flow-agent-execution-advisor-*` |
| 5 | `expert` | target-design:372 (Retain and compose) | 1 | 9 pass, 0 fail (after integration fix) | 2/2 (no-authority-from-reviewing; alternate-model gate) PASS | `full-flow-agent-expert-*` |
| 6 | `design-prototyper` | target-design:375 (Introduce) | 1 | 10 pass, 0 fail (after integration fix) | 2/2 boundaries (cannot accept own envelope; cannot authorize implementation) PASS | `full-flow-agent-design-prototyper-*` |

Model aliases recorded in `candidate/agents/target/config.json` (replaceable implementation choices, target-design line 377). Advisory roles carry read-only tools; component-builder adds narrowly authorized mutation capability with an explicit no-authority-grant statement.

## Integration adjustments (recorded)

1. `as-is-orchestrator`: added the verbatim 312 limit sentence and "non-implementing" (worker had restated behaviorally).
2. `component-builder`: added verbatim 10.6 stop sentences (worker had restated with "Never…" forms).
3. `evidence-validator`: added the verbatim four-limit sentence (worker had split it into bullets).
4. `expert`: aligned the alternate-model-gate wording to the section-8 row form ("…target gate").
5. `design-prototyper`: added the verbatim "Separate authorship from human acceptance" phrase.
6. Check script phrase matching made case-insensitive (prose limits); recorded.

## Flagged items for human adjudication (consolidated)

1. Working names `as-is-orchestrator` and `design-prototyper` are provisional (target-design line 364); naming review is user decision (plan section 13, item 4).
2. Description wording is worker-authored fit phrasing; roster-wide consistency is an adjudication item.
3. thinking-companion consultation mapping to skills-draft `consulting-humans` vs target-design 9.1's retained `human-centered-consulting` (plan section 6 flagged interpretation; recorded in the orchestrator side-by-side).
4. `component-builder` retains the section-8 migration-note sentence ("preserve current behavior until separately accepted and validated") for fidelity; it is an adoption caution, not a candidate-flow behavior rule.
5. Draft wording variance between 7.1 row 318 ("Not an alternate-model/family gate") and section 8 line 372 ("…target gate") — both carried for `expert`.
6. Walker variance: one component-builder walk-through run fabricated a governing rule not present in the fixture (recorded in the scenarios file); the artifact was confirmed faithful by inspection and a quote-based re-run.
7. In-process (call_subagent) walkers were used instead of launcher walkers for agent walk-throughs where in-process access worked; launcher walkers were used elsewhere. Mechanism noted as a process adaptation; walk-through isolation preserved via single-document fixtures.

## Section 19 scope note

Target-design section 19 provisional baselines were reviewed for all six agents (recorded per side-by-side document). No material section-19 baseline conflicts with or extends the mapped 7.1 rows; field-level mechanics there remain deliberately provisional and were not adopted as verification criteria.

## Claim limitation and residual risk

Claims are limited to candidate fidelity. No live-agent change, no promotion, no owner/independent-consumer evidence. Static checks verify verbatim row-phrase presence mechanically; semantic authority mapping is human-reviewed through the side-by-side documents. Stage 3 (12 masters) was realized in this same run; see `full-flow-stage3-execution-record.md`.
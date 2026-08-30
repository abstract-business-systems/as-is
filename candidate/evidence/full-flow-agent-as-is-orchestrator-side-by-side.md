# Side-by-side authority/limits evidence — `as-is-orchestrator` (stage 2, full-flow)

Full-flow realization plan (user-accepted) stage 2. Fidelity sources: `drafts/agentic-development-system-high-level-design-draft11/target-design.md` 7.1 row (line 312) and section 8 disposition (line 368). Realization: `candidate/agents/target/as-is-orchestrator/agent.md`. For human review (plan section 9, agent verification: static authority/limits mapping; side-by-side, check-11 pattern). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized agent.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 364 | "Names are provisional and require naming review before adoption." | 9 | "(working name `as-is-orchestrator`; name is provisional pending naming review)" | Plan decision: working name used; naming review is user decision (plan section 13, item 4). |
| 2 | 368 (disposition) | `as-is` — **Modify** — "Project-level human front face and root orchestrator: intent interpretation, status, lifecycle coordination, root escalation, and routing." | 9, 13 | Role section carries the disposition's planned responsibility; Authority section carries the 312 sentence verbatim. | Mapping recorded; disposition Modify noted (boundary change applies at adoption, not in this construction artifact). |
| 3 | 312 (authority) | "Root lifecycle coordination, human interaction, status synthesis, routing, and escalation." | 13 | Identical. | Verbatim (static check). |
| 4 | 312 (limits) | "Does not implement component work or infer human acceptance." | 15-18 | Verbatim sentence plus the same limits restated as behavioral rules (never implement component work; never infer human acceptance; never claim acceptance from reviews, transcripts, or agent reports). | Verbatim row limit present (static check); restatement does not widen the row. The "reviews, transcripts, or agent reports" enumeration operationalizes the plan's no-inferred-acceptance gate (plan section 10, gate 4 pattern) — flagged as an integration-fix addition for adjudication. |
| 5 | 368 (migration note) | "Its present 'router only' boundary must be changed explicitly; it must remain non-implementing." | 15 | "The orchestrator remains non-implementing." | "non-implementing" carried (static check). |
| 6 | 357 (7.2, context) | "Each caller should resolve an issue within authority, stop affected work when it cannot, preserve state and evidence, bubble a bounded question upward, and avoid forwarding irrelevant implementation detail. No automatic restart or retry should acquire new authority." | 20-21 | Boundaries section restates these as rules. | Cited by plan section 6 as supporting workflow context; restated as duties, not new authority. |
| 7 | 320-321; skills draft 113 | Tools/skills never grant authority. | 5 | `tools: read,grep,find,ls` (read-only advisory default, plan section 6 roster rules). | No tool or authority grant. |
| 8 | 373 (disposition pointer) | `thinking-companion` **Deprecate, then replace** — general consultation moves to the human-facing orchestrator and consulting skill. | — (recorded here) | Not realized in this agent's body. | Plan section 6: thinking-companion is not created; consultation moves to the orchestrator plus a consulting master skill (`consulting-humans` per plan mapping — flagged mapping choice; target-design 9.1 line 403 separately retains `human-centered-consulting`). Recorded for adjudication; realized at stage 3 in `consulting-humans`. |
| 9 | — | — | 1-7 | Front matter: name/description/model/thinking/tools. | Plan-decided artifact form (transient-roster file pattern); model alias is a replaceable implementation choice (line 377), recorded in `candidate/agents/target/config.json`. |

Static check results: `candidate/evidence/full-flow-agent-as-is-orchestrator-checks.txt` (10 pass, 0 fail after integration fix). Isolation: fixture contained only this agent's directory (listing in the checks file).

## Integration adjustments (recorded)

1. Added the verbatim 312 limit sentence and "non-implementing" to Explicit limits (static check initially failed on the missing verbatim row phrases; worker had restated the limits behaviorally). Recorded per the stage-1 integration-fix pattern.

## Section 19 scope note

Target-design section 19 (lines 759-809) provisional baselines were reviewed for this role: baseline 1 (design identity/change control) and baseline 3 (operational safeguards) name the orchestrator only indirectly (human acceptance linkage, compact escalation packets); no material section-19 baseline conflicts with or extends the 7.1 row beyond what the definition already carries. Detailed field-level mechanics are deliberately provisional there and are not adopted as verification criteria here.

## Items flagged for human adjudication

1. Working name `as-is-orchestrator` is provisional (target-design line 364); naming review is a user decision (plan section 13, item 4).
2. Description wording is worker-authored fit phrasing (pilot pattern); consistency across the roster is an adjudication item.
3. thinking-companion consultation mapping to skills-draft `consulting-humans` vs target-design 9.1's retained `human-centered-consulting` (plan section 6 flagged interpretation).
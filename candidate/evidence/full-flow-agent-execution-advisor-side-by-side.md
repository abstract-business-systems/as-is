# Side-by-side authority/limits evidence — `execution-advisor` (stage 2, full-flow)

Fidelity sources: target-design 7.1 row (line 322), section 8 disposition (line 371). Realization: `candidate/agents/target/execution-advisor/agent.md`. One bounded worker attempt; no integration adjustment needed. For human review (plan section 9, check-11 pattern).

| # | Draft line(s) | Draft text (verbatim) | Realized agent.md line(s) | Fidelity note |
| --- | --- | --- | --- | --- |
| 1 | 371 (disposition) | **Retain** — "Bounded trace/session analysis, process improvement, and budget evidence." | Role + Authority | Verbatim (static check). |
| 2 | 371 (migration note) | "Continue treating telemetry as supplementary." | Explicit limits | Carried ("supplementary" static-checked). |
| 3 | 322 (authority) | "Supplies bounded supplementary evidence." | Authority | Carried as the observability-row authority. |
| 4 | 322 (limits) | "Never defines task status, budget, recovery, or completion." | Explicit limits | Verbatim (static check); walk-throughs exercised all four. |
| 5 | 320-321; skills draft 113 | Tools never grant authority. | tools: read,grep,find,ls | Read-only advisory default. |

Static check results: `candidate/evidence/full-flow-agent-execution-advisor-checks.txt` (9 pass, 0 fail). Isolation listing in the checks file.

## Items flagged for human adjudication

1. The 7.1 Observability row (line 322) is the mechanism row the plan maps this agent to; the draft has no `execution-advisor`-named 7.1 row. Mapping recorded per plan section 6; adjudication item if a distinct agent-level row is wanted.
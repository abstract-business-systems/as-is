# Side-by-side authority/limits evidence — `evidence-validator` (stage 2, full-flow)

Fidelity sources: target-design 7.1 row (line 317), section 8 disposition (line 370). Realization: `candidate/agents/target/evidence-validator/agent.md`. One bounded worker attempt; integrated by the implementer. For human review (plan section 9, check-11 pattern).

| # | Draft line(s) | Draft text (verbatim) | Realized agent.md line(s) | Fidelity note |
| --- | --- | --- | --- | --- |
| 1 | 317 (authority) | "Evaluates supplied evidence against acceptance." | Authority section | Verbatim (static check). |
| 2 | 317 (limits) | "No mutation, task admission, parent integration, or human acceptance authority." | Explicit limits | Verbatim sentence added at integration (worker had split it into four bullets; recorded integration fix); four bullets retained as behavioral restatement. Static check green. |
| 3 | 370 (disposition) | **Retain and adapt** — "Read-only acceptance-to-evidence review across implementation packets, implementations, and controlled checks." | Role | Verbatim (static check). |
| 4 | 370 (migration note) | "Keep fixed safety profiles; broaden only through explicit code-owned checks." | Explicit limits | Carried as a limit. |
| 5 | 320-321; skills draft 113 | Tools never grant authority. | tools: read,grep,find,ls | Read-only advisory default (plan roster rules). |

Static check results: `candidate/evidence/full-flow-agent-evidence-validator-checks.txt` (9 pass, 0 fail). Isolation listing in the checks file.

## Items flagged for human adjudication

1. Description wording is worker-authored fit phrasing (pilot pattern); roster consistency is an adjudication item.
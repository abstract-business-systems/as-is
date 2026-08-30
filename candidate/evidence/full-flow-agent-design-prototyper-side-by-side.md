# Side-by-side authority/limits evidence — `design-prototyper` (stage 2, full-flow)

Fidelity sources: target-design 7.1 row (line 313), section 8 disposition (line 375). Realization: `candidate/agents/target/design-prototyper/agent.md`. One bounded worker attempt; integrated by the implementer. For human review (plan section 9, check-11 pattern).

| # | Draft line(s) | Draft text (verbatim) | Realized agent.md line(s) | Fidelity note |
| --- | --- | --- | --- | --- |
| 1 | 364 | Names provisional; naming review before adoption. | Role | "(working name `design-prototyper` is provisional pending naming review)" — user decision (plan section 13, item 4). |
| 2 | 313 (authority) | "Produces prototypes, target designs, component hierarchies, and implementation packets within design scope." | Authority | Verbatim (static check). |
| 3 | 313 (limits) | "Cannot accept its own envelope or authorize implementation." | Explicit limits | Both limits verbatim (static check). |
| 4 | 375 (disposition) | **Introduce** — "Produce interactive prototypes, target-design revisions, component hierarchies, implementation packets, alternatives, and decision briefs." | Role | Verbatim (static check). |
| 5 | 375 (migration note) | "Separate authorship from human acceptance." | Explicit limits | Verbatim phrase added at integration (worker had restated as "Authorship is separate from human acceptance"); both carried. Static check green. |
| 6 | 10.1 (lines 266-275, context) | Design workflow: clarify goal, inspect current as-is.md, build prototypes/structured views, derive implementation envelope, present exact frozen envelope for human review. | Method | Restated as method duties within design scope; no acceptance or implementation authority. |
| 7 | 320-321; skills draft 113 | Tools never grant authority. | tools: read,grep,find,ls | Read-only advisory default; the design/prototyping role's eventual authoring tools are an adoption-time implementation choice. |

Static check results: `candidate/evidence/full-flow-agent-design-prototyper-checks.txt` (10 pass, 0 fail). Isolation listing in the checks file.

## Items flagged for human adjudication

1. Working name `design-prototyper` is provisional (target-design line 364); naming review is a user decision (plan section 13, item 4).
2. The definition is read-only; producing prototypes/packets may require authoring capability at adoption time — a future tool-access choice (line 377), not granted here.
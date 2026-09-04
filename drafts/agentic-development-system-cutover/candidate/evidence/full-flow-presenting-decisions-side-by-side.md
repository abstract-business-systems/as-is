# Side-by-side fidelity evidence — `presenting-decisions` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 646-665. Realization: `candidate/skills/reusable/presenting-decisions/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 646 | `### \`presenting-decisions\`` | 2 + directory | `name: presenting-decisions`, `candidate/skills/reusable/presenting-decisions/` | Exact name and directory (check 2). |
| 2 | 648 | **Purpose**: Present bounded decisions, alternatives, uncertainty, and recommendations. | 8 | Identical. | Verbatim. |
| 3 | 650 | **Approach**: Frame the decision with evidence, trade-offs, unresolved questions, and an explicit request for the authority-bearing choice. | 12 | Identical. | Verbatim. |
| 4 | 650 | **How it should be done**: State the decision needed first; present evidence, options, benefits, costs, risks, assumptions, and unknowns; recommend only when justified; identify the authority-bearing decider; stop without treating advice as approval. | 16 | Identical. | Verbatim; the decision-first ordering, the seven presentation elements, the recommend-only-when-justified rule, the decider identification, and the terminal no-approval-inference rule ("stop without treating advice as approval") carried verbatim. No How-line "stop for direction" clause exists beyond this terminal rule, so no additional terminal-stop step was added. |
| 5 | 652-665 | #### Design view + Mermaid block: `Decision["Decision needed"] --> Evidence["Evidence and uncertainty"]`; `Evidence --> Options["Bounded alternatives"]`; `Options --> Human["Authority-bearing choice"]` | 20-28 | Identical fenced mermaid block including `config: layout: elk` fence. | Byte-equal (script check 12). |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Establishes fit for presenting bounded decisions, alternatives, uncertainty, and recommendations; grants no tools, permissions, or authority.` | Derived from Purpose (648) plus line-107 fit framing; grants no tools or authority. Fit/no-grant phrases are line-107-derived additions — flagged for human adjudication (pilot pattern). |
| 7 | — | — | 6/10/14/18 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Plan-decided artifact form; the draft uses bold labels. |

Static check results: `candidate/evidence/full-flow-presenting-decisions-checks.txt` (12 pass, 0 fail; 973 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file). File ended with a newline as produced (no integration adjustment).

## Items flagged for human adjudication

1. Description wording — line-107-derived additions (pilot pattern).
2. Heading-level variance across realizations (pilot residual risk 2).

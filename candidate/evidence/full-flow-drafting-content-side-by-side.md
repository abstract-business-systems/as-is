# Side-by-side fidelity evidence — `drafting-content` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 310-329. Realization: `candidate/skills/reusable/drafting-content/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 310 | `### \`drafting-content\`` | 2 + directory | `name: drafting-content`, `candidate/skills/reusable/drafting-content/` | Exact name and directory (check 2). |
| 2 | 312 | **Purpose**: Produce a bounded proposal without claiming adoption or completion. | 8 | Identical. | Verbatim. |
| 3 | 314 | **Approach**: State purpose, alternatives, assumptions, boundaries, and next decision while keeping proposal content separate from current authority. | 12 | Identical. | Verbatim. |
| 4 | 316 | **How it should be done**: Write the proposed outcome, rationale, scope, alternatives, dependencies, risks, acceptance, and next decision; label it as draft; avoid operational instructions that pretend adoption; route approval to the authority-bearing owner. | 16 | Identical. | Verbatim; the eight required proposal elements, draft labeling, no-pretended-adoption rule, and approval routing all carried in the single verbatim line. No How-line stop clause exists, so no terminal-stop step was added. |
| 5 | 318-329 | #### Design view + Mermaid block: `Question["Design question"] --> Proposal["Bounded proposal"]`; `Proposal --> Alternatives["Alternatives and assumptions"]`; `Alternatives --> Review["Next decision"]` | 20-28 | Identical fenced mermaid block including `config: layout: elk` fence. | Byte-equal (script check 12). |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Establishes fit for producing a bounded proposal without claiming adoption or completion; grants no tools, permissions, or authority.` | Derived from Purpose (312) plus line-107 fit framing; grants no tools or authority. Fit/no-grant phrases are line-107-derived additions — flagged for human adjudication (pilot pattern). |
| 7 | — | — | 6/10/14/18 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Plan-decided artifact form; the draft uses bold labels. |

Static check results: `candidate/evidence/full-flow-drafting-content-checks.txt` (12 pass, 0 fail; 928 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file). File ended with a newline as produced (no integration adjustment).

## Items flagged for human adjudication

1. Description wording — line-107-derived additions (pilot pattern).
2. Heading-level variance across realizations (pilot residual risk 2).

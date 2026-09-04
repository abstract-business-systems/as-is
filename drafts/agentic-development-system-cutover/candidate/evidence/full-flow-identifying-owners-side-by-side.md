# Side-by-side fidelity evidence — `identifying-owners` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 226-245. Realization: `candidate/skills/reusable/identifying-owners/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 226 | `### \`identifying-owners\`` | 2 + directory | `name: identifying-owners`, `candidate/skills/reusable/identifying-owners/` | Exact name and directory (check 2). |
| 2 | 228 | **Purpose**: Identify the authorities and owners for the resolved scopes. | 8 | Identical. | Verbatim. |
| 3 | 230 | **Approach**: Trace each concern to its canonical owner and separate authority, consultation, and implementation responsibilities. | 12 | Identical. | Verbatim. |
| 4 | 232 | **How it should be done**: Build a concern-to-owner table for implementation, task state, durable records, history, validation, delegation, and commits; verify each owner from a record or contract; distinguish who may advise, edit, authorize, and integrate. | 16 | Identical. | Verbatim; the seven concern areas and the advise/edit/authorize/integrate separation all carried in the single verbatim line. No How-line stop clause exists in this contract, so no terminal-stop step was added (worker confirmed). |
| 5 | 234-245 | #### Design view + Mermaid block: `Scope["Resolved scope"] --> Concerns["List concerns"]`; `Concerns --> Authorities["Map authorities"]`; `Authorities --> Handoff["Owner handoff"]` | 20-28 | Identical fenced mermaid block including `config: layout: elk` fence. | Byte-equal (script check 12). |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Identifies the authorities and owners for the resolved scopes; establishes fit only and grants no tools or authority.` | Derived from Purpose (228) plus line-107 fit framing; grants no tools or authority. Fit/no-grant phrases are line-107-derived additions — flagged for human adjudication (pilot pattern). |
| 7 | — | — | 6/10/14/18 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Plan-decided artifact form; the draft uses bold labels. |

Static check results: `candidate/evidence/full-flow-identifying-owners-checks.txt` (12 pass, 0 fail; 853 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file). The file ended with a newline as produced by the worker (no integration adjustment needed).

## Items flagged for human adjudication

1. Description wording — line-107-derived additions (pilot pattern).
2. Heading-level variance across realizations (pilot residual risk 2).

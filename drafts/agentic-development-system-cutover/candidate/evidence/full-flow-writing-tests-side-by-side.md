# Side-by-side fidelity evidence — `writing-tests` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 373-392. Realization: `candidate/skills/reusable/writing-tests/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 373 | `### \`writing-tests\`` | 2 + directory | `name: writing-tests`, `candidate/skills/reusable/writing-tests/` | Exact name and directory (check 2). |
| 2 | 375 | **Purpose**: Add or update focused coverage for a stated behavior. | 8 | Identical. | Verbatim. |
| 3 | 377 | **Approach**: Map each test to an acceptance condition or risk, choose the smallest relevant test level, and document residual gaps. | 12 | Identical. | Verbatim. |
| 4 | 379 | **How it should be done**: Name the behavior and failure risk; choose unit, integration, fixture, or live coverage; write deterministic success and boundary cases; avoid testing implementation details without contract value; record uncovered conditions and why. | 16 | Identical. | Verbatim; the four coverage levels, determinism requirement, implementation-detail avoidance rule, and residual-gap recording all carried in the single verbatim line. No How-line stop clause exists, so no terminal-stop step was added. |
| 5 | 381-392 | #### Design view + Mermaid block: `Behavior["Required behavior"] --> Risk["Failure risk"]`; `Risk --> Cases["Focused test cases"]`; `Cases --> Gaps["Coverage and residual gaps"]` | 20-28 | Identical fenced mermaid block including `config: layout: elk` fence. | Byte-equal (script check 12). |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Establishes fit for adding or updating focused coverage for a stated behavior; grants no tools, permissions, or authority.` | Derived from Purpose (375) plus line-107 fit framing; grants no tools or authority. Fit/no-grant phrases are line-107-derived additions — flagged for human adjudication (pilot pattern). |
| 7 | — | — | 6/10/14/18 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Plan-decided artifact form; the draft uses bold labels. |

Static check results: `candidate/evidence/full-flow-writing-tests-checks.txt` (12 pass, 0 fail; 855 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file). File ended with a newline as produced (no integration adjustment).

## Items flagged for human adjudication

1. Description wording — line-107-derived additions (pilot pattern).
2. Heading-level variance across realizations (pilot residual risk 2).

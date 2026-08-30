# Side-by-side fidelity evidence — `delegating-bounded-work` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 583-602. Realization: `candidate/skills/reusable/delegating-bounded-work/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 583 | `### \`delegating-bounded-work\`` | 2 + directory | `name: delegating-bounded-work`, `candidate/skills/reusable/delegating-bounded-work/` | Exact name and directory (check 2). |
| 2 | 585 | **Purpose**: Prepare a bounded child handoff without transferring authority implicitly. | 8 | Identical. | Verbatim. |
| 3 | 587 | **Approach**: Define the child outcome, scope, budget, context, acceptance, and return contract while retaining parent authority and ownership boundaries. | 12 | Identical. | Verbatim. |
| 4 | 589 | **How it should be done**: Verify the child boundary and configured worker; provide explicit linked context, budget, acceptance, changed-artifact boundary, recovery checkpoint, and return format; record the delegation; do not delegate parent authority or sibling files. | 16 | Identical. | Verbatim; the verification step, the six handoff contents (linked context, budget, acceptance, changed-artifact boundary, recovery checkpoint, return format), the delegation record, and the boundary rule ("do not delegate parent authority or sibling files") carried verbatim. No How-line "stop ..." clause exists, so no terminal-stop step was added. |
| 5 | 591-602 | #### Design view + Mermaid block: `Parent["Parent outcome"] --> Handoff["Scope, budget, context"]`; `Handoff --> Child["Bounded child work"]`; `Child --> Return["Explicit return contract"]` | 20-28 | Identical fenced mermaid block including `config: layout: elk` fence. | Byte-equal (script check 12). |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Establishes fit for preparing a bounded child handoff without transferring authority implicitly; grants no tools, permissions, or authority.` | Derived from Purpose (585) plus line-107 fit framing; grants no tools or authority. Fit/no-grant phrases are line-107-derived additions — flagged for human adjudication (pilot pattern). |
| 7 | — | — | 6/10/14/18 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Plan-decided artifact form; the draft uses bold labels. |

Static check results: `candidate/evidence/full-flow-delegating-bounded-work-checks.txt` (12 pass, 0 fail; 930 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file). File ended with a newline as produced (no integration adjustment).

## Items flagged for human adjudication

1. Description wording — line-107-derived additions (pilot pattern).
2. Heading-level variance across realizations (pilot residual risk 2).

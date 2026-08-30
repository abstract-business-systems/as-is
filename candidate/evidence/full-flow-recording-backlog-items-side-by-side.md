# Side-by-side fidelity evidence — `recording-backlog-items` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 541-560. Realization: `candidate/skills/reusable/recording-backlog-items/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 541 | `### \`recording-backlog-items\`` | 2 + directory | `name: recording-backlog-items`, `candidate/skills/reusable/recording-backlog-items/` | Exact name and directory (check 2). |
| 2 | 543 | **Purpose**: Prepare bounded backlog proposals for the owning backlog procedure. | 8 | Identical. | Verbatim. |
| 3 | 545 | **Approach**: Define one outcome, scope, acceptance, dependencies, preferences, and residual notes without selecting or claiming the work. | 12 | Identical. | Verbatim. |
| 4 | 547 | **How it should be done**: Write one uniquely named item with purpose, description, owner, scope, acceptance, dependencies, user/system preferences, and notes; use fully qualified dependencies; leave status selection and completion to backlog authority. | 16 | Identical. | Verbatim; the eight required item fields, the fully-qualified-dependencies rule, and the no-authority rule ("leave status selection and completion to backlog authority") carried verbatim. No How-line "stop ..." clause exists, so no terminal-stop step was added. |
| 5 | 549-560 | #### Design view + Mermaid block: `Proposal["Approved planning input"] --> Scope["Bounded outcome and owner"]`; `Scope --> Row["Backlog item"]`; `Row --> Review["Selection by backlog authority"]` | 20-28 | Identical fenced mermaid block including `config: layout: elk` fence. | Byte-equal (script check 12). |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Establishes fit for preparing bounded backlog proposals for the owning backlog procedure; grants no tools, permissions, or authority.` | Derived from Purpose (543) plus line-107 fit framing; grants no tools or authority. Fit/no-grant phrases are line-107-derived additions — flagged for human adjudication (pilot pattern). |
| 7 | — | — | 6/10/14/18 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Plan-decided artifact form; the draft uses bold labels. |

Static check results: `candidate/evidence/full-flow-recording-backlog-items-checks.txt` (12 pass, 0 fail; 1,004 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file). File ended with a newline as produced (no integration adjustment).

## Items flagged for human adjudication

1. Description wording — line-107-derived additions (pilot pattern).
2. Heading-level variance across realizations (pilot residual risk 2).

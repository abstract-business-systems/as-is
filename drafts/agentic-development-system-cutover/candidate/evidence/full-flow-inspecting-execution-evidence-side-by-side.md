# Side-by-side fidelity evidence — `inspecting-execution-evidence` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 499-518. Realization: `candidate/skills/reusable/inspecting-execution-evidence/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 499 | `### \`inspecting-execution-evidence\`` | 2 + directory | `name: inspecting-execution-evidence`, `candidate/skills/reusable/inspecting-execution-evidence/` | Exact name and directory (check 2). |
| 2 | 501 | **Purpose**: Investigate bounded traces, sessions, or execution results. | 8 | Identical. | Verbatim. |
| 3 | 503 | **Approach**: Read only the authorized evidence surface, correlate bounded events, and distinguish observations from inferred causes or authority. | 12 | Identical. | Verbatim. |
| 4 | 505 | **How it should be done**: Require an exact selector and focused question; read the smallest bounded trace or session slice; correlate event names and timing; report observed facts, hypotheses, unknowns, and freshness; never use evidence to authorize work or completion. | 16 | Identical. | Verbatim; the exact-selector requirement, bounded-slice reading, observation/hypothesis/unknown/freshness reporting, and the terminal no-authority rule ("never use evidence to authorize work or completion") carried verbatim. No How-line "stop ..." clause exists, so no terminal-stop step was added. |
| 5 | 507-518 | #### Design view + Mermaid block: `Question["Focused evidence question"] --> Selector["Bounded trace or session"]`; `Selector --> Correlate["Correlate observations"]`; `Correlate --> Finding["Finding with uncertainty"]` | 20-28 | Identical fenced mermaid block including `config: layout: elk` fence. | Byte-equal (script check 12). |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Establishes fit for investigating bounded traces, sessions, or execution results; grants no tools, permissions, or authority.` | Derived from Purpose (501) plus line-107 fit framing; grants no tools or authority. Fit/no-grant phrases are line-107-derived additions — flagged for human adjudication (pilot pattern). |
| 7 | — | — | 6/10/14/18 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Plan-decided artifact form; the draft uses bold labels. |

Static check results: `candidate/evidence/full-flow-inspecting-execution-evidence-checks.txt` (12 pass, 0 fail; 952 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file). File ended with a newline as produced (no integration adjustment).

## Items flagged for human adjudication

1. Description wording — line-107-derived additions (pilot pattern).
2. Heading-level variance across realizations (pilot residual risk 2).

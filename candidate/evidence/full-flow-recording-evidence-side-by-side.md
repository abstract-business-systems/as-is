# Side-by-side fidelity evidence — `recording-evidence` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 436-455. Realization: `candidate/skills/reusable/recording-evidence/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 436 | `### \`recording-evidence\`` | 2 + directory | `name: recording-evidence`, `candidate/skills/reusable/recording-evidence/` | Exact name and directory (check 2). |
| 2 | 438 | **Purpose**: Preserve observations, provenance, assumptions, and validation results. | 8 | Identical. | Verbatim. |
| 3 | 440 | **Approach**: Capture concise, reproducible evidence with its source, interpretation, uncertainty, and relationship to the authorized decision. | 12 | Identical. | Verbatim. |
| 4 | 442 | **How it should be done**: Record selector, source, timestamp or revision, command or observation, result, interpretation, and limitation; keep secrets and unbounded payloads out; link evidence to the requirement without granting it authority. | 16 | Identical. | Verbatim; the seven record fields, the secrets/unbounded-payload exclusion, and the no-authority-grant linkage rule carried verbatim. No How-line stop clause exists, so no terminal-stop step was added. |
| 5 | 442-455 | #### Design view + Mermaid block: `Observation["Bounded observation"] --> Provenance["Source and freshness"]`; `Provenance --> Record["Concise evidence"]`; `Record --> Limits["Interpretation and limits"]` | 20-28 | Identical fenced mermaid block including `config: layout: elk` fence. | Byte-equal (script check 12). |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Establishes fit for preserving observations, provenance, assumptions, and validation results; grants no tools, permissions, or authority.` | Derived from Purpose (438) plus line-107 fit framing; grants no tools or authority. Fit/no-grant phrases are line-107-derived additions — flagged for human adjudication (pilot pattern). |
| 7 | — | — | 6/10/14/18 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Plan-decided artifact form; the draft uses bold labels. |

Static check results: `candidate/evidence/full-flow-recording-evidence-checks.txt` (12 pass, 0 fail; 968 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file). File ended with a newline as produced (no integration adjustment).

## Items flagged for human adjudication

1. Description wording — line-107-derived additions (pilot pattern).
2. Heading-level variance across realizations (pilot residual risk 2).

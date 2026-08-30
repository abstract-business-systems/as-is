# Side-by-side fidelity evidence — `running-tests` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 394-413. Realization: `candidate/skills/reusable/running-tests/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 394 | `### \`running-tests\`` | 2 + directory | `name: running-tests`, `candidate/skills/reusable/running-tests/` | Exact name and directory (check 2). |
| 2 | 396 | **Purpose**: Run the smallest relevant test or check and return observations. | 8 | Identical. | Verbatim. |
| 3 | 398 | **Approach**: Select checks from the changed behavior and acceptance conditions, execute them without broadening scope, and report results and limitations. | 12 | Identical. | Verbatim. |
| 4 | 400 | **How it should be done**: Map changed artifacts to existing focused checks; run the narrowest applicable command; capture pass, failure, skip, timeout, and environment status; do not reinterpret process exit as completion; recommend the next bounded check when evidence is insufficient. | 16 | Identical. | Verbatim; the no-completion-claim rule ("do not reinterpret process exit as completion") and the insufficient-evidence recommendation rule carried verbatim. No How-line stop clause exists, so no terminal-stop step was added. |
| 5 | 402-413 | #### Design view + Mermaid block: `Change["Changed behavior"] --> Check["Smallest relevant check"]`; `Check --> Observation["Observed result"]`; `Observation --> Limits["Limits and next check"]` | 20-28 | Identical fenced mermaid block including `config: layout: elk` fence. | Byte-equal (script check 12). |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Establishes fit for running the smallest relevant test or check and returning observations; grants no tools, permissions, or authority.` | Derived from Purpose (396) plus line-107 fit framing; grants no tools or authority. Fit/no-grant phrases are line-107-derived additions — flagged for human adjudication (pilot pattern). |
| 7 | — | — | 6/10/14/18 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Plan-decided artifact form; the draft uses bold labels. |

Static check results: `candidate/evidence/full-flow-running-tests-checks.txt` (12 pass, 0 fail; 959 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file). File ended with a newline as produced (no integration adjustment).

## Items flagged for human adjudication

1. Description wording — line-107-derived additions (pilot pattern).
2. Heading-level variance across realizations (pilot residual risk 2).

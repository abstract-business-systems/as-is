# Side-by-side fidelity evidence — `validating-changes` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 415-434. Realization: `candidate/skills/reusable/validating-changes/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 415 | `### \`validating-changes\`` | 2 + directory | `name: validating-changes`, `candidate/skills/reusable/validating-changes/` | Exact name and directory (check 2). |
| 2 | 417 | **Purpose**: Map observable evidence to acceptance conditions and residual risk. | 8 | Identical. | Verbatim. |
| 3 | 419 | **Approach**: Compare collected evidence with each acceptance condition, distinguish pass from unsupported claims, and record remaining risk. | 12 | Identical. | Verbatim. |
| 4 | 421 | **How it should be done**: Create an acceptance-to-evidence matrix; inspect the actual diff and test results; mark each condition passed, failed, blocked, or untested; separate observations from inferences; record residual risk, recovery, and commit readiness. | 16 | Identical. | Verbatim; the four-value outcome semantics (passed/failed/blocked/untested), the observation/inference separation, and the residual-risk/recovery/commit-readiness record all carried verbatim. No How-line stop clause exists, so no terminal-stop step was added. |
| 5 | 423-434 | #### Design view + Mermaid block: `Acceptance["Acceptance conditions"] --> Evidence["Collected evidence"]`; `Evidence --> Matrix["Condition mapping"]`; `Matrix --> Result["Validation result and risk"]` | 20-28 | Identical fenced mermaid block including `config: layout: elk` fence. | Byte-equal (script check 12). |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Establishes fit for mapping observable evidence to acceptance conditions and residual risk; grants no tools, permissions, or authority.` | Derived from Purpose (417) plus line-107 fit framing; grants no tools or authority. Fit/no-grant phrases are line-107-derived additions — flagged for human adjudication (pilot pattern). |
| 7 | — | — | 6/10/14/18 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Plan-decided artifact form; the draft uses bold labels. |

Static check results: `candidate/evidence/full-flow-validating-changes-checks.txt` (12 pass, 0 fail; 958 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file). File ended with a newline as produced (no integration adjustment).

## Items flagged for human adjudication

1. Description wording — line-107-derived additions (pilot pattern).
2. Heading-level variance across realizations (pilot residual risk 2).

# Side-by-side fidelity evidence — `observing-delegated-work` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 604-623. Realization: `candidate/skills/reusable/observing-delegated-work/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 604 | `### \`observing-delegated-work\`` | 2 + directory | `name: observing-delegated-work`, `candidate/skills/reusable/observing-delegated-work/` | Exact name and directory (check 2). |
| 2 | 606 | **Purpose**: Observe delegated progress, results, budgets, and terminal status. | 8 | Identical. | Verbatim. |
| 3 | 608 | **Approach**: Read approved progress and evidence surfaces incrementally, report blockers and outcomes, and avoid directing work outside granted authority. | 12 | Identical. | Verbatim. |
| 4 | 610 | **How it should be done**: Use the approved handle, task record, logs, traces, or session selectors; read incrementally; compare progress with acceptance and budget; classify running, blocked, failed, or terminal; preserve the worker's scope and do not infer completion. | 16 | Identical. | Verbatim; the approved-surface rule, incremental reading, acceptance/budget comparison, the four-state classification (running/blocked/failed/terminal), the worker-scope preservation, and the no-inferred-completion rule carried verbatim. No How-line "stop ..." clause exists, so no terminal-stop step was added. |
| 5 | 612-623 | #### Design view + Mermaid block: `Handoff["Approved delegation"] --> Observe["Read progress and evidence"]`; `Observe --> Classify["Running, blocked, or terminal"]`; `Classify --> Report["Observation report"]` | 20-28 | Identical fenced mermaid block including `config: layout: elk` fence. | Byte-equal (script check 12). |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Establishes fit for observing delegated progress, results, budgets, and terminal status; grants no tools, permissions, or authority.` | Derived from Purpose (606) plus line-107 fit framing; grants no tools or authority. Fit/no-grant phrases are line-107-derived additions — flagged for human adjudication (pilot pattern). |
| 7 | — | — | 6/10/14/18 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Plan-decided artifact form; the draft uses bold labels. |

Static check results: `candidate/evidence/full-flow-observing-delegated-work-checks.txt` (12 pass, 0 fail; 965 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file). File ended with a newline as produced (no integration adjustment).

## Items flagged for human adjudication

1. Description wording — line-107-derived additions (pilot pattern).
2. Heading-level variance across realizations (pilot residual risk 2).

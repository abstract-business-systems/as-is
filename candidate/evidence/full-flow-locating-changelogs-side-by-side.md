# Side-by-side fidelity evidence — `locating-changelogs` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 247-266. Realization: `candidate/skills/reusable/locating-changelogs/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 247 | `### \`locating-changelogs\`` | 2 + directory | `name: locating-changelogs`, `candidate/skills/reusable/locating-changelogs/` | Exact name and directory (check 2). |
| 2 | 249 | **Purpose**: Resolve the changelogs owned by the target scopes. | 8 | Identical. | Verbatim. |
| 3 | 251 | **Approach**: Use explicit ownership records and applicable history contracts before considering repository conventions; never select by proximity alone. | 12 | Identical. | Verbatim; "never select by proximity alone" carried as a selection rule, not a preference (plan section 5 rule). |
| 4 | 253 | **How it should be done**: Read the task, component, project, or root history contract; resolve configured filenames and owning records; determine whether history is required; return the exact path and rationale, or explicitly record that no history is required. | 16 | Identical. | Verbatim; ordering preserved (contract first → resolve → determine requirement → exact path+rationale or explicit no-history). The dual outcome ("return the exact path …, **or** explicitly record that no history is required") is outcome semantics carried verbatim; no How-line stop clause exists, so no terminal-stop step was added. |
| 5 | 255-266 | #### Design view + Mermaid block: `Work["Bounded work"] --> Contract["Read history contract"]`; `Contract -->|history required| Changelog["Owning changelog"]`; `Contract -->|not required| None["No history required"]` | 20-30 | Identical fenced mermaid block including `config: layout: elk` fence. | Byte-equal (script check 12). |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Use when bounded work must resolve the changelogs owned by its target scopes; establishes fit only and grants no tools or authority.` | Derived from Purpose (249) plus line-107 fit framing; grants no tools or authority. Fit/no-grant phrases are line-107-derived additions — flagged for human adjudication (pilot pattern). Note the "Use when…" openers differ from the pilot's "Establishes fit for…" pattern; both read as fit statements. |
| 7 | — | — | 6/10/14/18 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Plan-decided artifact form; the draft uses bold labels. |

Static check results: `candidate/evidence/full-flow-locating-changelogs-checks.txt` (12 pass, 0 fail; 923 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file).

## Implementer integration adjustments (recorded)

1. Added the missing trailing newline (worker omission; content unchanged — recurring worker gap, recorded per skill).

## Items flagged for human adjudication

1. Description wording — line-107-derived additions; also note the fit-phrase style varies across realizations ("Establishes fit for…" vs "Use when…"); consistency is a human adjudication item.
2. Heading-level variance across realizations (pilot residual risk 2).

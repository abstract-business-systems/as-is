# Side-by-side fidelity evidence — `resolving-scopes` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 204-224. Realization: `candidate/skills/reusable/resolving-scopes/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 204 | `### \`resolving-scopes\`` | 2 + directory | `name: resolving-scopes`, `candidate/skills/reusable/resolving-scopes/` | Exact name and directory (check 2). |
| 2 | 206 | **Purpose**: Resolve component, artifact, project, or root scopes without assuming a component task. | 8 | Identical. | Verbatim. |
| 3 | 208 | **Approach**: Classify the requested change, locate the smallest owning scope, and stop for explicit direction when ownership or task applicability is ambiguous. | 12 | Identical. | Verbatim; stop clause carried as a terminal stop-for-direction step (plan section 5 rule). No clarifier sentence appended (worker choice); see adjudication flag 2. |
| 4 | 210 | **How it should be done**: Identify the requested outcome and changed artifact; inspect component records and ownership contracts; test component-task applicability; choose component, artifact, project, or root scope; record the decision; stop on competing owners or missing policy. | 16 | Identical. | Verbatim; ordering preserved (inspect → test applicability → choose → record → stop); "stop on competing owners or missing policy" terminal (plan section 5 rule). |
| 5 | 212-224 | #### Design view + Mermaid block: `Request["Requested change"] --> Classify["Classify scope"]`; `Classify --> Owner["Smallest owning scope"]`; `Owner -->|clear| Decision["Scope decision"]`; `Owner -->|ambiguous| Stop["Stop for direction"]` | 20-30 | Identical fenced mermaid block including `config: layout: elk` fence. | Byte-equal (script check 12). The draft's own labeled `ambiguous → Stop for direction` branch is the design-view warrant for the terminal-stop reading. |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Resolves component, artifact, project, or root scopes for a requested change without assuming a component task; establishes fit only and grants no tools or authority.` | Derived from Purpose (206) plus line-107 fit framing; grants no tools or authority. The fit/no-grant phrases are line-107-derived additions — flagged for human adjudication (pilot pattern). |
| 7 | — | — | 6/10/14/18 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Plan-decided artifact form; the draft uses bold labels. |

Static check results: `candidate/evidence/full-flow-resolving-scopes-checks.txt` (12 pass, 0 fail; 1,043 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file).

## Implementer integration adjustments (recorded)

1. Added the missing trailing newline (worker omission; content unchanged — pilot residual-risk 3 pattern).
2. Normalized `#` section headings to `##` to match the pilot-validated section convention (content unchanged); recorded as a cosmetic deviation from the worker's raw output.

## Items flagged for human adjudication

1. Description wording — line-107-derived additions (pilot pattern).
2. **Cross-realization inconsistency on stop-clause clarifiers**: the pilot's `applying-bounded-edits` realization appended an explicit terminal-stop clarifier sentence; this realization carries stop clauses verbatim with no clarifier, relying on the draft's own "Stop for direction" design-view branch. Both satisfy the plan's terminal-stop interpretation on the walker evidence; consistency across the catalog is a human adjudication item (see also `building-context` flag 2).
3. Heading-level variance across realizations (pilot residual risk 2).

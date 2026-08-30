# Side-by-side fidelity evidence — `building-context` (stage 1, full-flow)

Full-flow realization plan (user-accepted) stage 1. Fidelity source: `drafts/composable-skills.md` lines 182-202. Realization: `candidate/skills/reusable/building-context/SKILL.md`. For human clause-by-clause review (plan section 9, check 11). One bounded worker attempt; integrated and validated by the implementer.

| # | Draft line(s) | Draft text (verbatim) | Realized SKILL.md line(s) | Realized text | Fidelity note |
| --- | --- | --- | --- | --- | --- |
| 1 | 182 | `### \`building-context\`` | 2 + directory | `name: building-context`, `candidate/skills/reusable/building-context/` | Exact name and directory (check 2). |
| 2 | 184 | **Purpose**: Assemble the smallest authoritative context for a bounded decision or handoff. | 8 | Identical. | Verbatim. |
| 3 | 186 | **Approach**: Identify the decision, gather authoritative records and direct evidence, and stop when the context is sufficient without widening scope. | 12 | Identical. | Verbatim. The Approach line's sufficiency stop ("stop when the context is sufficient") is carried verbatim; the plan's terminal-stop interpretation rule is scoped to How-line stop clauses, and this How line (188) contains none. **Flagged for adjudication**: if the user reads the terminal-stop rule as covering any "stop ..." clause regardless of section, a clarifier sentence would need to be added; on the plan's literal wording (How-line stops) the realization is faithful as written. The worker raised the same question independently. |
| 4 | 188 | **How it should be done**: State the question and stopping condition; read the owning record, applicable contract, acceptance conditions, and named dependencies; label facts, assumptions, and unknowns; preserve source links; escalate conflicts instead of filling gaps from proximity. | 16 | Identical. | Verbatim; "escalate conflicts instead of filling gaps from proximity" carried as escalation behavior (plan section 5 cross-cutting rule), consistent with the draft's own Escalation branch (line 201). |
| 5 | 190-202 | #### Design view + Mermaid block: `Question["Bounded question"] --> Sources["Authoritative sources"]`; `Sources --> Context["Provenance-bearing context"]`; `Context -->|sufficient| Handoff["Decision handoff"]`; `Context -->|conflict or gap| Escalate["Escalation"]` | 20-30 | Identical fenced mermaid block including `config: layout: elk` fence. | Byte-equal (script check 12). |
| 6 | 107 | "Skill descriptions would establish fit, not permission." | 3 | `description: Establishes fit for assembling the smallest authoritative context for a bounded decision or handoff; grants no tools, permissions, or authority.` | Derived from Purpose (184) plus line-107 fit-not-permission framing; grants no tools or authority. The "grants no tools, permissions, or authority" phrase is a line-107-derived addition — flagged for human adjudication (pilot pattern). |
| 7 | — | — | 6/10/14/18 | `## Purpose` / `## Approach` / `## How it should be done` / `## Design view` headings | Section structure is the plan-decided artifact form (plan section 4); the draft uses bold labels. Cosmetic; flagged per pilot residual risk 2 (heading levels vary across realizations). |

Static check results: `candidate/evidence/full-flow-building-context-checks.txt` (12 pass, 0 fail; 1,027 characters vs 2,000-character voluntary target, draft line 132). Isolation: fixture contained only this skill's directory (listing in the checks file).

## Items flagged for human adjudication

1. Description wording ("Establishes fit for…; grants no tools, permissions, or authority") — line-107-derived additions (pilot pattern; see pilot residual risk 1).
2. Approach-line sufficiency stop carried verbatim without a terminal-stop clarifier (no How-line stop clause exists) — see row 3 note.
3. Heading levels (`##` body sections) differ from the draft's bold-label form; plan prescribes only the `#### Design view` convention loosely.

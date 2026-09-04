# F5 Runtime-Tooling Gate — Planning-Adviser Review (verbatim)

- Date: 2026-09-01
- Job: `j-mtj4crhp-eac7gv` (task: f5-runtime-gate-adviser), local session `a472e6ba-9ac9-4b37-b38b-91b94727de90`
- Agent: `candidate/agents/planning-adviser/agent.md`, thinking high, budget $1.50 / 900s (used ~128s wall)
- Task: adjudicate F5 records/backlog family runtime-tooling treatment (validator scripts, extension imports, configuration.md core reference, vocabulary rows, narrative repoints, open backlog item disposition)
- Verdict: **HOLD** (explicit human authorization required for two items, per the adviser's authority boundaries)

---

1. **Q1 — Conditional yes, with correction.** Apply the A4 runtime/tooling-only pattern by analogy: retain `content-test.ts`, `scripts/`, `query.ts`, `query.test.ts`, `rendered-navigation.ts`, and its test at their current paths. Record their adopted owners outside the retired namespaces. However, first refactor `content-test.ts`: it currently reads its own retiring `SKILL.md`, `as-is.md`, `backlog.md`, and `diagram-examples.md`, not only the Mermaid records. Retire those narrative files only after all required reads and assertions are repointed or deliberately replaced. Treat remaining old-name path matches as classified runtime references, not dangling skill definitions. Moving these paths requires a preservation-aware, separately human-authorized rename. Because A4 expressly authorizes only F6, the equivalent F5 runtime-home designation needs explicit human authorization.

2. **Q2 — Separate human authorization required.** The one-line `core/contracts/configuration.md` repoint is semantically supported by the adopted records skill, but that file is outside the enumerated A12 standing authorization. The adviser cannot extend that authority. Obtain a narrow authorization covering only this live name repoint, then include it with the F5 vocabulary changes in one separate, family-scoped `core/` reconciliation commit preceding F5.

3. **Q3 — Confirmed: remove both rows.** Since the adopted records and Mermaid consumers use none of the claimed anchors, remove architecture-vocabulary consumer rows 72–73 rather than repointing them. Do not add weaker or unsupported replacement rows. Preserve the unaffected Core Contracts row.

4. **Q4 — Confirmed, but the stated repoint is insufficient alone.** Repoint the Mermaid reads to `skills/master/designing-mermaid-diagrams/{SKILL.md,as-is.md}` and replace baseline-only phrase assertions with assertions supported by the adopted text. Preserve renderer and repository-navigation behavior checks. Also reconcile every self-relative read of retiring managing-as-is-document artifacts; otherwise deleting its narrative surface makes the validator fail before Mermaid validation runs. Do not add obsolete baseline prose to the adopted skill merely to satisfy old assertions.

5. **Q5 — Confirmed.** Repoint:
   - root `AGENTS.md` authority guidance to `skills/master/managing-as-is-records/SKILL.md`;
   - `skills/AGENTS.md` routing to the adopted records master and its Mermaid composition note to `master/designing-mermaid-diagrams`;
   - `agents/as-is/as-is-record-structure.md` to the adopted records authority.
   
   Update names and surrounding claims where necessary, not merely paths. Preserve `agents/component-builder/agent.md`’s `orient.ts` reference as an intentional runtime-home reference unless a separately authorized move occurs.

6. **Q6 — Reconcile the open proposal; capability absorption alone is insufficient.** Direct evidence shows an equivalent open parent item, `skills:maintaining-components-audit`, already exists in `skills/backlog.md`. The preferred bounded treatment is to combine/remove the child `skills/maintaining-components:repository-structure-audit` only in favor of that explicit surviving equivalent, preserving the child identity and migration rationale in notes and recording the F5 disposition in `skills/changelog.md`. The survivor must remain open; this is reconciliation, not completion. If that parent item is not accepted as the survivor and owner, re-home the row to an adopted-component backlog instead. Do not silently drop it merely because the adopted skill provides the capability.

7. **Q7 — Additional gates and residual risks.**
   - Obtain explicit human authorization for both the F5 runtime-only homes and the additional `configuration.md` core edit.
   - Record exact runtime owners and intentional old-path references so the zero-dangling-reference gate distinguishes runtime paths, test fixtures, and history from retired skill definitions.
   - Run fresh discovery and collision checks for the same-name `maintaining-components` and `designing-mermaid-diagrams` swaps; retired definitions must disappear without duplicate-name warnings.
   - Validate extension loading, the evidence-validator focused suite, backlog query tests, renderer tests, the refactored dogfood content test, and the component-builder orientation path.
   - Preserve A13 transitional exclusions until F9 and verify they remain removable at F9.
   - Re-pin the catalog digest if any adopted `SKILL.md` changes; preferably record runtime ownership in component records rather than modifying approved operational contracts.
   - Record the semantic-coverage risk caused by replacing the detailed baseline records/Mermaid prose with thinner adopted contracts. Stop for human review if required repository policy cannot remain discoverable without changing the approved target.

VERDICT: HOLD

# Changelog

- 2026-08-15: Completed backlog item `route-as-is-updates-through-managing-skill`. Added the applicable skills instruction routing all `as-is.md` prose, link, structure, and Mermaid diagram changes through `managing-as-is-document`, while composing `designing-mermaid-diagrams` only for generic Mermaid mechanics. Existing records, component ownership, task authority, agent behavior, and runtime behavior are unchanged. Validation passed: local task-record validation (`VALID`), as-is/content navigation (46 records, 47 diagrams), backlog content validation, focused routing audit, JSON parsing, and `git diff --check`; final expert review marked the handoff safe to commit.

- 2026-08-15: Completed backlog item `bounded-directory-or-project-as-is-setup`. Confirmed `as-is-setup` supports whole-project setup by default and explicit directory-scoped setup as an independent target confined to that directory and descendants, with target-local instruction ownership, candidate approval, canonical instruction injection, and before/after boundary validation. Existing setup/integration contracts and runtime behavior are unchanged. Validation passed: local task-record validation (`VALID`), as-is/content navigation (46 records, 47 diagrams), backlog content validation, focused scope-mode audit, JSON parsing, and `git diff --check`; final expert review marked the handoff safe to commit.

- 2026-08-15: Completed backlog item `add-naming-guidance-to-as-is`. Confirmed naming guidance remains discoverable in the Skills catalog; `as-is-setup` and `managing-as-is-document` require local sibling/nearby convention inspection without an unnecessary direct naming-skill dependency, while integration retains its broader naming composition link. Existing naming, setup, record-management, and catalog contracts are unchanged. Validation passed: local task-record validation (`VALID`), as-is/content navigation (46 records, 47 diagrams), backlog content validation, focused naming audit, JSON parsing, and `git diff --check`; final expert review marked the handoff safe to commit.

- 2026-08-15: Completed backlog item `building-components-consolidation`. Added the planning-only comparison `skills/building-components-consolidation.md`. Current evidence supports retaining `building-components` as composition, `implementing-component-tasks` as task lifecycle and child-boundary procedure, and `maintaining-components` as evidence-based housekeeping; four alternatives and migration/consumer risks are recorded. No skill contract, agent, runtime, task protocol, or authority behavior changed. Validation passed: local task-record validation (`VALID`), as-is/content navigation (46 records, 47 diagrams), backlog content validation, focused comparison audit, JSON parsing, and `git diff --check`; final expert review marked the handoff safe to commit.

- 2026-08-15: Completed backlog item `migrate-as-is-guidance-owners`. Added one discoverable ownership map to `skills/as-is.md`: setup/adoption is owned by `as-is-setup` and `integrate-as-is-documentation`; durable as-is record structure and meaning by `managing-as-is-document`; and generic Mermaid mechanics by `designing-mermaid-diagrams`. The map preserves unresolved root-owned instruction and document-disposition work without duplicating procedures or changing runtime/authority behavior. Validation passed: local task-record validation (`VALID`), as-is/content navigation (46 records, 47 diagrams), backlog content validation, focused ownership-map audit, JSON parsing, and `git diff --check`; final expert review marked the handoff safe to commit.

- 2026-08-15: Completed backlog item `context-building-canonical-name`. Confirmed `skills/context-building/SKILL.md` as the sole canonical context-building skill authority, with matching front matter, durable record, and one `skills/as-is.md` catalog target. The existing contract and runtime behavior were unchanged. Validation passed: local task-record validation (`VALID`), as-is/content navigation (46 records, 47 diagrams), backlog content validation, canonical-name audit, JSON parsing, and `git diff --check`; final expert review marked the handoff safe to commit.

- 2026-08-15: Completed backlog item `as-is-setup-skill`. The canonical `skills/as-is-setup/SKILL.md` now provides the accepted existing-project setup procedure: distinct whole-project and directory-scoped modes, reviewable pre-write planning, semantic candidate review and human disposition, safe preservation, adopted component-boundary placement guidance, exact canonical-use instruction injection, and routing through `managing-as-is-document`. No setup implementation, host projection, target write, or runtime behavior changed; the child `components/as-is-setup` implementation record and backlog remained untouched. Validation passed: local task-record validation (`VALID`), as-is/content navigation (45 records, 46 diagrams), backlog content validation, focused acceptance audit, JSON parsing, and `git diff --check`.

- 2026-08-13: Completed backlog item `reconciling-as-is-records` by extending the existing `managing-as-is-document` skill with an optional target-neutral hierarchical record-reconciliation application mode. No standalone reconciling-as-is-records skill, agent, task executor, scheduler, or runtime behavior was created. The contract defines the parent evidence firewall and same-baseline post-order readiness; the identity-scoped backlog-cleanup safety change prevents unrelated rows from being removed. Focused validation passed for managing-as-is-document and managing-backlog content, backlog query tests (11 tests, 38 expectations), orientation tests (2 tests, 9 expectations), integration content, task-record validation (`VALID`), and `git diff --check`; the exact preflight reported only unrelated canonical rows, which remain untouched. Deep, cyclic, shared-child, concurrent, interrupted, and cross-project cases remain unproven.

- 2026-08-12: Completed `integrate-as-is-documentation`. Added the reusable skill, durable record, focused content validation, and linked catalog entry. The procedure now covers review-first semantic candidate identification, whole-project and directory-scoped boundaries, approved record creation, parent navigation, bounded diagrams, and validation. No external project was modified by the skill itself.

- 2026-08-22: Updated as-is setup and record management to inspect existing
  parent and sibling records for naming conventions instead of depending on a
  direct naming-skill link. The general naming skill remains available in the
  Skills catalog for broader naming work. Reduced parent container fill opacity
  to 10 percent and changed component boxes to no fill so the diagrams better
  align with the underlying theme while retaining visual separation.

- 2026-08-22: Added the naming-software-concepts component record and linked
  naming guidance from the Skills map, as-is setup, and as-is record
  management. Added examples for structural, context, scenario, data, state,
  decision, recovery, and journey diagrams. Replaced the indigo Mermaid styling
  with neutral slate-and-white styling. `git diff --check` and scoped link
  checks passed.

- 2026-08-22: Added the canonical `as-is-setup` skill for existing-project
  adoption, including semantic candidate review and root `AGENTS.md`
  canonical-use instruction injection. Updated the capability catalog and
  setup backlog. `git diff --check` passed.

- 2026-08-21: Completed backlog item `combine-as-is-record-skills`. Consolidated record lifecycle, stable structure, hierarchy, explicit context links, diagram decisions, validation, and changelog handoff into the canonical `managing-as-is-document` skill; migrated repository references and removed the superseded record-structuring skill component. Focused backlog/orientation tests and `git diff --check` passed; Mermaid rendering remains untested because no repository renderer is configured.

- 2026-08-20: Completed backlog item `align-skill-directories-with-frontmatter-names`. Renamed the two implemented skill component directories to match their `SKILL.md` frontmatter names, updated repository links, catalogs, scripts, tests, backlog dependencies, and historical references, and preserved all component artifacts. Focused validation and `git diff --check` passed; no runtime behavior changed.

- 2026-08-15: Completed backlog item `functional-context-design-diagrams`. Added the reusable `designing-mermaid-diagrams` skill with bounded inputs, functional-versus-technical context rules, context-map and outcome-flow templates, output requirements, validation checks, escalation boundaries, and durable component context. Linked it from the skills component record and the repository capability catalog. Focused content assertions and `git diff --check` passed; no runtime behavior changed.

- 2026-08-12: Moved the Pi host entrypoint from the `as-is` skill to `.pi/prompts/as-is.md`, which launches `agents/as-is/agent.md` directly through the generic launcher. Removed the skill from project settings and retained its file only as a deprecated compatibility alias. Updated the launcher handoff fixture to mutate an actual orientation script rather than the deprecated alias; focused launcher and routing tests passed.

- Completed `tool-contract-and-completion-gates`: tightened the reusable task
  implementation procedure so acceptance validation and terminal descendant
  closure precede changelog handoff, transient task cleanup, and scoped commit.
  The change was validated with the focused launcher checks and a fresh
  read-only expert gate; no runtime authority was changed.

- 2026-08-11: Renamed and broadened the execution-evidence skill to cover bounded trace queries and metadata-only Pi session analysis. It filters unsafe results, separates observations from inferences and sources, and preserves task/control-plane authority. Structural checks and fresh expert validation passed; no raw session content became trace payload.
- 2026-08-04: Added the skills-component backlog and aligned the four approved root concepts—deterministic-skills, presentation-guidance, building-components, and as-is-routed-current-session-delegation—with corrected bounded outcomes, dependencies, acceptance conditions, and open status. No backlog item was implemented.
- 2026-08-06: Added `building-components/SKILL.md`, a reusable bounded component build and handoff procedure preserving task-record authority, configured-agent delegation boundaries, expert gates, validation evidence, recovery, and scoped commits. Plan review passed; final expert review initially caught and then approved correction of the component-builder link. `git diff --check` and staged diff checks passed. Safe to commit; no runtime behavior changed.

## 2026-08-15 — Legacy record migration

- **Component:** Skills.
- **Result:** Completed the skills-scope documentation record and authority rule.
- **Validation retained:** Root integration should validate task-record structure, links, naming, and `git diff --check`. No runtime behavior is changed.
- **Record migration:** Removed completed transient task narrative from `as-is.md`; Git history retains the original detailed evidence.

- 2026-08-15: Completed backlog item `deterministic-skills`. Added the bounded advisory `skills/deterministic-skills` procedure and durable record for evidence-supported deterministic improvements while preserving intentional generative work. It composes maintenance, execution-evidence, verification, and backlog procedures without duplicating their authority and does not mutate runtime, agents, tools, modules, task records, or backlog state. Validation passed: local task-record validation (`VALID`), as-is/content navigation (46 records, 47 diagrams), backlog content validation, focused contract audit, JSON parsing, and `git diff --check`; final expert review marked the handoff safe to commit.

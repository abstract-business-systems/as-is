---
name: as-is-setup
description: Initializes canonical as-is documentation in an existing project and records the approved component map.
---

# Setting Up As-Is Documentation

Use this skill when introducing the `as-is` documentation convention into an
existing project. It establishes the root record, identifies semantically
meaningful component candidates, and routes individual record creation through
[`managing-as-is-document`](../managing-as-is-document/SKILL.md). It aligns
proposed names with the target parent's existing sibling records and nearby
project conventions. It is a setup procedure, not the ongoing maintenance
procedure for individual records.

## Inputs

- An existing project root or an explicitly bounded project directory.
- The project's root instruction file, if one exists, and applicable architecture
  or documentation conventions.
- A human-approved or reviewable request to introduce `as-is` documentation.

## Authority and safety

- Preserve existing project content, instructions, and architecture records.
- Produce a reviewable setup plan before writes.
- Do not turn every directory, class, or module into a component.
- Candidate decomposition remains subject to human architectural approval.
- The resulting `as-is.md` records are architecture context, not task,
  backlog, configuration, or runtime authorities.
- Inspect the target parent's existing sibling records and nearby project
  artifacts before proposing component names, record paths, or diagram labels.
  Align with established local vocabulary unless semantic evidence supports a
  deviation. Use lowercase kebab-case for repository paths, preserve
  host-required filenames, and use the actual component name followed by
  ` - as-is` only in record titles.

## Procedure

1. Identify the project root and the applicable root instruction file. Prefer
   `AGENTS.md`; use an established equivalent only when the project already
   defines one. If no suitable file exists, create a root `AGENTS.md` containing
   the required canonical-use instruction, preserving any other setup content.
2. Inspect existing project guidance and produce a dry-run plan naming the
   proposed root record, candidate components, record paths, links, and any
   files that would be changed. Do not infer candidates from directory names
   alone.
3. Identify candidate components from semantic evidence: a distinct
   responsibility, ownership or authority boundary, stable collaboration,
   meaningful lifecycle or failure behavior, consequential relationship, or
   enough independent change/testing/operational complexity to justify
   progressive disclosure. Inspect the target parent's existing sibling
   records and nearby artifacts as naming evidence. Record confidence and
   unresolved assumptions. Name each candidate with the narrowest clear
   responsibility-bearing term; align with established sibling vocabulary
   unless there is a documented reason to depart, and do not use generic
   fillers or directory names that hide the concept.
4. Obtain human confirmation to accept, merge, rename, reject, or defer each
   candidate. The setup procedure may create records only for the approved
   decomposition.
5. Add or update the root `as-is.md` and approved component records using the
   strict title form `# <component-name> - as-is`. The root component name is
   the project's actual as-is component name, normally `as-is`, not a display
   label such as `Project`.
6. Add this single canonical-architecture instruction to the project's root
   `AGENTS.md` or established equivalent, idempotently and without replacing
   existing guidance:

   `- The relevant as-is.md record is the canonical representation of its component's purpose, design, relationships, and navigational context; use it as the authoritative architecture context for that component.`

7. Link the setup result to the record-management skill and validate record
   headings, component links, diagram links, Mermaid syntax where present, and
   `git diff --check`.

## Outputs

- A reviewable setup plan with candidate evidence, names, paths, confidence,
  assumptions, and human dispositions.
- An approved root `as-is.md` record and approved component records, when setup
  writes are authorized.
- One canonical-use instruction in the root instruction file.
- Resolving links from the root map to component `as-is.md#design` sections.

## Checks

- A reviewable plan exists before setup writes.
- The root instruction file contains the canonical `as-is.md` architecture
  statement exactly once.
- Every created record uses `# <component-name> - as-is`.
- Candidate names align with established sibling vocabulary and repository
  grammar, or document why a different name is semantically necessary.
- Candidates have semantic evidence and human disposition.
- Parent/child diagrams, where applicable, follow the as-is record-management
  rules and child links target `as-is.md#design`.
- Existing content and unrelated instructions remain intact.
- Links, diagrams, and `git diff --check` pass.

## Stop and escalate

Stop before writing when the project root or applicable instruction owner is
ambiguous, candidate evidence supports multiple materially different
 decompositions, a proposed name obscures responsibility, required authority is
missing, or an existing record contradicts the proposed map. Ask for human
approval rather than silently choosing a component boundary or renaming an
existing concept.

## Existing-project integration

When the project adopts a `components/` layout, place approved initial records
under the corresponding component directories. This is a convention, not a
mechanical relocation rule: preserve an existing project layout when it is
clearer and safer. The existing [`components/as-is-setup`](../../components/as-is-setup/as-is.md)
component describes host/client resource wiring; it is implementation evidence
for setup concerns, not a replacement for this documentation-adoption skill.

## Links

- [`as-is.md`](as-is.md) — durable component context.
- [`../managing-as-is-document/SKILL.md`](../managing-as-is-document/SKILL.md) — individual record lifecycle and as-is-specific structure.
- [`../../AGENTS.md`](../../AGENTS.md) — this repository's root instruction file and dogfood target.

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
- The project's applicable instruction file, if one exists within the selected
  setup boundary, and applicable architecture or documentation conventions.
- A human-approved or reviewable request to introduce `as-is` documentation.

## Scope selection

Setup has two mutually exclusive modes. With no directory argument, use
**whole-project mode**: discover the project root from the request and use that
project root, its relevant descendants, and its root instruction file as the
setup boundary. With an explicit directory argument, use **directory-scoped
mode**: resolve that directory as the independent setup root and inspect or
modify only it and descendants that remain inside it. Do not discover, require,
or change the enclosing project root, its instruction file, sibling directories,
or any other path outside the selected boundary. A directory argument is a
scope override, not a request to set up the enclosing project.

The selected target is the project root in whole-project mode and the supplied
directory in directory-scoped mode. The target's root record is
`<target>/as-is.md`. The applicable instruction file is the target's `AGENTS.md`
or an established target-local equivalent; an enclosing instruction file is not
an input in directory-scoped mode. If no suitable target-local instruction file
exists, the plan may propose creating `<target>/AGENTS.md` within the boundary.
The effective component boundary is the selected target and its relevant
descendants, excluding every ancestor, sibling, and enclosing-project artifact.

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

1. Select the mode before discovery. In whole-project mode identify the project
   root and its applicable root instruction file. In directory-scoped mode
   resolve the supplied directory without searching or depending on its
   enclosing project, then identify only its target-local instruction file. If
   no suitable instruction file exists, include creation of the target's
   `AGENTS.md` in the plan rather than reading or changing a parent file.
2. Inspect guidance and produce a dry-run plan before writes. The plan must
   record the selected mode, target path, effective boundary, applicable
   instruction path and disposition, root `as-is.md` path and disposition,
   candidate paths, approved planned writes, and explicitly excluded
   out-of-scope paths. In directory-scoped mode, state that no parent project
   root or sibling path is required or changed. Do not infer candidates from
   directory names alone.
3. Identify candidate components only within the effective boundary from
   semantic evidence: a distinct responsibility, ownership or authority
   boundary, stable collaboration, meaningful lifecycle or failure behavior,
   consequential relationship, or enough independent change/testing/operational
   complexity to justify progressive disclosure. Inspect the target parent's
   existing sibling records and nearby artifacts as naming evidence. Record
   confidence and unresolved assumptions. Name each candidate with the
   narrowest clear responsibility-bearing term; align with established sibling
   vocabulary unless there is a documented reason to depart, and do not use
   generic fillers or directory names that hide the concept.
4. Obtain human confirmation to accept, merge, rename, reject, or defer each
   candidate. The setup procedure may create records only for the approved
   decomposition and only at paths inside the effective boundary.
5. Add or update the target root `as-is.md` and approved component records using
   the strict title form `# <component-name> - as-is`. In whole-project mode the
   root component name is the project's actual as-is component name, normally
   `as-is`, not a display label such as `Project`; in directory-scoped mode the
   selected directory is the independent root and its record must not require a
   parent record or update a parent map.
6. Add this single canonical-architecture instruction to the applicable target
   instruction file, idempotently and without replacing existing guidance:

   `- The relevant as-is.md record is the canonical representation of its component's purpose, design, relationships, and navigational context; use it as the authoritative architecture context for that component.`

   In directory-scoped mode this write is limited to the target-local
   instruction file; never inject the instruction into an enclosing project or
   sibling directory.

7. Link the setup result to the record-management skill and validate record
   headings, component links, diagram links, Mermaid syntax where present, and
   `git diff --check`. Snapshot candidate changed paths before and after the
   setup operation and reject the result if any changed path is outside the
   effective boundary; in directory-scoped mode explicitly verify that the
   enclosing project root and sibling directories are unchanged.

## Outputs

- A reviewable setup plan with mode, selected target, effective boundary,
  instruction and root-record dispositions, candidate evidence, names, paths,
  confidence, assumptions, planned writes, and excluded paths.
- An approved target-root `as-is.md` record and approved component records,
  when setup writes are authorized.
- One canonical-use instruction in the applicable target instruction file.
- Resolving links from the target root map to component `as-is.md#design`
  sections, without requiring a parent map in directory-scoped mode.

## Checks

- A reviewable plan exists before setup writes and names the selected mode,
  target, effective boundary, instruction path, root record, planned writes,
  and excluded paths.
- Whole-project mode uses the project root by default; directory-scoped mode
  uses the explicit directory as an independent root without requiring or
  changing its parent project or siblings.
- The applicable target instruction file contains the canonical `as-is.md`
  architecture statement exactly once.
- Every created record uses `# <component-name> - as-is`.
- Candidate names align with established sibling vocabulary and repository
  grammar, or document why a different name is semantically necessary.
- Candidates have semantic evidence and human disposition.
- Parent/child diagrams, where applicable, follow the as-is record-management
  rules and child links target `as-is.md#design`.
- Existing content and unrelated instructions remain intact.
- A before/after path comparison proves that writes remain inside the effective
  boundary; directory-scoped validation also proves parent and sibling paths are
  unchanged.
- Links, diagrams, and `git diff --check` pass.

## Stop and escalate

Stop before writing when the whole-project root or target-local instruction
owner is ambiguous, an explicit directory cannot be resolved, candidate evidence
supports multiple materially different decompositions, a proposed name obscures
responsibility, required authority is missing, or an existing record
contradicts the proposed map. Ask for human approval rather than silently
choosing a component boundary or renaming an existing concept. Do not resolve
directory-scoped ambiguity by consulting or modifying the enclosing project;
report the missing target-local context instead.

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

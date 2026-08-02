---
name: naming-software-concepts
description: Chooses and validates semantically accurate names for software concepts. Use when naming or renaming files, directories, skills, agents, APIs, configuration, or domain concepts.
---

# Naming Software Concepts

Choose names that reduce interpretation cost by accurately expressing the
concept, role, scope, and responsibility of an artifact.

## Method

1. Identify what the artifact is and the responsibility it owns.
2. Prefer an established de facto or de jure term when one accurately fits.
3. Select the narrowest clear name that remains accurate as the artifact grows.
4. Apply the artifact's grammar and host-required filename exceptions.
5. Check nearby names for collision, inconsistency, or an overloaded concept.
6. Explain a non-obvious name or departure from established terminology.

## Repository Grammar

- Repository-authored files and directories use lowercase kebab-case.
- Host- or ecosystem-mandated names are explicit exceptions, including
  `AGENTS.md` and OpenCode `SKILL.md`.
- Skills use capability phrases that read as real skills, such as
  `as-is-setup`, not function-like names such as `setup-as-is`.
- Agents use role names, such as `component-builder` and `reviewer`.
- Adapters identify their host, such as `opencode-adapter`.
- Documents name their subject, such as `docs/design-principles.md`.

## Quality Checks

- Do not use casing alone to resolve a semantic ambiguity.
- Avoid unexplained abbreviations unless they are established terminology.
- Avoid generic fillers such as `utils`, `misc`, `manager`, or numbered suffixes
  when a specific responsibility can be named.
- Prefer a valid established convention over a project-specific novelty unless a
  concrete project need justifies the exception.
- Rename references atomically when a name changes. Keep compatibility aliases
  only when an external consumer requires them.

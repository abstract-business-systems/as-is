---
name: building-components
description: Use when an authorized component task must be built with delegation, validation, history, and completion handoffs; establishes fit for this master skill and grants no tools or authority.
---

## Purpose

**Purpose**: Build bounded component tasks with delegation, validation, history, and completion handoffs while the receiving parent retains semantic integration and completion authority.

## Approach

**Approach**: Build context and the authorized task, stop at separately owned child boundaries, and compose configured delegation, implementation, validation, history, and completion.

The launcher supplies mechanical handoff and ancestry evidence, but the parent reviews and integrates child results.

## How it should be done

**How it should be done**: Read the component record and authorized task, obtain attributable plan review, and delegate only through configured workers. For every isolated child, require a committed, scoped, validated handoff; record the child source SHA and returned result SHA plus the integrated SHA; cherry-pick into the canonical parent worktree without overwriting unrelated work; handle only in-scope conflicts and record an out-of-scope conflict or missing evidence as a blocker; run parent-side validation and prove `git merge-base --is-ancestor <integrated-sha> HEAD`. Keep `pending-parent-integration` (pending integration) non-terminal, then perform descendant closure and consolidation of related results in one scoped integration commit. For parent-owned, same-component, or no-change work, record explicit `no-separate-integration`; never infer integration or completion from exit, telemetry, or a handle. Complete only with acceptance evidence, terminal descendants, accounted failed or cancelled descendants, history, cleanup, and the scoped handoff.
---
as-is-version: 2
task:
  status: completed
  worker: implementer
  updated: 2026-07-30T12:29:04Z
constraints:
  cost:
    currency: USD
    allocated: 0.20
    spent: 0.00
    reserve: 0.04
    source: unavailable
    fallback-metric: unavailable
  delegation:
    maximum-depth: 0
    maximum-children: 0
  execution:
    wall-clock:
      allocated-seconds: 300
      spent-seconds: 0
      reserve-seconds: 60
      source: unavailable
  external-effects: require-current-turn-user-approval
acceptance:
  - Add the missing durable task record for the existing `maintaining-components` skill.
  - Record the first concrete backlog: audit a user-specified component, or the full component set if later directed, for misalignments against repository-prescribed structure and conventions, then fix the confirmed misalignments.
  - Preserve separate Backlog and Changelog sections in this record.
  - Do not implement the audit or fixes in this turn.
  - Validate the new record and its internal links with the task-record validator and a diff check.
---

# Maintaining Components

## Purpose

Maintain the reusable `maintaining-components` skill as the durable backlog and
handoff record for evidence-based housekeeping work. This record captures the
current maintenance assignment without executing the audit itself.

## Requirement

Add the missing `skills/maintaining-components/as-is.md` record and preserve the
skill's existing ownership of maintenance backlogs. The first durable backlog
item is to audit a user-specified component, or the full component set if later
directed, for misalignments against repository-prescribed structure and
conventions, then fix only the confirmed misalignments. Examples of the target
misalignments include `as-is.md` files not matching the prescribed structure,
child or component names not following naming rules, stale ownership, and stale
links. Keep this as a bounded maintenance backlog; do not perform the audit or
fixes in this turn.

The user mentioned a couple of backlogs but only specified this first one. Do
not invent a second substantive backlog. If a second backlog is later needed,
record it only after clarification, unless repository conventions require a
clearly marked follow-up placeholder.

## Plan

1. Create the missing component task record under `skills/maintaining-components/`.
2. Capture the concrete backlog item in the Backlog section without starting the
   audit or fixes.
3. Preserve a separate Changelog section that notes the record creation and the
   unresolved second-backlog clarification.
4. Validate the new record structure and links with the repository task-record
   validator and a diff check.

## Progress

The missing record has been created for the existing `maintaining-components`
skill. The backlog now records the requested maintenance work: a future audit of
one specified component or the full component set for structural and convention
misalignments, followed by fixes only for confirmed issues. No audit or fix was
performed in this turn.

The second backlog item mentioned by the user remains unspecified and is not
invented here. If the user wants it recorded, it needs clarification first unless
a repository rule later requires a clearly marked placeholder.

## Validation

- `python3 schemas/task-record-validator/task_record_validator.py
  skills/maintaining-components` passes for this record.
- `git diff --check -- skills/maintaining-components/as-is.md` passes with no
  whitespace or patch-application errors.
- The record contains distinct Backlog and Changelog sections and uses only
  local relative references, so there are no external link targets to resolve in
  this component.

Residual risk: the backlog item is intentionally broad until a target component
or full-scope audit is specified, and the second backlog item remains pending
user clarification.

## Result

Completed. The `maintaining-components` skill now has a durable `as-is.md`
record with the requested backlog work captured and no audit/fix implementation
performed. The record preserves separate Backlog and Changelog sections and
keeps ownership with the existing skill.

## Blockers And Escalations

No blocker for the record-creation work. A second backlog item is not recorded
because the user did not specify it; clarification is needed before adding one.

## Recovery

Recover from this file, the existing `skills/maintaining-components/SKILL.md`,
and Git history. If the task is resumed, reread this record first and then add
only the clarified backlog item or proceed with the approved audit scope.

## Backlog

- Audit a user-specified component, or the full component set if later
directed, for misalignments against repository-prescribed structure and
conventions, and fix the confirmed misalignments.

## Changelog

- Created the missing `skills/maintaining-components/as-is.md` durable record.
- Preserved the existing skill ownership and recorded the first concrete
  maintenance backlog.
- Left the user's second backlog unspecified pending clarification instead of
  inventing an extra substantive item.

## Next Action

Await user clarification for any additional backlog item before recording it.

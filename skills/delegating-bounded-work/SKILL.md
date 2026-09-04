---
name: delegating-bounded-work
description: Use when a bounded child handoff must be prepared without transferring authority implicitly; establishes fit only and grants no tools or authority.
---

## Purpose

Prepare a bounded child handoff without transferring authority implicitly, while the parent retains task, budget, status, and ownership authority.

## Approach

Distinguish in-process `call_subagent` assistance within the same component from a separately owned child; verify the child's component boundary, configured worker, task revision, and absence of an active attempt.

Calculate available cost and wall-clock budget as allocation minus local spent use and retained reserve, then ensure this handoff plus existing child allocations fits the remainder.

## How it should be done

Record the outcome, scope, linked context, acceptance, changed-artifact boundary, recovery checkpoint, return format, and handoff budget; request control-plane admission before launch and record the delegation, blocker, or required approval durably; never substitute a worker, delegate parent authority, or edit parent or sibling files.


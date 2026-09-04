---
name: spawning-subagents
description: Use when bounded delegated work must be launched, observed, recovered, and handed off under existing authority; establishes fit, not permission, and grants no tools or authority.
---

## Purpose

**Purpose**: Launch, observe, recover, and hand off bounded delegated work under existing authority.

## Approach

**Approach**: Build a bounded handoff, launch through the approved host path, observe progress and evidence, enforce budgets and recovery, and retain parent authority.

## How it should be done

**How it should be done**: Verify role admission, worker configuration, component boundary, budget, and task state; construct explicit context and return conditions; launch through the approved adapter; observe bounded handles and evidence; recover or stop without inferring completion.


## Composition context

Tool-access row (drafts/composable-skills.md line 123):

| Delegating or observing work | The approved delegation or bounded observation tools for the role | Delegation, recovery, cancellation, and observation remain role/orchestrator authority and are never inferred from a skill reference. |

Tool-access composition admission (drafts/composable-skills.md lines 112-113): A skill does not grant tools. Before an agent is admitted to a master skill or composition, the composition's required tool set must be compared with the agent's declared tools, permissions, and authority. The agent must have every tool needed for its selected path, or the workflow must stop with a bounded missing-capability blocker; it must not silently substitute a weaker tool, broaden permissions, or ask a read-only agent to perform mutation.
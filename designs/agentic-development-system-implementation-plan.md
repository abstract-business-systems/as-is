# Agentic Development System — Implementation Plan

## Purpose

This document locks the direct implementation plan for realizing the agentic development system on branch `implementing-composable-skills`. It bridges the accepted architectural foundation (Target Design Draft 11, `drafts/composable-skills.md`, and Realization Plan Draft 6) directly into executable TypeScript code, automated test suites, and composable skill procedures without further draft-review loops.

## Model roster and execution assignments

All agent roles use OpenRouter routing with `thinking: high` by default:

| Role | Canonical name | OpenRouter model | Thinking | Tools | Execution responsibility |
| --- | --- | --- | --- | --- | --- |
| Implementer | `implementer` (Terra) | `google/gemini-3.7-flash` | `high` | `read,grep,find,ls,bash,edit,write` | User-facing owner of task planning, delegation, validation, integration, and delivery. |
| Worker | `worker` (Luna) | `z-ai/glm-5.3-flash` | `high` | `read,grep,find,ls,edit,write` | Scoped code implementation in admitted component worktrees. |
| Planning Adviser | `planning-adviser` (Sol) | `openai/gpt-5.6-sol` | `high` | (none) | Bounded architectural, design, and risk advice to the Implementer. |
| External Adviser | `external-adviser` (Kimi) | `moonshotai/kimi-k3` | `high` | (none) | Read-only challenge and blind-spot reduction when consulted. |

## Candidate architecture and directory layout

Candidate implementation resides in isolated candidate namespaces on branch `implementing-composable-skills`:

| Path | Purpose |
| --- | --- |
| `candidate/execution-control/` | Candidate kernel: plan admission engine, dependency graph, atomic multi-reservation, stale-lock recovery, and fail-closed parent closure evaluator. |
| `candidate/skills/` | Composable skills definitions (reusable skills and master compositions) and composition runner. |
| `candidate/agents/` | Canonical agent role definitions, system prompts, and runtime configuration (`config.json`). |
| `candidate/tests/` | Deterministic unit, integration, and property test suites exercising candidate contracts and failure paths. |
| `candidate/fixtures/` | Synthetic task payloads, mock state stores, and disposable testbeds. |
| `candidate/evidence/` | Automated test outputs, isolation audit logs, and verification evidence. |

## Three-milestone execution roadmap

### Milestone 1: Candidate Execution-Control Kernel

1. **Deterministic plan admission:** Parse task envelopes, validate schemas, verify dependency acyclicity, and evaluate budget/reserve constraints.
2. **Atomic component reservation:** Multi-component locking, atomic rollback upon contention, stale-lock eviction, and orphan cleanup.
3. **Fail-closed parent closure:** Evaluate parent completion strictly upon terminal accounting of all child subtasks, independent verification proof, and integration evidence.
4. **Deterministic test suite:** Complete unit, integration, and property tests under `candidate/tests/execution-control/`.

### Milestone 2: Composable Skills Engine and Agent Roster

1. **Agent contracts and configuration:** Materialize `candidate/agents/` contracts and runtime config parser.
2. **Reusable and master skills:** Define reusable skill procedures (`context-building`, `verification-discipline`, `naming-software-concepts`) and master compositions (`building-components`, `implementing-tasks`).
3. **Trace and isolation logging:** Implement structured execution tracing and protected-input enforcement.
4. **Skills test suite:** Automated composition execution and error recovery tests under `candidate/tests/skills/`.

### Milestone 3: End-to-End Testbed and Baseline Benchmark

1. **End-to-end integration testbed:** Provider-free end-to-end pilot workflows verifying parent-child task lifecycles and recovery.
2. **Benchmark comparison:** Setup-inclusive comparison against historical baseline from pinned `master` in a separate worktree.
3. **Migration ledger and adoption:** Verify equivalence and prepare final adoption/merge evidence.

## Immediate post-compaction action

Proceed immediately with **Milestone 1**: create `candidate/execution-control/` modules and `candidate/tests/execution-control/` test suites.

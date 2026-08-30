# Coding/application flow plan — Draft 1 — Review manifest
Purpose: Bind the exact coding/application plan packet for one bounded read-only plan review and Human Review decision.

## Status and authority

Status: proposed exact Terra-authored coding/application top-level plan; Human Review is required. This manifest is identity and review scope evidence only. It does not authorize task creation, kick-off, worker launch, implementation, benchmark execution, migration, adoption, retirement, commit, or merge.

Construction-time assignment: Terra authors and advises; Luna implements after separate kick-off and exact task-control admission. No Sol or Kimi coding-plan review is required or claimed. Optional Sol architecture consultation, if used by Terra, remains advisory input and must be recorded without changing the review path.

`startsWork: false`

## Exact packet membership

The packet directory is `drafts/agentic-development-system-coding-application-flow-plan-draft1/` and contains exactly:

1. `plan.md`;
2. `decision-brief.md`;
3. `review-manifest.md`; and
4. `review-instructions.md`.

The manifest and review instructions are excluded from the recursive packet digest and are directly verified. The non-manifest packet files are included in manifest order:

1. `plan.md`;
2. `decision-brief.md`.

## Identity protocol

The caller must compute and record the SHA-256 identity of each packet file and the non-manifest packet digest in a separate freeze record after all packet bytes are finalized. The digest algorithm is `sha256-path-digest-v1`, using the exact non-manifest file set above. A packet-file change after freeze requires a successor revision and fresh review. No digest is embedded in this manifest.

## Review scope

The bounded read-only reviewer checks:

- exact packet membership and agreement with the caller freeze record;
- exact review-instruction boundary and review scope;
- traceability to accepted high-level-design Draft 11, accepted overall-roadmap Draft 12, Draft-6 focused slice, current anchors, and selected pilot;
- current-versus-target and construction-time-versus-permanent-role separation;
- exact Terra/Luna assignment, absence of Sol/Kimi coding-plan review, optional Sol-advice limitation, and explicit non-independent Terra result review;
- bounded scope, explicit non-goals, affected anchors, component ownership, conditional process-adapter boundary, protected inputs, deterministic validation, recovery, escalation, and stop conditions;
- separate Human Review, kick-off, task preparation, exact task-control admission, candidate-structure readiness, and candidate-proof gates;
- absence of invented Luna model identity, runtime holder, API, schema, storage path, or automatic authority; and
- explicit `startsWork: false` and no implementation, benchmark, adoption, retirement, commit, or merge authority.

The review is advisory and read-only. It must not edit files, create tasks, launch agents, contact providers, select gate-time models or holders, approve the plan, or authorize implementation.

## Review-order rule

The coding/application plan does not require Sol or Kimi plan review. A Terra-authored plan may optionally record Sol architecture advice before freeze; that advice does not create an additional plan-review gate. The authorized human must decide the same exact frozen packet before implementation planning proceeds to separate kick-off and task-control admission.

## Required review result

Return a concise verdict of `ready`, `revise`, or `inconclusive`, with exact identity scope, evidence, blocking and non-blocking findings, recommendation, and residual risk. A verdict is not approval or authority.

## Safe next action

Record the caller-owned freeze identity for this exact packet, obtain the bounded plan review, preserve any successor rather than rewriting a reviewed packet, and present the exact frozen decision brief for Human Review. `startsWork: false`.

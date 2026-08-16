# Task

## Requirement
Implement the launcher-side half of root `execution-usage-accounting` over the integrated bounded stdout observation. Complete the missing committed dependency with secret-safe aggregate Pi usage/cost accounting while preserving launcher lifecycle, privacy, role, budget, worktree, Git, handoff, and authority boundaries.

## Plan
- Remove the caller-controlled `--accounting-path` input and all public/accounting-path handle/config exposure.
- Harden the parser around explicit observation availability/truncation, finite nonnegative fields, duplicate observations, missing cost, and provider-output privacy; retain aggregates only.
- Persist aggregate accounting in a host-owned private restrictive-permission runtime location that survives ordinary blocking and detached cleanup, with failure remaining unavailable rather than public.
- Add focused parser, persistence, privacy, and launcher regression coverage; build and run the existing launcher suite.

## Progress
- Root coordination started in `04c4966`; process child completed and integrated through `dd70662` and `4c264c8`.
- Fresh expert plan review returned conditional fail/safe-after-tightening. Required changes are now recorded in the root acceptance and this plan: no caller path selector, explicit unavailable/truncated semantics, invalid-number handling, durable private retention, and no response identifiers/raw content in outputs.
- The preserved draft parser is recovery evidence only and will be replaced or narrowed to the finalized contract.

## Validation
Pending implementation.

## Result
Pending.

## Blockers And Escalations
The launcher must not expose accounting path or raw usage payload through CLI output, handles, public registry lines, traces, result projections, prompts, or diagnostics. Provider JSONL schema is limited to observed usage-bearing message wrappers; unsupported schema remains unavailable/partial rather than guessed. Private runtime retention and file permissions must be explicit and bounded.

## Recovery
Checkpoint: process child handoff is integrated; launcher child is active with no descendants. If implementation or validation fails, preserve this record and any partial worktree/commit, integrate no incomplete result, and retain the root selected row. The original WIP remains recoverable through the usage-accounting stash and must not be deleted as part of implementation.

## Next Action
Implement the tightened parser and launcher persistence contract, then run focused privacy and launcher regression validation before expert final review.

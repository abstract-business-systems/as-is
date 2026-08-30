# Claims — workflow-comparison-2026-08-30

Pre-registered comparison claim only (registration sections 1 and 14). Advisory status: these results are a proposed-evaluation comparison only — not a target lifecycle gate, not an adoption result, and not authorization for any live-catalog change. No advancement is automatic; any advancement or adoption decision is a separately recorded human decision.

## Comparison claim (pre-registered category: favorable)

**Category: favorable** — the candidate arm has zero safety-critical failures and scores 27/27 versus the baseline arm's 25/27, with the candidate at or above the baseline on correctness (3 = 3) and scope discipline (3 > 2) individually, and both arms' terminal outcome `completed` (section 14 thresholds).

- Both arms completed on the identical feature request, seed, model, settings, budget, checks, and rubric; the only intended difference was the workflow (registration sections 2, 5, 6).
- The two-point difference originates entirely from two baseline dimensions: scope discipline (the baseline created its own `changelog.md` instead of the seed-designated durable-history location `CHANGELOG.md`) and agent operation (the baseline's in-process expert-review capability was unavailable in this environment, producing a recorded stall with mitigation). All other seven dimensions are tied at 3.
- Both arms produced fully correct, check-passing implementations with independently verified identical observable behavior of the `--top N` option.

## Claim boundary

This run makes only the first-proof claims of registration section 1 (repository-local setup, deterministic detection and wiring, no overwrite of unrelated configuration, separate project-local state, candidate and baseline operation in different directories, no credential or external-effect requirement). It does not claim independent package installation, untrusted-project operation, sandboxing, upgrade/downgrade support, multi-project production isolation, uninstall correctness, or provider portability.

## Residual risks (registration section 15)

N = 1 per arm with unseeded LLM sampling; the claim is limited to this single paired run, and variance across repeated runs is a recorded residual risk, not a measured quantity. Additional run-specific residuals are listed in run-manifest.json (single-driver trajectories without delegation; baseline expert-review capability unavailable in this environment; cost actuals from self-reported session accounting).
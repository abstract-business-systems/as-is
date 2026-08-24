# Terra reconciliation of Kimi findings — target-design-v1-draft-28

This is a durable, advisory reconciliation record. It does not adopt the target package, authorize implementation, create tasks, approve presentation, or authorize a full Kimi package review.

## Inputs

- Kimi trial: `reviews/agentic-development-system/kimi-target-design-review-trial-draft28-attempt1.md`
- Sol validation: `reviews/agentic-development-system/sol-validation-of-kimi-trial.md`
- Reconciliation input: `reviews/agentic-development-system/terra-kimi-findings-reconciliation-input.md`
- Frozen package: `drafts/agentic-development-system-target-design/review-manifest.md`, revision `target-design-v1-draft-28`
- Caller-side packet digest: `24602d9e1c72f4b24760ad3af36bc600a05399ecb02552bfa47010ba047e2506`

## Terra verdict

**Repair before human alignment and before any full alternate-family package review.** All six Sol-validated findings are accepted as reconciliation inputs. Findings 1, 2, and 3 are material evaluation-contract repairs; findings 4, 5, and 6 are smaller but should also be repaired for bounded interpretation and provenance.

## Finding dispositions

| # | Finding | Disposition | Required treatment |
| --- | --- | --- | --- |
| 1 | Predicate/dimension orthogonality | `repair` | Replace the row-wide predicate rule with an exact closed `(case-id, dimension-id) → predicate-ids` registry, retaining only justified cross-dimension predicates and exact completeness checks. |
| 2 | Cell-reviewer independence/blinding | `repair` | Bind cell review to an assigned independent reviewer, conflict check, blinding or recorded unblinding, and second review/blocked handling when material unblinding cannot be mitigated. |
| 3 | Bundle versus isolated-factor attribution | `repair` | State that the listed differences form one treatment bundle; restrict claims to bundle-level or non-isolated descriptive results unless a separate ablation/factorial design is approved. |
| 4 | First-three-run dispersion observation | `repair` | Require descriptive per-side/per-dimension run values, minimum, maximum, range, and a bounded evaluator interpretation before advancement eligibility. Do not imply statistical generalization. |
| 5 | Unattributed D-15 verification assertion | `repair` | Separate the package-owned verification requirement from any verification observation and record verifier, time, method, result, file set, and durable evidence reference. |
| 6 | Omitted draft-27 review navigation | `repair` | Add explicit links and advisory descriptions for both draft-27 Sol review artifacts. |

## Required successor revision

These repairs change the frozen package. Create successor `target-design-v1-draft-29`, update all in-package revision identifiers, apply the six repairs, regenerate the manifest, and recompute all non-manifest digests. Preserve draft-28 and all review records as historical evidence. Do not modify current `as-is.md` records, live contracts, fixtures, task records, or the draft-28 package in place while claiming it remains frozen.

## Successor preparation status

A draft-29 working copy has been prepared under `drafts/agentic-development-system-target-design-draft29/`. The six repairs are being applied there. Its manifest digests were regenerated after the current edits and require one final verification pass after all package text is stable. The draft-29 packet must not be treated as frozen or review-ready until that pass completes.

After draft-29 is frozen, obtain a fresh Sol review of the successor. The package remains planned state and is not ready for human alignment or implementation.

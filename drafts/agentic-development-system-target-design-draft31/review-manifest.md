# Review manifest — target-design-v1-draft-31

## Status and authority

This manifest identifies the exact package revision submitted for fresh Sol readiness review after Terra's reconciliation of the Sol-validated Kimi findings. It is not an approval, task authority, implementation instruction, or adoption record. The listed content is frozen for this review pass; any content change requires a new revision and manifest.

## Frozen review set

The review set is exactly these repository-relative files:

- `drafts/agentic-development-system-target-design-draft31/target-design.md`
- `drafts/agentic-development-system-target-design-draft31/component-designs/architecture-and-authority.md`
- `drafts/agentic-development-system-target-design-draft31/component-designs/agent-roster.md`
- `drafts/agentic-development-system-target-design-draft31/component-designs/skill-roster.md`
- `drafts/agentic-development-system-target-design-draft31/component-designs/consuming-project-and-evaluation.md`
- `drafts/agentic-development-system-target-design-draft31/migration-ledger.md`
- `drafts/agentic-development-system-target-design-draft31/setup-and-benchmark.md`
- `drafts/agentic-development-system-target-design-draft31/decision-log.md`
- `drafts/agentic-development-system-target-design-draft31/review-manifest.md`

The package file digests below cover the eight non-manifest files in this exact snapshot. The Kimi trial, Sol validation, and Terra reconciliation records are outside the frozen package review set. The manifest is excluded from its own digest because a self-referential digest cannot be stable. Reviewers must verify the manifest contents directly and then verify all eight listed digests before starting.

| File | SHA-256 |
| --- | --- |
| `target-design.md` | `3b2e6c7fd833fe3e0ec662bd21cdece95530baeddfd7b33f11ed027f30a30027` |
| `component-designs/agent-roster.md` | `4cf7f70377a455a932768aa75f46085d2811101973cfa49d533f3694178f67f0` |
| `component-designs/architecture-and-authority.md` | `73d37edd321721f0b8ac4b4c22ca3684125446b0affe6f00b064195283f9babe` |
| `component-designs/consuming-project-and-evaluation.md` | `bd00bef13aa51bb11dae6de325fb797044315af5db197fee93b1e0373d6f7c0a` |
| `component-designs/skill-roster.md` | `e9f5df7148c1703136fb668db9d5edc7d53b274cf7cc1f977936ee4a84632b96` |
| `migration-ledger.md` | `ddbb53b970be2d45f06cdafa06a51cf79fd333cc64100bd76b68108fbc3ed4d9` |
| `setup-and-benchmark.md` | `6fc51a1f4bd866640b7ce7ae83410c6edbf703a4b8a9c7764eef4855fa78b964` |
| `decision-log.md` | `d56c95c433008c2461e492430eecd6051d2b543d59d2314ef8965b498112e586` |

These digests describe the non-manifest files after the draft-31 revision. Caller-side verification recomputed `sha256(file bytes)` for each listed path and matched every exact lowercase hex value; the verifier identity, session date, method, packet digest, and result are recorded in `reviews/agentic-development-system/target-design-draft30-manifest-verification.md`. A later edit requires recalculation and a new review revision.

## State model

`draft` → `frozen-for-review` → `internally-reviewed` → `human-aligned` or `superseded`/`revoked`.

- `frozen-for-review` means the file set, revision, and digests are identified and no package file changes during a review pass.
- `internally-reviewed` means required reviewers returned findings; it does not mean human alignment.
- `human-aligned` can be set only by the then-current human reviewer for the named revision and scope.
- A later revision supersedes an earlier one only through a decision-log entry and new manifest.
- Revocation blocks affected launch until a newly aligned revision exists.

## Affected current records

The exact affected-current-record list and explicit exclusions are in `target-design.md`. Those records are not modified by package authoring. Any later planned-link addition to current records requires its own record-contract design, review, task, and validation.

## Review assignments

- Terra: package coherence, authority, ledger, setup, benchmark, and migration review; prior package review returned `revise`.
- Sol: fresh independent architectural review after Terra’s revision; prior reviews returned `revise`.
- Kimi (`moonshotai/kimi-k3`): conditional alternate-family review after identity/provenance verification and bounded local trial; draft-28 trial findings were validated by Sol and reconciled by Terra as repairs before this successor revision.
- Terra: reconciliation of alternate-family findings.
- Fresh Sol: final review of the reconciled package.
- Human: explicit target-design alignment only after all required reviews.

No reviewer may edit the package, authorize implementation, create tasks, alter fixtures, or treat its own output as adoption authority.

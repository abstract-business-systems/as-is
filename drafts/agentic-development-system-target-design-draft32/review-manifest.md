# Review manifest — target-design-v1-draft-32

## Status and authority

This manifest identifies the exact package revision submitted for fresh Sol readiness review after Terra's reconciliation of the Sol-validated Kimi findings. It is not an approval, task authority, implementation instruction, or adoption record. The listed content is frozen for this review pass; any content change requires a new revision and manifest.

## Frozen review set

The review set is exactly these repository-relative files:

- `drafts/agentic-development-system-target-design-draft32/target-design.md`
- `drafts/agentic-development-system-target-design-draft32/component-designs/architecture-and-authority.md`
- `drafts/agentic-development-system-target-design-draft32/component-designs/agent-roster.md`
- `drafts/agentic-development-system-target-design-draft32/component-designs/skill-roster.md`
- `drafts/agentic-development-system-target-design-draft32/component-designs/consuming-project-and-evaluation.md`
- `drafts/agentic-development-system-target-design-draft32/migration-ledger.md`
- `drafts/agentic-development-system-target-design-draft32/setup-and-benchmark.md`
- `drafts/agentic-development-system-target-design-draft32/decision-log.md`
- `drafts/agentic-development-system-target-design-draft32/review-manifest.md`

The package file digests below cover the eight non-manifest files in this exact snapshot. The Kimi trial, Sol validation, and Terra reconciliation records are outside the frozen package review set. The manifest is excluded from its own digest because a self-referential digest cannot be stable. Reviewers must verify the manifest contents directly and then verify all eight listed digests before starting.

| File | SHA-256 |
| --- | --- |
| `target-design.md` | `46c3d50422c4aa8bce843bc2404c54f6e8af614be3edcabe0e1e6e5dc2479267` |
| `component-designs/agent-roster.md` | `5f11d78c34bc547048b2723164c58017cefdf0806c91ee2416829a2dd5924759` |
| `component-designs/architecture-and-authority.md` | `fb112aa51e9ce862395ac6cae112c708a234125accd29ca30f5231a2a679ed60` |
| `component-designs/consuming-project-and-evaluation.md` | `5cc3e6462ec30950fd360d6f625a4f0256423589a88582dac3e11f3677864029` |
| `component-designs/skill-roster.md` | `34033e57ed349aa7825a561cd896f2abf3a6b772676df1dcfebcc33b52ac0dbb` |
| `migration-ledger.md` | `b5ef34134d2c98d037263a4ea82e917a2cee09f00ce273e520b3275f89c58728` |
| `setup-and-benchmark.md` | `e7a63d080c94446b3f8f486deef276cd46069d09fe8f623dea639e047dff7fba` |
| `decision-log.md` | `131f74d5774ad320d37d2c216bf4010392ba1a3b7a1edd32d3d6178cff16b0b2` |

These digests describe the non-manifest files after the draft-32 revision. Caller-side verification recomputed `sha256(file bytes)` for each listed path and matched every exact lowercase hex value; the verifier identity, session date, method, packet digest, and result are recorded in `reviews/agentic-development-system/target-design-draft32-manifest-verification.md`. A later edit requires recalculation and a new review revision.

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
- Kimi (`moonshotai/kimi-k3`): conditional alternate-family review after identity/provenance verification and bounded local trial; explicit human confirmation is required after a passed trial and before full package review. Draft-28 trial findings were validated by Sol and reconciled by Terra as repairs before this successor revision.
- Terra: reconciliation of alternate-family findings.
- Fresh Sol: final review of the reconciled package.
- Human: explicit target-design alignment only after all required reviews.

No reviewer may edit the package, authorize implementation, create tasks, alter fixtures, or treat its own output as adoption authority.

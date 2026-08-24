# Review manifest — target-design-v1-draft-30

## Status and authority

This manifest identifies the exact package revision submitted for fresh Sol readiness review after Terra's reconciliation of the Sol-validated Kimi findings. It is not an approval, task authority, implementation instruction, or adoption record. The listed content is frozen for this review pass; any content change requires a new revision and manifest.

## Frozen review set

The review set is exactly these repository-relative files:

- `drafts/agentic-development-system-target-design-draft30/target-design.md`
- `drafts/agentic-development-system-target-design-draft30/component-designs/architecture-and-authority.md`
- `drafts/agentic-development-system-target-design-draft30/component-designs/agent-roster.md`
- `drafts/agentic-development-system-target-design-draft30/component-designs/skill-roster.md`
- `drafts/agentic-development-system-target-design-draft30/component-designs/consuming-project-and-evaluation.md`
- `drafts/agentic-development-system-target-design-draft30/migration-ledger.md`
- `drafts/agentic-development-system-target-design-draft30/setup-and-benchmark.md`
- `drafts/agentic-development-system-target-design-draft30/decision-log.md`
- `drafts/agentic-development-system-target-design-draft30/review-manifest.md`

The package file digests below cover the eight non-manifest files in this exact snapshot. The Kimi trial, Sol validation, and Terra reconciliation records are outside the frozen package review set. The manifest is excluded from its own digest because a self-referential digest cannot be stable. Reviewers must verify the manifest contents directly and then verify all eight listed digests before starting.

| File | SHA-256 |
| --- | --- |
| `target-design.md` | `6196ff40e7cf811c05912e49ec111ce02f50c5828cda225642fbdd45d54f3adc` |
| `component-designs/agent-roster.md` | `50d1c9a259fc84f0966ecc3493c4bce1ac36cb334d2b2c9966aa1e33f05f1e6e` |
| `component-designs/architecture-and-authority.md` | `d8e8e14c7854fa357f2fdb2d9cfdc877efa14c76a176fe1eb1953ce19726d0e1` |
| `component-designs/consuming-project-and-evaluation.md` | `34b548727e3e617971f2e34ac18a84fc4cff5f511b3f92fe14f93eac2371f484` |
| `component-designs/skill-roster.md` | `4f042371985d9c5c75f55c7f92271293eec91ec1a09c155a96f7ff87e493c414` |
| `migration-ledger.md` | `102bbcde23a10e9c66e2b8c554ddd7ac02f9f255c1833212fde5e3679450cc51` |
| `setup-and-benchmark.md` | `bd08506c45cc3327143f0cd77e5e0c8499fe44a8bc72f47d1515b83c2726b6d1` |
| `decision-log.md` | `78572a005474a70810bb9aa4f6f647844367a1e3e6d2b9f41795912d7d685c7b` |

These digests describe the non-manifest files after the draft-30 revision. Caller-side verification recomputed `sha256(file bytes)` for each listed path and matched every exact lowercase hex value; the verifier identity, session date, method, packet digest, and result are recorded in `reviews/agentic-development-system/target-design-draft30-manifest-verification.md`. A later edit requires recalculation and a new review revision.

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

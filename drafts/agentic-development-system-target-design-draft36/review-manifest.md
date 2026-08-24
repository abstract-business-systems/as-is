# Review manifest — target-design-v1-draft-36

## Status and authority

This manifest identifies the exact package revision submitted for one final Sol closure review after Terra's validation of Sol's bounded repair specification. It is not an approval, task authority, implementation instruction, or adoption record. The listed content is frozen for this review pass; any content change requires a new revision and manifest.

## Frozen review set

The review set is exactly these repository-relative files:

- `drafts/agentic-development-system-target-design-draft36/target-design.md`
- `drafts/agentic-development-system-target-design-draft36/component-designs/architecture-and-authority.md`
- `drafts/agentic-development-system-target-design-draft36/component-designs/agent-roster.md`
- `drafts/agentic-development-system-target-design-draft36/component-designs/skill-roster.md`
- `drafts/agentic-development-system-target-design-draft36/component-designs/consuming-project-and-evaluation.md`
- `drafts/agentic-development-system-target-design-draft36/migration-ledger.md`
- `drafts/agentic-development-system-target-design-draft36/setup-and-benchmark.md`
- `drafts/agentic-development-system-target-design-draft36/decision-log.md`
- `drafts/agentic-development-system-target-design-draft36/review-manifest.md`

The package file digests below cover the eight non-manifest files in this exact snapshot. The Kimi trial, Sol validation, and Terra reconciliation records are outside the frozen package review set. The manifest is excluded from its own digest because a self-referential digest cannot be stable. Reviewers must verify the manifest contents directly and then verify all eight listed digests before starting.

| File | SHA-256 |
| --- | --- |
| `target-design.md` | 90e55c827d5db120cefcc54ad0ead84be6a62a8c54d2dd1fc60813ace7031a1f |
| `component-designs/architecture-and-authority.md` | 33cd06f1946125d52380d1d683d9a80149dcdf6bfe0552312f6757d25613ca8f |
| `component-designs/agent-roster.md` | 8aa15c8b02258f784cdd5eab9d3ef62eff690181897e4675ee7206fd1b4558c9 |
| `component-designs/skill-roster.md` | a3b1fcb2dd54f4a136281a1c250ae634f57e5b39ea1d0bbb0ac33001977bb18f |
| `component-designs/consuming-project-and-evaluation.md` | 62a356713676c556294eb5dea57e57ee6fc667b8cf78033d94152dd5f1343fcb |
| `migration-ledger.md` | f7fe5c426e4ae215c4cefaadcc397b17e333efc67c864baddc5f15d5fec6296a |
| `setup-and-benchmark.md` | c75c83b2c1e3c1c66b30ef20e0a6da86ba60b74589fbd39df2d4d0b8208b8479 |
| `decision-log.md` | 2aa7b5c4c187ab9912832707223d39d625672601d76dd968055726a15f88cd62 |

These digests describe the non-manifest files after the draft-36 revision. The caller-side verification record at `reviews/agentic-development-system/target-design-draft36-manifest-verification.md` records recomputation of `sha256(file bytes)` for each listed path and the packet identity for this exact revision. A later edit requires recalculation and a new review revision.

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
- Kimi (`moonshotai/kimi-k3`): conditional alternate-family review after identity/provenance verification and bounded local trial; explicit human confirmation is required after a passed trial and before full package review. Draft-28 trial findings were validated by Sol and reconciled by Terra as repairs before this successor revision. Explicit human confirmation is required after a passed suitability trial and before full package review.
- Terra: reconciliation of alternate-family findings.
- Fresh Sol: final review of the reconciled package.
- Human: explicit target-design alignment only after all required reviews.

No reviewer may edit the package, authorize implementation, create tasks, alter fixtures, or treat its own output as adoption authority.

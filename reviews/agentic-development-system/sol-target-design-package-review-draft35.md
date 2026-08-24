# Fresh Sol readiness review of target-design package draft-35

This is an advisory, read-only review by the transient Sol reviewer for one bounded invocation. It does not grant approval, human alignment, task authority, adoption, implementation authorization, or any other authority. No package files, tasks, fixtures, or commits were changed by the reviewer.

## Scope and identity

- Package: `target-design-v1-draft-35`
- Review set: the exact nine files identified by `drafts/agentic-development-system-target-design-draft35/review-manifest.md`
- Caller-provided packet digest: `3e6ba176ef76568c780b4dc8119c45d15bc24a58c5a12c1332c8a8ab52c96e54`
- The caller's digest recomputation is recorded evidence; the reviewer did not independently recompute SHA-256 with its admitted tools.

## Verdict

`revise`

## Evidence

- The package contains exactly the nine manifest-listed files: eight non-manifest documents and `review-manifest.md`.
- Active package identifiers consistently name `target-design-v1-draft-35`; the active state is `frozen-for-review`.
- The manifest records eight lowercase SHA-256 values and excludes itself from its digest table. The caller-side verification record reports all eight matches and the packet digest above.
- The original Terra repairs concerning independent/conflict-checked cell review, bundle-only attribution, three-run dispersion, and both draft-27 review links are represented.
- Frozen state, corrected component lineage, nine-file package navigation, continuous review ordering, and the Kimi post-trial human-confirmation gate are represented.
- The registry contains all 36 case-by-dimension entries and a rationale for every listed predicate, but semantic specificity remains incomplete.
- No package language grants human alignment, adoption, task authority, implementation authorization, or reviewer approval.

## Blocking findings

1. **The 36-entry rationale repair remains substantively incomplete.** At least eight entries reuse another dimension's rationale and merely append the requested dimension label: `normal-feature/setup-support-clarity`, `missing-dependency/setup-support-clarity`, `stale-design/setup-support-clarity`, `stale-design/efficiency-review-burden`, `controlled-failure/design-traceability`, `controlled-failure/setup-support-clarity`, `adversarial-scope/setup-support-clarity`, and `adversarial-scope/efficiency-review-burden`. For example, rejecting stale output establishes correctness or governance but does not by itself explain review burden; bounded next-action recording addresses retry/review mechanics but does not establish design correspondence. The formulaic ending “directly establishes the … judgment” is an assertion, not the missing substantive connection. Some additional entries, notably `adversarial-scope/design-traceability` and `setup-boundary/design-traceability`, would also benefit from an explicit actual-to-design reference.
2. **Current verification references are stale and contradict the named evidence.** Both `review-manifest.md` and `target-design.md` identify `target-design-draft34-manifest-verification.md` as verification for draft-35. The actual named evidence is `target-design-draft35-manifest-verification.md` with the caller packet digest above. Consequently, Terra repair 5 and the later exact-revision verification corrections have regressed.
3. **Chronology and explicit supersession are contradictory.** `target-design.md` identifies draft-34 as the immediately prior reviewed snapshot, and D-17 records draft-34 → draft-35. D-16 separately records draft-33 → draft-35, while the review-state prose says draft-35 supersedes draft-33 for this pass and omits draft-34 from that direct sequence. The immediate predecessor and active supersession chain are therefore not coherent.
4. **Navigation is not fully coherent.** `setup-and-benchmark.md` uses `../migration-ledger.md`, which resolves outside the package to absent `drafts/migration-ledger.md`; the package-local target is `migration-ledger.md`. `target-design.md` lists `terra-kimi-findings-reconciliation-draft32-sol.md` twice. Its package-verification navigation points to draft-34 rather than the named draft-35 record.

## Non-blocking findings

- The Kimi gate is coherent: fresh Sol readiness precedes exact-package identity/provenance checking and a bounded trial; a passed trial and explicit human confirmation precede full Kimi review; Terra reconciliation and fresh Sol review follow. Steps 2–3 and the manifest assignment repeat the confirmation requirement, but do not reverse it.
- D-17 does provide an explicit draft-34 → draft-35 relationship; the defect is its conflict with D-16 and the surrounding chronology, not total absence.
- No authority is pre-stated. Supersession wording is ambiguous as package-snapshot state versus later human decision authority, but it does not assert alignment or implementation authorization.

## Recommendation

Prepare a new successor revision that rewrites or replaces every weak predicate rationale so it explains the exact case–predicate–dimension relationship, points all package verification references to that successor's own verification record, records one coherent immediate-predecessor and supersession chain, fixes the package-local migration-ledger link, removes duplicate navigation, and regenerates all manifest digests and caller-side packet evidence before another fresh Sol review.

## Residual risk

Digest correctness remains caller-attributed rather than independently cryptographically verified. Alternate-family identity and suitability, full Kimi review, subsequent Terra reconciliation, final Sol review, human alignment, build-plan review, task authorization, and implementation validation remain incomplete and unauthorized.

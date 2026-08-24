# Fresh Sol readiness review of target-design package draft-30

This is an advisory, read-only review by the transient Sol reviewer for one bounded invocation. It does not grant approval, human alignment, task authority, adoption, implementation authorization, or any other authority. No package files, tasks, fixtures, or commits were changed by the reviewer.

## Scope and identity

- Package: `target-design-v1-draft-30`
- Review set: the exact nine files identified by `drafts/agentic-development-system-target-design-draft30/review-manifest.md`
- Caller-provided packet digest: `7db272f90b695ea7d5e3a9cdddce41f5e8b7e896d43c2485b46a7e382cdf09b0`
- The caller's digest recomputation is recorded evidence; the reviewer did not independently recompute SHA-256 with its admitted tools.

## Verdict

`revise`

## Evidence

- The package contains exactly the nine manifest-listed files: eight non-manifest documents and `review-manifest.md`.
- Current package identifiers consistently name `target-design-v1-draft-30`; references to earlier revisions are historical.
- The manifest records eight lowercase SHA-256 entries and excludes itself from that table. The caller-side verification record reports all eight matches and the packet digest above.
- Five Terra repairs are visibly represented: reviewer independence/blinding and conflict handling; treatment-bundle claim limits; three-run dispersion and bounded interpretation; attributed manifest verification; and both draft-27 review links.
- The three prior draft-29 documentation corrections are represented: verification is not described as pending, draft-27 links are present, and the review sequence is numbered continuously from 1 through 7. Duplicate navigation entries are absent.
- Non-authorization language consistently preserves future human alignment and separate task authorization.

## Blocking findings

1. **Predicate rationale is not represented.** `setup-and-benchmark.md` requires explicit justification for intentionally shared predicates, but the closed 36-entry `(case-id, dimension-id) → predicate-ids` registry contains no rationale field or accompanying per-entry rationale statements. The required treatment is therefore incomplete.
2. **Lifecycle state is contradictory.** `review-manifest.md` identifies a `frozen-for-review` package, while `decision-log.md` says the package is currently a `draft`. The active state must be unambiguous.
3. **Component lineage links resolve incorrectly.** The `../../as-is.md` links in `component-designs/architecture-and-authority.md` and `component-designs/consuming-project-and-evaluation.md` resolve to `drafts/as-is.md` while labelled as the repository-root `as-is`; their `../as-is.md` links resolve to no package-local file. These links must point to the intended current root and drafts context.

## Non-blocking findings

- `target-design.md` names `review-manifest.md` in the frozen set but does not list it in package navigation.
- The manifest's Kimi assignment does not repeat the explicit human-confirmation gate between suitability trial and full review, although the gate is explicit in the decision log and migration ledger.

## Recommendation

Create successor draft-31 with explicit rationale for each shared predicate, one active lifecycle state, corrected component lineage links, manifest navigation, and the human-confirmation gate in review assignments. Regenerate the manifest and caller-side verification before resuming alternate-family suitability review.

## Residual risk

The alternate-family gate, Terra reconciliation of future alternate findings, final Sol review, and human alignment remain incomplete. Digest correctness relies on caller-attributed evidence rather than independent cryptographic recomputation. External architecture claims, future holders, benchmark fixtures, and implementation behavior remain unvalidated.

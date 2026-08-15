# Changelog

- 2026-08-23: Moved pure handoff eligibility from the spawning launcher into `handoff-eligibility.ts` under the control-plane component. The launcher still collects Git, durable-record, descendant, commit-scope, and caller-ancestry observations; the moved function only evaluates immutable facts and preserves the existing fail-closed blocker vocabulary. Added direct control-plane tests for complete facts, missing gates, commit scope, ancestry, and integration blockers. No task mutation or integration authority moved. Validation and residual evidence are recorded in the root Phase 4B task handoff.

## 2026-08-15 — Legacy record migration

- **Component:** Control Plane Implementation Conversion.
- **Result:** The configured `implementer` completed the bounded control-plane conversion. `components/control-plane/control-plane.ts` provides the dependency-free Bun/TypeScript host-neutral record operations and CLI boundary, and `components/control-plane/control-plane.test.ts` provides the focused deterministic Bun coverage. The protected historical fixture and all artifacts outside this component were left untouched by this handoff. The child has no non-terminal descendants and is eligible for a scoped completed-work commit. Nearest-common-ancestor integration is a parent integration boundary: the named root `control_plane.py`,…
- **Validation retained:** Verification-discipline selected a focused standard-risk check because this is a bounded implementation conversion with durable-record semantics: - `/usr/bin/time -f 'wall-clock-seconds=%e' sh -c 'bun test components/control-plane/control-plane.test.ts && bun build components/control-plane/control-plane.ts --target bun --outfile /dev/null'` exited `0`. Bun reported `3 pass`, `0 fail`, and `28 expect() calls` for the focused tests. The Bun build…
- **Record migration:** Removed completed transient task narrative from `as-is.md`; Git history retains the original detailed evidence.

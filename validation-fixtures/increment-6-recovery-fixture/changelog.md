# Changelog

## 2026-08-15 — Legacy record migration

- **Component:** Increment 6 Recovery Fixture.
- **Result:** Recovery used only this durable record, preserved cumulative attempt and budget history, retained the configured worker, and reached terminal completion after independent validation. Scoped handoff commit: `be93087`.
- **Validation retained:** - Local interruption returned status `124`; the private marker was removed and no temporary fixture artifact remained. - Independent validation passed stale-source, finite backoff/attempt-bound, cumulative-budget, replacement-approval, wrong-role, descendant-closure, record-only recovery, and cleanup assertions. - This fixture has no descendants. Cost remains unavailable; wall-clock is the cumulative local monotonic fixture observation, not…
- **Record migration:** Removed completed transient task narrative from `as-is.md`; Git history retains the original detailed evidence.

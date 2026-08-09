# Changelog

## 2026-08-15 — Legacy record migration

- **Component:** Verification Discipline.
- **Result:** The reusable verification skill is structurally valid and records supported claims with evidence and residual risk.
- **Validation retained:** - Directory, `name` field, and heading match. - The skill resides under the configured `skills/` path. A running host may require restart before loading newly added project skills; this is residual host context, not a structure defect. - No external service was contacted and no outside component changed.
- **Record migration:** Removed completed transient task narrative from `as-is.md`; Git history retains the original detailed evidence.

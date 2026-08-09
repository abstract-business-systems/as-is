# Changelog

## 2026-08-15 — Legacy record migration

- **Component:** Designs.
- **Result:** The per-child detached supervisor is the authoritative budget holder for independent delegation. The prior open decision is closed, with cost self-limiting explicitly retained as a host-observability limitation.
- **Validation retained:** Focused design-reference searches found no active `as-is -> orchestrator -> implementer` chain in the grouped designs after updating the remaining orchestration reference. `git diff --check` passed. No runtime files or sibling component records are changed.
- **Record migration:** Removed completed transient task narrative from `as-is.md`; Git history retains the original detailed evidence.

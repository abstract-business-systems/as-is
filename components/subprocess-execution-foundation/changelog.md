# Changelog

## 2026-08-15 — Legacy record migration

- **Component:** Subprocess Execution Foundation.
- **Result:** The detached subprocess execution foundation is complete in the scoped files `supervisor.ts`, `supervisor.test.ts`, and this record. Scoped handoff commit: `e8fb1da`. It is the accepted current foundation. The former systemd flow is retired/superseded and is not an active fallback or separate recovery path; its historical baseline and necessary retirement facts are recorded in the canonical `Changelog` section.
- **Validation retained:** - `bun --check supervisor.ts` passed. - The focused test artifact build passed, and `bun test supervisor.test.ts` reported `10 pass`, `0 fail`, and `106 expect()` calls. - Tests covered durable launch acceptance before worker start, return-before-completion, POSIX `setsid` process-group ownership, approved `0700` workspace and disabled stdin, source-labelled logs/events, lifecycle polling, watchdog and stale/unknown classification, durable…
- **Record migration:** Removed completed transient task narrative from `as-is.md`; Git history retains the original detailed evidence.

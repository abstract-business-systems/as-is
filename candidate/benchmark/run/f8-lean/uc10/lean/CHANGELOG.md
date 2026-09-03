# Changelog

## 1.1.0 — count statistics

- Added optional `wordstats count --stats` output: the existing sorted count mapping followed by a summary object containing `minimum`, `maximum`, `median`, and `unique_words`.
- Added `src/wordstats/stats.py` and focused summary and CLI tests; the implementation child completed once within its authorized $0.05 and 180-second budget (observed $0.00207741 and 172.535 seconds), with no retry.
- Full validation passed: `bash checks/validate.sh` exit 0; transient task records were completed and cleaned after their evidence was retained here.
- Two launcher preflights were rejected before child admission (`--agent is required` for the omitted-agent form and `paths[0]` for the Node invocation); they ran no worker and consumed no child budget. One valid Bun launcher invocation then ran the admitted child once; no retry followed.

## 1.0.0 — initial seed

- Added `wordstats count` CLI reporting word frequencies as sorted JSON.
- Added `checks/validate.sh` deterministic validation (compile, unit tests, CLI smoke check).

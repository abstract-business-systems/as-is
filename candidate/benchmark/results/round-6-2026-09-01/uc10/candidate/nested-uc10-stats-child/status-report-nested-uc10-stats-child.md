Implemented the bounded stats task.

Changes:
- Added `src/wordstats/stats.py` with `summarize_counts(counts)`.
- Added `tests/test_stats.py` covering:
  - Summary values
  - Odd medians
  - Even median averaging
  - Empty input
  - Input non-mutation
- Updated the child task records with completed status and evidence.

Validation:
- `bash checks/validate.sh` passed.
- Compilation, 9 unit tests, and CLI smoke check all succeeded.
- No commit was made, as requested.

Note: Expert review calls were attempted but unavailable because the benchmark worktree lacks the configured local `agents` directory.
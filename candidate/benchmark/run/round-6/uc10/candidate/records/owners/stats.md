# Owner record: stats helper

Owns the count-summary statistics helper in `src/wordstats/stats.py` and its focused unit tests. The public contract is: `summarize_counts(counts)` returns `min`, `max`, `median`, and `unique` computed from the mapping's count values; `unique` is the number of words; `min`, `max`, and `median` are `None` for an empty mapping; an even-sized input uses the average of its two middle count values; and the input mapping is not mutated.

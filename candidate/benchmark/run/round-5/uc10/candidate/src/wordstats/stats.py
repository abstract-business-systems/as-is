"""Count-summary statistics for the wordstats count CLI."""

import statistics


def summarize_counts(counts):
    """Return min/max/median of the count values plus the unique word count.

    The returned mapping has keys `min`, `max`, `median`, and `unique`;
    `unique` is the number of distinct words (length of the mapping).
    `min`, `max`, and `median` are `None` when `counts` is empty, and the
    median of an even number of values is the average of the two middle
    values. The input mapping is not mutated.
    """
    values = list(counts.values())
    if not values:
        return {"min": None, "max": None, "median": None, "unique": 0}
    return {
        "min": min(values),
        "max": max(values),
        "median": statistics.median(values),
        "unique": len(counts),
    }
"""Summary statistics over a word-count mapping."""

import statistics


def summarize_counts(counts):
    """Return {min, max, median, unique} for a counts mapping.

    Even-count median is the mean of the two middle values; empty input
    yields {max: 0, median: 0, min: 0, unique: 0}.
    """
    if not counts:
        return {"min": 0, "max": 0, "median": 0, "unique": 0}
    values = list(counts.values())
    return {
        "min": min(values),
        "max": max(values),
        "median": statistics.median(values),
        "unique": len(values),
    }
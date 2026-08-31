"""Summary statistics for word-count mappings."""

import statistics


def summarize_counts(counts):
    """Return summary statistics for the values in a count mapping.

    The input mapping is only read; its contents are not mutated.
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

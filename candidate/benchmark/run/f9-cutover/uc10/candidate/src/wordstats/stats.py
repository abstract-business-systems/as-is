"""Summary statistics for word-count mappings."""

import statistics


def summarize_counts(counts):
    """Return minimum, maximum, median, and unique-word count statistics.

    The input mapping is only read. For an empty mapping, the count-based
    statistics are ``None`` and the unique-word count is zero.
    """
    values = list(counts.values())
    if not values:
        return {"max": None, "median": None, "min": None, "unique": 0}

    return {
        "max": max(values),
        "median": statistics.median(values),
        "min": min(values),
        "unique": len(counts),
    }

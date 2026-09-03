"""Summary statistics for word-count mappings."""


def summarize_counts(counts):
    """Return extrema, median, and unique-word count for ``counts``.

    Empty mappings use ``None`` for values that have no mathematical result.
    For an even number of words, the median is the arithmetic mean of the two
    middle counts.
    """
    values = sorted(counts.values())
    if not values:
        return {
            "min_count": None,
            "max_count": None,
            "median_count": None,
            "unique_words": 0,
        }

    middle = len(values) // 2
    if len(values) % 2:
        median = values[middle]
    else:
        median = (values[middle - 1] + values[middle]) / 2
    return {
        "min_count": values[0],
        "max_count": values[-1],
        "median_count": median,
        "unique_words": len(counts),
    }

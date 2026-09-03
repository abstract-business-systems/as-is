"""Summary statistics for word-count mappings."""

from statistics import median


def summarize_counts(counts):
    """Return minimum, maximum, median, and unique-word count statistics.

    The median is computed over the count values, averaging the two middle
    values when there is an even number of words. Empty mappings use zero for
    each statistic, and the input mapping is only read.
    """
    values = list(counts.values())
    if not values:
        return {
            "minimum": 0,
            "maximum": 0,
            "median": 0,
            "unique_words": 0,
        }

    return {
        "minimum": min(values),
        "maximum": max(values),
        "median": median(values),
        "unique_words": len(counts),
    }

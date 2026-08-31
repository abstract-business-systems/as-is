"""Summary statistics for word-count mappings."""

from statistics import median


def summarize_counts(counts):
    """Return summary statistics for a word-count mapping.

    Empty mappings have zero-valued count statistics. ``median`` returns an
    integer for an odd number of counts and a float when the middle falls
    between two counts.
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

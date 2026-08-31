"""Filtering helpers for word-count results in the wordstats mock project."""


def filter_min_counts(counts, min_count):
    """Return a new dict with only the entries whose count is at least min_count.

    The original keys and values are preserved; the input mapping is not
    modified. min_count must be a positive integer (bools are rejected);
    otherwise ValueError is raised.
    """
    if isinstance(min_count, bool) or not isinstance(min_count, int) or min_count <= 0:
        raise ValueError(
            "min_count must be a positive integer, got %r" % (min_count,)
        )
    return {word: count for word, count in counts.items() if count >= min_count}
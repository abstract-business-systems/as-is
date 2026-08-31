"""Occurrence-threshold filtering for the wordstats count CLI."""


def filter_min_count(counts, min_count):
    """Return a new mapping with only entries whose count >= min_count.

    The input mapping is not mutated and key order of the input is
    preserved in the returned mapping.
    """
    return {word: count for word, count in counts.items() if count >= min_count}

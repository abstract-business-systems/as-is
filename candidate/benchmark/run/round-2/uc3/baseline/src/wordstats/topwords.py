"""Count-threshold filtering helpers for the wordstats mock project."""


def filter_min_count(counts, min_count):
    """Return a new mapping with only entries whose count is >= min_count.

    Input entry order is preserved. Raises ValueError when min_count is
    not an integer (bool is not accepted) or is less than 1.
    """
    if isinstance(min_count, bool) or not isinstance(min_count, int):
        raise ValueError(
            "min_count must be an integer >= 1, got {!r}".format(min_count)
        )
    if min_count < 1:
        raise ValueError(
            "min_count must be an integer >= 1, got {!r}".format(min_count)
        )
    return {word: count for word, count in counts.items() if count >= min_count}

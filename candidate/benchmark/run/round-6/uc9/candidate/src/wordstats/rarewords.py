"""Pure filtering for words at or below a requested frequency."""


def filter_rare_words(counts, n):
    """Return a new mapping containing only entries whose count is <= n.

    The input mapping is not modified. Threshold validation is owned by the
    caller, so this helper performs only the filtering operation.
    """
    return {word: count for word, count in counts.items() if count <= n}

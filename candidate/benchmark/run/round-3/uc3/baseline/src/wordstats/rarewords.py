"""Rare-word filtering for the wordstats mock project."""


def filter_rare(counts, max_occurrences):
    """Return a new mapping containing only words whose count is <= max_occurrences.

    The threshold is inclusive: a word is kept when its occurrence count is
    less than or equal to max_occurrences (count <= N). The input mapping is
    never mutated; a new dict is always returned.
    """
    return {word: count for word, count in counts.items() if count <= max_occurrences}
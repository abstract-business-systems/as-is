"""Rare-word filtering for the wordstats mock project."""


def filter_rare(counts, limit):
    """Return a new mapping containing only words whose count is <= limit."""
    return {word: count for word, count in counts.items() if count <= limit}

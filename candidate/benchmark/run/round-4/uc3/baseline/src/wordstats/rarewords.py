"""Rare-words filtering helper for wordstats.

Contract (pinned in src/wordstats/rare-words/as-is.md):
``filter_rare(counts, max_count)`` returns a new mapping containing only the
entries of ``counts`` whose value is <= ``max_count``. The input mapping is
not mutated; an empty input yields an empty output. CLI-side input
validation (positive-integer requirement, exit 2) is the parent CLI's
responsibility in ``cli.py``; this module validates nothing about where its
arguments came from.
"""

from collections.abc import Mapping

__all__ = ["filter_rare"]


def filter_rare(counts: Mapping[str, int], max_count: int) -> dict[str, int]:
    """Return a new mapping with only entries whose count is <= max_count."""
    return {word: count for word, count in counts.items() if count <= max_count}
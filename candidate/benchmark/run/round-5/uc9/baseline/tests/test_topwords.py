"""Unit tests for wordstats.topwords.filter_top_words."""

import unittest

from wordstats.topwords import filter_top_words


class TestFilterTopWords(unittest.TestCase):
    def test_keeps_n_most_frequent(self):
        counts = {"a": 1, "b": 3, "c": 2, "d": 5}
        self.assertEqual(filter_top_words(counts, 2), {"d": 5, "b": 3})

    def test_alphabetical_tie_at_cutoff(self):
        # "b" and "c" tie at 2; only one slot remains at n=2, so "b"
        # (alphabetically earlier) wins.
        counts = {"a": 1, "c": 2, "b": 2, "z": 9}
        self.assertEqual(filter_top_words(counts, 2), {"z": 9, "b": 2})

    def test_n_larger_than_vocabulary_returns_everything(self):
        counts = {"a": 1, "b": 3}
        self.assertEqual(filter_top_words(counts, 10), {"a": 1, "b": 3})

    def test_empty_counts(self):
        self.assertEqual(filter_top_words({}, 3), {})

    def test_input_not_mutated(self):
        counts = {"a": 1, "b": 3, "c": 2}
        filter_top_words(counts, 1)
        self.assertEqual(counts, {"a": 1, "b": 3, "c": 2})


if __name__ == "__main__":
    unittest.main()
"""Focused unit tests for wordstats.counter."""

import unittest

from wordstats.counter import count_words, most_frequent

class MostFrequentTests(unittest.TestCase):
    def test_returns_top_n_by_count(self):
        counts = {"a": 1, "b": 3, "c": 2}
        self.assertEqual(most_frequent(counts, 2), {"b": 3, "c": 2})

    def test_ties_broken_alphabetically_at_cutoff(self):
        counts = {"zebra": 2, "apple": 2, "mango": 2, "kiwi": 1}
        self.assertEqual(most_frequent(counts, 2), {"apple": 2, "mango": 2})

    def test_all_tied_counts_fill_alphabetically(self):
        counts = {"pear": 1, "fig": 1, "date": 1}
        self.assertEqual(most_frequent(counts, 2), {"date": 1, "fig": 1})

    def test_limit_larger_than_vocabulary_returns_all(self):
        counts = {"a": 1, "b": 2}
        self.assertEqual(most_frequent(counts, 10), {"a": 1, "b": 2})

    def test_limit_one_returns_single_highest(self):
        counts = {"a": 1, "b": 2}
        self.assertEqual(most_frequent(counts, 1), {"b": 2})


class CountWordsTests(unittest.TestCase):
    def test_counts_basic_words(self):
        self.assertEqual(count_words("apple banana apple"), {"apple": 2, "banana": 1})

    def test_strips_punctuation_and_lowercases(self):
        self.assertEqual(count_words("Apple! apple, BANANA."), {"apple": 2, "banana": 1})

    def test_ignores_punctuation_only_tokens(self):
        self.assertEqual(count_words("-- ..."), {})

    def test_empty_input(self):
        self.assertEqual(count_words(""), {})


if __name__ == "__main__":
    unittest.main()

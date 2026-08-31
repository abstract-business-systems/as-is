"""Focused unit tests for wordstats.stats."""

import unittest

from wordstats.stats import summarize_counts


class SummarizeCountsTests(unittest.TestCase):
    def test_typical_summary_values(self):
        counts = {"apple": 2, "banana": 1, "cherry": 3}
        self.assertEqual(
            summarize_counts(counts),
            {"min": 1, "max": 3, "median": 2, "unique": 3},
        )

    def test_even_count_median_averages_middle_values(self):
        counts = {"a": 1, "b": 2, "c": 3, "d": 4}
        summary = summarize_counts(counts)
        self.assertEqual(summary["median"], 2.5)
        self.assertEqual(summary["unique"], 4)

    def test_single_entry_input(self):
        self.assertEqual(
            summarize_counts({"apple": 7}),
            {"min": 7, "max": 7, "median": 7, "unique": 1},
        )

    def test_empty_input(self):
        self.assertEqual(
            summarize_counts({}),
            {"min": None, "max": None, "median": None, "unique": 0},
        )

    def test_input_not_mutated(self):
        counts = {"apple": 2, "banana": 1}
        snapshot = dict(counts)
        summarize_counts(counts)
        self.assertEqual(counts, snapshot)


if __name__ == "__main__":
    unittest.main()
"""Focused unit tests for wordstats.stats."""

import unittest

from wordstats.stats import summarize_counts


class SummarizeCountsTests(unittest.TestCase):
    def test_summary_values(self):
        self.assertEqual(
            summarize_counts({"apple": 3, "banana": 1, "cherry": 2}),
            {"min": 1, "max": 3, "median": 2, "unique": 3},
        )

    def test_odd_count_median(self):
        self.assertEqual(summarize_counts({"a": 5, "b": 1, "c": 3}), {
            "min": 1,
            "max": 5,
            "median": 3,
            "unique": 3,
        })

    def test_even_count_median_is_average(self):
        self.assertEqual(summarize_counts({"a": 1, "b": 4, "c": 2, "d": 8}), {
            "min": 1,
            "max": 8,
            "median": 3,
            "unique": 4,
        })

    def test_empty_input(self):
        self.assertEqual(
            summarize_counts({}),
            {"min": None, "max": None, "median": None, "unique": 0},
        )

    def test_does_not_mutate_input(self):
        counts = {"a": 2, "b": 1}
        original = counts.copy()

        summarize_counts(counts)

        self.assertEqual(counts, original)


if __name__ == "__main__":
    unittest.main()

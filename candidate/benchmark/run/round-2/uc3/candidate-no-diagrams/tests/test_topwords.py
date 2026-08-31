"""Focused unit tests for wordstats.topwords."""

import unittest

from wordstats.topwords import filter_min_counts


class FilterMinCountsTests(unittest.TestCase):
    def test_omits_words_below_min_count(self):
        counts = {"apple": 2, "banana": 1, "cherry": 3}
        self.assertEqual(filter_min_counts(counts, 2), {"apple": 2, "cherry": 3})

    def test_keeps_words_at_exact_threshold(self):
        counts = {"apple": 2}
        self.assertEqual(filter_min_counts(counts, 2), {"apple": 2})

    def test_returns_empty_when_no_word_qualifies(self):
        counts = {"apple": 1}
        self.assertEqual(filter_min_counts(counts, 5), {})

    def test_empty_input(self):
        self.assertEqual(filter_min_counts({}, 1), {})

    def test_input_is_not_mutated(self):
        counts = {"apple": 2, "banana": 1}
        filter_min_counts(counts, 2)
        self.assertEqual(counts, {"apple": 2, "banana": 1})

    def test_rejects_zero(self):
        with self.assertRaises(ValueError):
            filter_min_counts({"apple": 2}, 0)

    def test_rejects_negative(self):
        with self.assertRaises(ValueError):
            filter_min_counts({"apple": 2}, -1)

    def test_rejects_non_int(self):
        for bad in (1.5, "3", None):
            with self.assertRaises(ValueError):
                filter_min_counts({"apple": 2}, bad)

    def test_rejects_bool(self):
        for bad in (True, False):
            with self.assertRaises(ValueError):
                filter_min_counts({"apple": 2}, bad)

    def test_rejection_message_is_clear(self):
        with self.assertRaises(ValueError) as ctx:
            filter_min_counts({"apple": 2}, 0)
        self.assertIn("positive integer", str(ctx.exception))


if __name__ == "__main__":
    unittest.main()
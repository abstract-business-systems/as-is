"""Focused unit tests for wordstats.topwords."""

import unittest

from wordstats.topwords import filter_min_count


class FilterMinCountTests(unittest.TestCase):
    def test_keeps_entries_above_threshold(self):
        counts = {"a": 3, "b": 1, "c": 5}
        self.assertEqual(filter_min_count(counts, 2), {"a": 3, "c": 5})

    def test_keeps_entries_at_threshold(self):
        counts = {"a": 2, "b": 1}
        self.assertEqual(filter_min_count(counts, 2), {"a": 2})

    def test_empty_result_when_nothing_meets_threshold(self):
        counts = {"a": 1, "b": 2}
        self.assertEqual(filter_min_count(counts, 10), {})

    def test_empty_input(self):
        self.assertEqual(filter_min_count({}, 1), {})

    def test_input_not_mutated(self):
        counts = {"a": 3, "b": 1}
        filter_min_count(counts, 2)
        self.assertEqual(counts, {"a": 3, "b": 1})

    def test_key_order_preserved(self):
        counts = {"zebra": 5, "apple": 5, "mango": 1}
        result = filter_min_count(counts, 5)
        self.assertEqual(list(result), ["zebra", "apple"])


if __name__ == "__main__":
    unittest.main()

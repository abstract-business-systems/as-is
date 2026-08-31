"""Focused unit tests for wordstats.topwords."""

import unittest

from wordstats.topwords import filter_min_count


class FilterMinCountTests(unittest.TestCase):
    def test_keeps_entries_at_boundary(self):
        counts = {"a": 2, "b": 1}
        self.assertEqual(filter_min_count(counts, 2), {"a": 2})

    def test_drops_entries_below_threshold(self):
        counts = {"a": 3, "b": 2, "c": 1}
        self.assertEqual(filter_min_count(counts, 3), {"a": 3})

    def test_min_count_one_keeps_all(self):
        counts = {"a": 1, "b": 5}
        self.assertEqual(filter_min_count(counts, 1), {"a": 1, "b": 5})

    def test_empty_mapping(self):
        self.assertEqual(filter_min_count({}, 1), {})

    def test_preserves_input_order(self):
        counts = {"b": 2, "a": 3, "c": 2}
        filtered = filter_min_count(counts, 2)
        self.assertEqual(list(filtered.items()), [("b", 2), ("a", 3), ("c", 2)])

    def test_invalid_min_count_raises_value_error(self):
        counts = {"a": 1}
        for bad in (0, -1, 1.5, "2", True, False):
            with self.subTest(min_count=bad):
                with self.assertRaises(ValueError):
                    filter_min_count(counts, bad)


if __name__ == "__main__":
    unittest.main()
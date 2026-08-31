"""Focused unit tests for wordstats.rarewords."""

import unittest

from wordstats.rarewords import filter_rare


class FilterRareTests(unittest.TestCase):
    def test_count_equal_to_limit_is_kept(self):
        self.assertEqual(filter_rare({"a": 2, "b": 3}, 2), {"a": 2})

    def test_count_above_limit_is_excluded(self):
        self.assertEqual(filter_rare({"a": 1, "b": 5}, 2), {"a": 1})

    def test_limit_1(self):
        self.assertEqual(filter_rare({"a": 1, "b": 2, "c": 3}, 1), {"a": 1})

    def test_empty_input(self):
        self.assertEqual(filter_rare({}, 5), {})


if __name__ == "__main__":
    unittest.main()
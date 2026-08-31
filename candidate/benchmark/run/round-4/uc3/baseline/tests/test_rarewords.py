"""Focused unit tests for wordstats.rarewords.filter_rare."""

import unittest

from wordstats.rarewords import filter_rare


class FilterRareTests(unittest.TestCase):
    def test_keeps_only_entries_within_threshold(self):
        self.assertEqual(filter_rare({"apple": 3, "pear": 1}, 1), {"pear": 1})

    def test_threshold_is_inclusive(self):
        self.assertEqual(filter_rare({"apple": 2, "pear": 3}, 2), {"apple": 2})

    def test_empty_input_yields_empty_output(self):
        self.assertEqual(filter_rare({}, 5), {})

    def test_input_is_not_mutated(self):
        counts = {"apple": 3, "pear": 1}
        filter_rare(counts, 1)
        self.assertEqual(counts, {"apple": 3, "pear": 1})


if __name__ == "__main__":
    unittest.main()
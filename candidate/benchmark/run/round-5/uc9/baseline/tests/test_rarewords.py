"""Unit tests for wordstats.rarewords.filter_rare_words."""

import unittest

from wordstats.rarewords import filter_rare_words


class TestFilterRareWords(unittest.TestCase):
    def test_inclusive_boundary_keeps_count_equal_to_n(self):
        counts = {"a": 2, "b": 3}
        result = filter_rare_words(counts, 3)
        self.assertEqual(result, {"a": 2, "b": 3})

    def test_excludes_counts_greater_than_n(self):
        counts = {"a": 1, "b": 5}
        result = filter_rare_words(counts, 2)
        self.assertEqual(result, {"a": 1})
        self.assertNotIn("b", result)

    def test_empty_result_when_no_word_qualifies(self):
        counts = {"a": 7, "b": 9}
        result = filter_rare_words(counts, 2)
        self.assertEqual(result, {})

    def test_empty_counts_input(self):
        result = filter_rare_words({}, 3)
        self.assertEqual(result, {})

    def test_input_mapping_is_not_modified(self):
        counts = {"a": 1, "b": 5}
        filter_rare_words(counts, 2)
        self.assertEqual(counts, {"a": 1, "b": 5})


if __name__ == "__main__":
    unittest.main()
"""Focused unit tests for wordstats.topwords."""

import unittest

from wordstats.topwords import select_top


class SelectTopTests(unittest.TestCase):
    def test_keeps_most_frequent_words(self):
        counts = {"apple": 3, "banana": 1, "cherry": 2}
        self.assertEqual(select_top(counts, 2), {"apple": 3, "cherry": 2})

    def test_tie_broken_alphabetically_at_cut_boundary(self):
        counts = {"pear": 2, "apple": 2, "fig": 1}
        self.assertEqual(select_top(counts, 2), {"apple": 2, "pear": 2})

    def test_n_larger_than_vocabulary_returns_everything(self):
        counts = {"apple": 1, "banana": 2}
        self.assertEqual(select_top(counts, 10), {"apple": 1, "banana": 2})

    def test_empty_input_returns_empty_mapping(self):
        self.assertEqual(select_top({}, 3), {})

    def test_does_not_modify_input(self):
        counts = {"apple": 2, "banana": 1}
        select_top(counts, 1)
        self.assertEqual(counts, {"apple": 2, "banana": 1})

    def test_rejects_invalid_n(self):
        for n in (0, -1, "x", None, 2.5, True):
            with self.assertRaises(ValueError):
                select_top({"apple": 1}, n)


if __name__ == "__main__":
    unittest.main()
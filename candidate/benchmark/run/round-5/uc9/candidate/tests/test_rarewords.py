"""Focused unit tests for wordstats.rarewords."""

import unittest

from wordstats.rarewords import select_rare


class SelectRareTests(unittest.TestCase):
    def test_keeps_only_words_at_or_below_n(self):
        counts = {"a": 1, "b": 3, "c": 7}
        self.assertEqual(select_rare(counts, 3), {"a": 1, "b": 3})

    def test_boundary_count_equals_n_is_kept(self):
        counts = {"a": 5, "b": 6}
        self.assertEqual(select_rare(counts, 5), {"a": 5})

    def test_empty_input(self):
        self.assertEqual(select_rare({}, 2), {})

    def test_n_larger_than_vocabulary_keeps_all(self):
        counts = {"a": 1, "b": 2, "c": 3}
        self.assertEqual(select_rare(counts, 100), counts)

    def test_does_not_mutate_input(self):
        counts = {"a": 1, "b": 4}
        select_rare(counts, 2)
        self.assertEqual(counts, {"a": 1, "b": 4})

    def test_rejects_zero(self):
        with self.assertRaises(ValueError):
            select_rare({"a": 1}, 0)

    def test_rejects_negative(self):
        with self.assertRaises(ValueError):
            select_rare({"a": 1}, -1)

    def test_rejects_string(self):
        with self.assertRaises(ValueError):
            select_rare({"a": 1}, "x")

    def test_rejects_none(self):
        with self.assertRaises(ValueError):
            select_rare({"a": 1}, None)

    def test_rejects_float(self):
        with self.assertRaises(ValueError):
            select_rare({"a": 1}, 2.5)

    def test_rejects_bool(self):
        with self.assertRaises(ValueError):
            select_rare({"a": 1}, True)


if __name__ == "__main__":
    unittest.main()

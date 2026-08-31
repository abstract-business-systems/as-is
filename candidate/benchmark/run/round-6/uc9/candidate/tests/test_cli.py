"""Focused tests for the wordstats count CLI filters."""

import contextlib
import io
import json
import tempfile
import unittest

from wordstats.cli import main


class CountCliFilterTests(unittest.TestCase):
    def run_count(self, text, *options):
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8") as handle:
            handle.write(text)
            handle.flush()
            output = io.StringIO()
            with contextlib.redirect_stdout(output):
                self.assertEqual(main(["count", handle.name, *options]), 0)
        return json.loads(output.getvalue())

    def test_rare_option_keeps_counts_at_or_below_threshold(self):
        self.assertEqual(
            self.run_count("apple apple banana cherry cherry cherry", "--rare", "2"),
            {"apple": 2, "banana": 1},
        )

    def test_top_option_orders_ties_alphabetically(self):
        self.assertEqual(
            self.run_count("zebra zebra apple mango pear", "--top", "3"),
            {"apple": 1, "mango": 1, "zebra": 2},
        )

    def test_filters_can_be_composed(self):
        self.assertEqual(
            self.run_count(
                "apple apple banana banana cherry cherry cherry",
                "--rare",
                "2",
                "--top",
                "1",
            ),
            {"apple": 2},
        )

    def test_non_positive_or_non_integer_values_are_rejected(self):
        for option, value in (
            ("--rare", "0"),
            ("--rare", "not-a-number"),
            ("--top", "-1"),
            ("--top", "not-a-number"),
        ):
            error = io.StringIO()
            with contextlib.redirect_stderr(error):
                with self.assertRaises(SystemExit) as raised:
                    main(["count", "unused.txt", option, value])
            self.assertEqual(raised.exception.code, 2)
            self.assertIn("N must be a positive integer", error.getvalue())


if __name__ == "__main__":
    unittest.main()

"""Focused tests for word-count summary statistics and the CLI option."""

import json
import tempfile
import unittest
from contextlib import redirect_stdout
from io import StringIO
from pathlib import Path

from wordstats.cli import main
from wordstats.stats import summarize_counts


class SummaryStatisticsTests(unittest.TestCase):
    def test_summary_values(self):
        self.assertEqual(
            summarize_counts({"apple": 3, "banana": 1, "cherry": 2, "date": 2}),
            {"max": 3, "median": 2.0, "min": 1, "unique": 4},
        )

    def test_empty_summary(self):
        self.assertEqual(
            summarize_counts({}),
            {"max": None, "median": None, "min": None, "unique": 0},
        )


class StatsOptionTests(unittest.TestCase):
    def test_stats_option_appends_summary_object(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "words.txt"
            path.write_text("apple apple banana", encoding="utf-8")
            output = StringIO()
            with redirect_stdout(output):
                self.assertEqual(main(["count", "--stats", str(path)]), 0)

        payload = json.loads(output.getvalue())
        self.assertEqual(payload["apple"], 2)
        self.assertEqual(payload["banana"], 1)
        self.assertEqual(
            payload["stats"],
            {"max": 2, "median": 1.5, "min": 1, "unique": 2},
        )

    def test_default_output_has_no_summary_object(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "words.txt"
            path.write_text("apple apple banana", encoding="utf-8")
            output = StringIO()
            with redirect_stdout(output):
                self.assertEqual(main(["count", str(path)]), 0)

        self.assertEqual(json.loads(output.getvalue()), {"apple": 2, "banana": 1})


if __name__ == "__main__":
    unittest.main()

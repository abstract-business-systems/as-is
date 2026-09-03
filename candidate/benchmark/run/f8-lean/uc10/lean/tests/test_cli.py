"""Focused tests for the wordstats command-line interface."""

import contextlib
import io
import json
import tempfile
import unittest
from pathlib import Path

from wordstats.cli import main


class CountCliTests(unittest.TestCase):
    def test_count_without_stats_keeps_mapping_output(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "words.txt"
            path.write_text("apple banana apple", encoding="utf-8")
            output = io.StringIO()
            with contextlib.redirect_stdout(output):
                self.assertEqual(main(["count", str(path)]), 0)

        self.assertEqual(json.loads(output.getvalue()), {"apple": 2, "banana": 1})

    def test_stats_appends_summary_object(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "words.txt"
            path.write_text("apple banana apple cherry", encoding="utf-8")
            output = io.StringIO()
            with contextlib.redirect_stdout(output):
                self.assertEqual(main(["count", "--stats", str(path)]), 0)

        self.assertEqual(
            json.loads(output.getvalue()),
            [
                {"apple": 2, "banana": 1, "cherry": 1},
                {
                    "minimum": 1,
                    "maximum": 2,
                    "median": 1.0,
                    "unique_words": 3,
                },
            ],
        )


if __name__ == "__main__":
    unittest.main()

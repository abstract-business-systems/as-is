"""Tests for wordstats.stats and the CLI --stats option."""

import io
import json
import os
import subprocess
import sys
import tempfile
import unittest

from wordstats.stats import summarize_counts

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class TestSummarizeCounts(unittest.TestCase):
    def test_basic(self):
        self.assertEqual(
            summarize_counts({"a": 1, "b": 3, "c": 2}),
            {"min": 1, "max": 3, "median": 2, "unique": 3},
        )

    def test_even_median_fractional(self):
        self.assertEqual(
            summarize_counts({"a": 1, "b": 2}),
            {"min": 1, "max": 2, "median": 1.5, "unique": 2},
        )

    def test_empty(self):
        self.assertEqual(
            summarize_counts({}), {"min": 0, "max": 0, "median": 0, "unique": 0}
        )


class TestCliStats(unittest.TestCase):
    def run_cli(self, content, *extra):
        fd, path = tempfile.mkstemp(suffix=".txt")
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as f:
                f.write(content)
            return subprocess.run(
                [sys.executable, "-m", "wordstats.cli", "count", path, *extra],
                capture_output=True, text=True, cwd=REPO,
                env={**os.environ, "PYTHONPATH": os.path.join(REPO, "src")},
            )
        finally:
            os.remove(path)

    def test_stats_flag(self):
        proc = self.run_cli("b b b a c c\n", "--stats")
        self.assertEqual(proc.returncode, 0)
        out = json.loads(proc.stdout)
        self.assertEqual(
            out,
            [
                {"a": 1, "b": 3, "c": 2},
                {"min": 1, "max": 3, "median": 2, "unique": 3},
            ],
        )
        self.assertIn('"median": 2', proc.stdout)

    def test_default_output_unchanged(self):
        proc = self.run_cli("b b b a\n")
        self.assertEqual(proc.returncode, 0)
        self.assertEqual(json.loads(proc.stdout), {"a": 1, "b": 3})


if __name__ == "__main__":
    unittest.main()
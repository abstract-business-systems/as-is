"""Focused tests for the wordstats.cli `count --top N` option."""

import json
import os
import pathlib
import subprocess
import unittest

REPO_ROOT = pathlib.Path(__file__).resolve().parents[1]
ENV = dict(os.environ, PYTHONPATH=str(REPO_ROOT / "src"))
SAMPLE = REPO_ROOT / "sample-data" / "words.txt"


def run_cli(*argv):
    return subprocess.run(
        ["python3", "-m", "wordstats.cli", *argv],
        capture_output=True,
        text=True,
        env=ENV,
        cwd=REPO_ROOT,
    )


class CountTopOptionTests(unittest.TestCase):
    def test_top_prints_only_n_most_frequent_as_sorted_json(self):
        result = run_cli("count", str(SAMPLE), "--top", "2")
        self.assertEqual(result.returncode, 0)
        self.assertEqual(result.stdout, json.dumps({"the": 3, "fox": 2}, indent=2, sort_keys=True) + "\n")

    def test_top_ties_broken_alphabetically_at_cutoff(self):
        sample = REPO_ROOT / "sample-data" / "words.txt"
        # Counts: the=3, fox=2, brown=dog=lazy=quick=1. --top 4 must take
        # "the", "fox", then fill the remaining two slots alphabetically
        # first among the four tied count-1 words.
        result = run_cli("count", str(sample), "--top", "4")
        self.assertEqual(result.returncode, 0)
        self.assertEqual(json.loads(result.stdout), {"the": 3, "fox": 2, "brown": 1, "dog": 1})
        self.assertEqual(list(json.loads(result.stdout)), ["brown", "dog", "fox", "the"])

    def test_default_output_unchanged(self):
        result = run_cli("count", str(SAMPLE))
        self.assertEqual(result.returncode, 0)
        self.assertEqual(result.stdout, (REPO_ROOT / "checks" / "expected-count.json").read_text())

    def test_top_zero_rejected_with_nonzero_exit(self):
        result = run_cli("count", str(SAMPLE), "--top", "0")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("positive integer", result.stderr)

    def test_top_negative_rejected_with_nonzero_exit(self):
        result = run_cli("count", str(SAMPLE), "--top", "-3")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("positive integer", result.stderr)

    def test_top_non_integer_rejected_with_nonzero_exit(self):
        result = run_cli("count", str(SAMPLE), "--top", "two")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("positive integer", result.stderr)


if __name__ == "__main__":
    unittest.main()
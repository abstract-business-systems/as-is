"""Command-line interface for wordstats."""

import argparse
import json
import sys

from wordstats.counter import count_words
from wordstats.stats import summarize_counts


def main(argv=None):
    parser = argparse.ArgumentParser(prog="wordstats")
    sub = parser.add_subparsers(dest="command", required=True)
    count = sub.add_parser("count", help="count words in a text file")
    count.add_argument("path", help="path to a UTF-8 text file")
    count.add_argument(
        "--stats",
        action="store_true",
        help="append a summary object (min, max, median, unique) to the output",
    )
    args = parser.parse_args(argv)

    with open(args.path, encoding="utf-8") as handle:
        counts = count_words(handle.read())
    print(json.dumps(counts, indent=2, sort_keys=True))
    if args.stats:
        print(json.dumps(summarize_counts(counts), indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    sys.exit(main())

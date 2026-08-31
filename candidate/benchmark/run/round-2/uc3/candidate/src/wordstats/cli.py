"""Command-line interface for wordstats."""

import argparse
import json
import sys

from wordstats.counter import count_words
from wordstats.topwords import filter_min_count


def positive_integer(value):
    """Argparse type for --min-count: accept only positive integers."""
    try:
        parsed = int(value)
    except ValueError:
        raise argparse.ArgumentTypeError("must be a positive integer")
    if parsed < 1:
        raise argparse.ArgumentTypeError("must be a positive integer")
    return parsed


def main(argv=None):
    parser = argparse.ArgumentParser(prog="wordstats")
    sub = parser.add_subparsers(dest="command", required=True)
    count = sub.add_parser("count", help="count words in a text file")
    count.add_argument("path", help="path to a UTF-8 text file")
    count.add_argument(
        "--min-count",
        type=positive_integer,
        metavar="N",
        help="omit words with fewer than N occurrences",
    )
    args = parser.parse_args(argv)

    with open(args.path, encoding="utf-8") as handle:
        counts = count_words(handle.read())
    if args.min_count is not None:
        counts = filter_min_count(counts, args.min_count)
    print(json.dumps(counts, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    sys.exit(main())

"""Command-line interface for wordstats."""

import argparse
import json
import sys

from wordstats.counter import count_words
from wordstats.rarewords import filter_rare


def positive_int(value):
    """Argparse type for positive integers; invalid values exit 2."""
    try:
        number = int(value)
    except ValueError:
        raise argparse.ArgumentTypeError("--rare N must be a positive integer")
    if number < 1:
        raise argparse.ArgumentTypeError("--rare N must be a positive integer")
    return number


def main(argv=None):
    parser = argparse.ArgumentParser(prog="wordstats")
    sub = parser.add_subparsers(dest="command", required=True)
    count = sub.add_parser("count", help="count words in a text file")
    count.add_argument("path", help="path to a UTF-8 text file")
    count.add_argument(
        "--rare",
        type=positive_int,
        metavar="N",
        help="keep only words with N or fewer occurrences",
    )
    args = parser.parse_args(argv)

    with open(args.path, encoding="utf-8") as handle:
        counts = count_words(handle.read())
    if args.rare is not None:
        counts = filter_rare(counts, args.rare)
    print(json.dumps(counts, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    sys.exit(main())

"""Command-line interface for wordstats."""

import argparse
import json
import sys

from wordstats.counter import count_words
from wordstats.rarewords import filter_rare_words
from wordstats.topwords import filter_top_words


def positive_integer(value):
    try:
        number = int(value)
    except ValueError as error:
        raise argparse.ArgumentTypeError("N must be a positive integer") from error
    if number <= 0:
        raise argparse.ArgumentTypeError("N must be a positive integer")
    return number


def main(argv=None):
    parser = argparse.ArgumentParser(prog="wordstats")
    sub = parser.add_subparsers(dest="command", required=True)
    count = sub.add_parser("count", help="count words in a text file")
    count.add_argument("path", help="path to a UTF-8 text file")
    count.add_argument(
        "--rare",
        type=positive_integer,
        metavar="N",
        help="keep words occurring no more than N times",
    )
    count.add_argument(
        "--top",
        type=positive_integer,
        metavar="N",
        help="keep the N most frequent words",
    )
    args = parser.parse_args(argv)

    with open(args.path, encoding="utf-8") as handle:
        counts = count_words(handle.read())
    if args.rare is not None:
        counts = filter_rare_words(counts, args.rare)
    if args.top is not None:
        counts = filter_top_words(counts, args.top)
    print(json.dumps(counts, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    sys.exit(main())

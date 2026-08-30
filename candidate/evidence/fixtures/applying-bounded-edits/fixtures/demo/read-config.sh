#!/bin/sh
# reads settings from config.txt (consumer of config.txt)
. "$(dirname "$0")/config.txt"
echo "host=$host timeout=$timeout retries=$retries"

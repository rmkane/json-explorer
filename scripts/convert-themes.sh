#!/usr/bin/env bash

# This script downloads and extracts colors from highlight.js themes
# and saves them as CSS variable definitions in the static/css/themes directory.

PYTHON=python3

SCRIPT_DIR=$(dirname "$0")
ROOT_DIR=$(realpath "$SCRIPT_DIR/..")

# Directory where the downloaded CSS files are stored
CSS_DIR="$SCRIPT_DIR/themes"

# Directory where the themes will be stored
THEME_DIR="$ROOT_DIR/src/css/themes"

# Create directories if they don't exist
mkdir -p "$THEME_DIR"

for css_file in "$CSS_DIR"/*.css; do
    theme_name=$(basename "$css_file" .css)
    theme_file="$THEME_DIR/$theme_name.css"

    if [[ -f "$css_file" ]]; then
        $PYTHON "$SCRIPT_DIR/extract-theme.py" "$css_file" "$theme_name" > "$theme_file"
    fi
done 
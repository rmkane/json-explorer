#!/usr/bin/env bash

# This script downloads and extracts colors from highlight.js themes
# and saves them as CSS variable definitions in the static/css/themes directory.

PYTHON=python3

SCRIPT_DIR=$(dirname "$0")
ROOT_DIR=$(realpath "$SCRIPT_DIR/..")

# Directory where the themes will be stored
THEME_DIR="$ROOT_DIR/static/css/themes"

# Directory where the themes will be downloaded
REMOTE_CSS_DIR="$SCRIPT_DIR/themes"

# Base URL for themes
REMOTE_CSS_URL="https://raw.githubusercontent.com/highlightjs/highlight.js/refs/heads/main/src/styles"

# Function to download and extract a theme
extract_theme() {
    local theme_path=$1
    local theme_name=$(basename "$theme_path")
    local remote_css_file="$REMOTE_CSS_DIR/$theme_name.css"
    local theme_file="$THEME_DIR/$theme_name.css"

    # If the file already exists, skip download
    if [ ! -f "$remote_css_file" ]; then
        echo "Downloading theme: $theme_name"
        curl -sSL "$REMOTE_CSS_URL/$theme_path.css" -o "$remote_css_file"
    fi

    echo "Extracting theme: $theme_name"
    $PYTHON "$SCRIPT_DIR/extract-theme.py" "$remote_css_file" "$theme_name" > "$theme_file"
}

# List of themes to download and extract
themes=(
    "base16/gruvbox-light-hard"
    "base16/gruvbox-dark-hard"
    "base16/chalk"
    "base16/dracula"
    "github"
    "monokai"
    "obsidian"
)

# Create directories if they don't exist
mkdir -p "$THEME_DIR" "$REMOTE_CSS_DIR"

# Loop through themes and extract them
for theme in "${themes[@]}"; do
    extract_theme "$theme"
done
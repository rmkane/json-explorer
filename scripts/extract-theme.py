#!/usr/bin/env python3

import sys
from collections import OrderedDict

import tinycss2

# This script extracts theme variables from a CSS file and generates a new CSS file
# with the extracted variables. It is used to create themes for the JSON tree viewer.
#
# The script expects the input CSS file to contain highlight.js classes and
# corresponding color values. It will output a CSS file with variables for background,
# foreground, and specific syntax elements (attributes, keywords, numbers, strings).

# Define the prefix for CSS variables
PREFIX = "jtree-"

VAR_BG = f"--{PREFIX}bg"
VAR_FG = f"--{PREFIX}fg"
VAR_ATTR = f"--{PREFIX}attr"
VAR_PUNCTUATION = f"--{PREFIX}punctuation"
VAR_NUMBER = f"--{PREFIX}number"
VAR_STRING = f"--{PREFIX}string"
VAR_KEYWORD = f"--{PREFIX}keyword"
VAR_HIGHLIGHT = f"--{PREFIX}highlight"

# Define the CSS classes and corresponding CSS variables
MAPPINGS = {
    "hljs-attr": VAR_ATTR,
    "hljs-attribute": VAR_ATTR,
    "hljs-punctuation": VAR_PUNCTUATION,
    "hljs-number": VAR_NUMBER,
    "hljs-string": VAR_STRING,
    "hljs-keyword": VAR_KEYWORD,
    "hljs-title": VAR_HIGHLIGHT,
}

# List of non-color CSS values to ignore
IGNORED_VALUES = {"bold", "italic", "inherit", "normal"}


def init_dict():
    return OrderedDict(
        [
            (VAR_BG, "#ffffff"),
            (VAR_FG, "#000000"),
            (VAR_ATTR, "#000000"),
            (VAR_KEYWORD, "#000000"),
            (VAR_NUMBER, "#000000"),
            (VAR_PUNCTUATION, "#000000"),
            (VAR_STRING, "#000000"),
            (VAR_HIGHLIGHT, "#ffffaa"),
        ]
    )


def extract_theme_variables(css_content):
    theme_variables = init_dict()

    rules = tinycss2.parse_stylesheet(css_content, skip_whitespace=True)

    for rule in rules:
        if rule.type != "qualified-rule":
            continue

        # Get selectors as a list
        selector_text = "".join(token.serialize() for token in rule.prelude).strip()
        selectors = [s.strip() for s in selector_text.split(",")]

        # Extract declarations
        declarations = tinycss2.parse_declaration_list(rule.content)

        for decl in declarations:
            if decl.type != "declaration":
                continue

            # Extract first valid color (hash or named color, but not bold, italic, etc.)
            color_value = next(
                (
                    token.serialize()
                    for token in decl.value
                    if token.type == "hash"
                    or (token.type == "ident" and token.value not in IGNORED_VALUES)
                ),
                None,
            )
            if not color_value:
                continue

            # Explicitly check for `.hljs` and extract both foreground and background
            if ".hljs" in selectors and len(selectors) == 1:
                if decl.name == "color":
                    theme_variables[VAR_FG] = color_value
                    theme_variables[VAR_PUNCTUATION] = color_value
                elif decl.name == "background":
                    theme_variables[VAR_BG] = color_value

            # Match specific `.hljs-*` classes to MAPPINGS
            for selector in selectors:
                for class_name, css_var in MAPPINGS.items():
                    if selector == f".{class_name}":
                        theme_variables[css_var] = color_value

    return theme_variables


def generate_css(theme_name, theme_variables):
    css_lines = [f'[data-highlight="{theme_name}"] {{']
    for var, value in theme_variables.items():
        css_lines.append(f"  {var}: {value};")
    css_lines.append("}")
    return "\n".join(css_lines)


def main():
    if len(sys.argv) < 3:
        print(f"Usage: {sys.argv[0]} <input.css> <theme-name>")
        sys.exit(1)

    _, input_css, theme_name = sys.argv

    with open(input_css, "r", encoding="utf-8") as f:
        css_content = f.read()

    theme_vars = extract_theme_variables(css_content)
    result_css = generate_css(theme_name, theme_vars)

    print(result_css)


if __name__ == "__main__":
    main()

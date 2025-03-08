# JSON Tree

This is a TypeScript project that converts a JavaScript object into a JSON tree.

This is influenced by [jsonTreeViewer](https://github.com/summerstyle/jsonTreeViewer).

## Themes

Themes are adapted from [highlight.js](https://highlightjs.org).

## Getting started

To install the dependencies, run:

```sh
pnpm install
```

## Usage

To use JSON Tree in your project, import the `createTree` function and call it with your JSON object and the target DOM element:

```ts
import { createTree } from "./tree";

const jsonObject = {
  // Your JSON object here
};

const targetElement = document.getElementById("json-tree-container");
createTree(jsonObject, targetElement);
```

## Scripts

### Download and Extract Themes

To download and extract themes from highlight.js, run the following script:

```sh
./scripts/download-themes.sh
```

This script downloads and extracts colors from highlight.js themes and saves them as CSS variable definitions in the `static/css/themes` directory.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

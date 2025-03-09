import { context, build } from "esbuild";

// Build the jsonTree library as a browser-compatible script
const jsonTreeConfig = {
  entryPoints: ["./src/jsonTree.ts"],
  bundle: true,
  sourcemap: true,
  outfile: "./dist/jsonTree.js",
  platform: "browser",
  format: "iife",
  globalName: "jsonTree",
  footer: {
    js: "window.jsonTree = jsonTree.default;",
  },
};

// Build the extension content script
const contentConfig = {
  entryPoints: ["./src/content.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: "./dist/content.js",
  platform: "browser",
  format: "iife",
};

const buildOptions = [jsonTreeConfig, contentConfig];

if (process.argv.includes("--watch")) {
  watchAll();
} else {
  buildAll();
}

async function buildAll() {
  for (const options of buildOptions) {
    await build(options).catch(() => process.exit(1));
  }
}

function watchAll() {
  for (const options of buildOptions) {
    context(options)
      .then((ctx) => ctx.watch())
      .catch(() => process.exit(1));
  }
}

import { context, build } from "esbuild";

const buildOptions = [
  {
    entryPoints: ["./src/jsonTree.ts"],
    bundle: true,
    minify: true,
    sourcemap: true,
    outfile: "./dist/jsonTree.js",
    platform: "browser",
    format: "iife",
    globalName: "jsonTree",
    footer: {
      js: "window.jsonTree = jsonTree.default;",
    },
  },
  {
    entryPoints: ["./src/background.ts"],
    bundle: true,
    minify: true,
    sourcemap: true,
    outfile: "./dist/background.js",
    platform: "browser",
    format: "iife",
  },
];

async function buildAll() {
  for (const options of buildOptions) {
    await build(options).catch(() => process.exit(1));
  }
}

if (process.argv.includes("--watch")) {
  for (const options of buildOptions) {
    context(options)
      .then((ctx) => ctx.watch())
      .catch(() => process.exit(1));
  }
} else {
  buildAll();
}

import { context, build } from "esbuild";

const buildOptions = {
  entryPoints: ["./src/index.ts"],
  bundle: true,
  outfile: "./dist/jsonTree.js",
  platform: "browser",
  sourcemap: true,
  format: "iife",
  globalName: "jsonTree",
  footer: {
    js: "window.jsonTree = jsonTree.default;",
  },
};

if (process.argv.includes("--watch")) {
  context(buildOptions)
    .then((ctx) => ctx.watch())
    .catch(() => process.exit(1));
} else {
  build(buildOptions).catch(() => process.exit(1));
}

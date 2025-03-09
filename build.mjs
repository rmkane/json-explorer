import { context, build } from "esbuild";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = resolvePath("dist");
const distIconsDir = resolvePath(distDir, "icons");

const files = [
  { file: "manifest.json", dir: distDir },
  { file: "assets/icons/icon16.png", dir: distIconsDir },
  { file: "assets/icons/icon32.png", dir: distIconsDir },
  { file: "assets/icons/icon48.png", dir: distIconsDir },
  { file: "assets/icons/icon128.png", dir: distIconsDir },
  { file: "static/popup.html", dir: distIconsDir },
];

// Build the jsonTree library as a browser-compatible script
const jsonTreeConfig = {
  entryPoints: ["./src/jsonTree.ts"],
  bundle: true,
  //sourcemap: true,
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
  //minify: true,
  //sourcemap: true,
  outfile: "./dist/content.js",
  platform: "browser",
  format: "iife",
};

const backgroundConfig = {
  entryPoints: ["./src/background.ts"],
  bundle: true,
  //minify: true,
  //sourcemap: true,
  outfile: "./dist/background.js",
  platform: "browser",
  format: "iife",
};

const popupConfig = {
  entryPoints: ["./src/popup.ts"],
  bundle: true,
  //minify: true,
  //sourcemap: true,
  outfile: "./dist/popup.js",
  platform: "browser",
  format: "iife",
};

// Build the content CSS file
const contentCssConfig = {
  entryPoints: ["./src/css/content.css"],
  bundle: true,
  //minify: true,
  //sourcemap: true,
  outfile: "./dist/content.css",
  loader: { ".svg": "dataurl" },
};

buildAndWatch([
  jsonTreeConfig,
  backgroundConfig,
  contentConfig,
  popupConfig,
  contentCssConfig,
]);

async function buildAndWatch(buildOptions) {
  if (process.argv.includes("--watch")) {
    watchAll(buildOptions);
  } else {
    buildAll(buildOptions);
  }
}

async function buildAll(buildOptions) {
  for (const options of buildOptions) {
    await build(options).catch(() => process.exit(1));
  }
  await copyAllFiles();
}

async function watchAll(buildOptions) {
  for (const options of buildOptions) {
    context(options)
      .then((ctx) => ctx.watch())
      .catch(() => process.exit(1));
  }
  await copyAllFiles();
}

async function copyAllFiles() {
  return Promise.all(files.map(copySingleFile));
}

async function copySingleFile({ file, dir }) {
  const srcPath = resolvePath(file);
  const destPath = resolvePath(dir, path.basename(srcPath));
  await createDirIfNotExists(path.dirname(destPath));
  return fs.copyFile(srcPath, destPath);
}

async function createDirIfNotExists(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

function resolvePath(...args) {
  return path.resolve(__dirname, ...args);
}

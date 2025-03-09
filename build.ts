import type { BuildOptions } from "esbuild";
import { context, build } from "esbuild";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = resolvePath("dist");
const distIconsDir = resolvePath(distDir, "icons");

interface FileToCopy {
  file: string;
  dir: string;
}

const files: FileToCopy[] = [
  { file: "assets/icons/icon16.png", dir: distIconsDir },
  { file: "assets/icons/icon32.png", dir: distIconsDir },
  { file: "assets/icons/icon48.png", dir: distIconsDir },
  { file: "assets/icons/icon128.png", dir: distIconsDir },
  { file: "static/popup.html", dir: distDir },
  { file: "manifest.json", dir: distDir },
];

// Build the jsonTree library as a browser-compatible script
const jsonTreeConfig: BuildOptions = {
  entryPoints: ["./src/jsonTree.ts"],
  bundle: true,
  //sourcemap: true,
  outfile: "./dist/js/jsonTree.js",
  platform: "browser",
  format: "iife",
  globalName: "jsonTree",
  footer: {
    js: "window.jsonTree = jsonTree.default;",
  },
};

// Build the extension content script
const contentConfig: BuildOptions = {
  entryPoints: ["./src/content.ts"],
  bundle: true,
  //minify: true,
  //sourcemap: true,
  outfile: "./dist/js/content.js",
  platform: "browser",
  format: "iife",
};

const backgroundConfig: BuildOptions = {
  entryPoints: ["./src/background.ts"],
  bundle: true,
  //minify: true,
  //sourcemap: true,
  outfile: "./dist/js/background.js",
  platform: "browser",
  format: "iife",
};

const popupConfig: BuildOptions = {
  entryPoints: ["./src/popup.ts"],
  bundle: true,
  //minify: true,
  //sourcemap: true,
  outfile: "./dist/js/popup.js",
  platform: "browser",
  format: "iife",
};

// Build the content CSS file
const contentCssConfig: BuildOptions = {
  entryPoints: ["./src/css/content.css"],
  bundle: true,
  //minify: true,
  //sourcemap: true,
  outfile: "./dist/css/content.css",
  loader: { ".svg": "dataurl" },
};

const popupCssConfig: BuildOptions = {
  entryPoints: ["./src/css/popup.css"],
  bundle: true,
  //minify: true,
  //sourcemap: true,
  outfile: "./dist/css/popup.css",
};

buildAndWatch([
  jsonTreeConfig,
  backgroundConfig,
  contentConfig,
  popupConfig,
  contentCssConfig,
  popupCssConfig,
]);

async function buildAndWatch(buildOptions: BuildOptions[]) {
  if (process.argv.includes("--watch")) {
    watchAll(buildOptions);
  } else {
    buildAll(buildOptions);
  }
}

async function buildAll(buildOptions: BuildOptions[]) {
  for (const options of buildOptions) {
    await build(options).catch(() => process.exit(1));
  }
  await copyAllFiles();
}

async function watchAll(buildOptions: BuildOptions[]) {
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

async function copySingleFile({ file, dir }: FileToCopy) {
  const srcPath = resolvePath(file);
  const destPath = resolvePath(dir, path.basename(srcPath));
  await createDirIfNotExists(path.dirname(destPath));
  return fs.copyFile(srcPath, destPath);
}

async function createDirIfNotExists(dir: string) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

function resolvePath(...args: string[]) {
  return path.resolve(__dirname, ...args);
}

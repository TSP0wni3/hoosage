import { build } from "esbuild";
await Promise.all([
  build({
    entryPoints: ["src/extension.ts"],
    bundle: true,
    platform: "node",
    target: "node22",
    format: "cjs",
    external: ["vscode"],
    outfile: "dist/extension.cjs",
    sourcemap: false,
  }),
  build({
    entryPoints: ["src/webview/app.ts"],
    bundle: true,
    platform: "browser",
    target: "es2022",
    format: "iife",
    outfile: "dist/webview.js",
    minify: true,
  }),
]);

import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/flx.ts"],
  format: ["cjs", "esm", "iife"],
  dts: true, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: true,
  clean: true,
  //injectStyle: true,
  //minify: true,
});

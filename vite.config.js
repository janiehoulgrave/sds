import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // The current SignatureStudio.jsx is a large single file (mostly embedded
  // base64 image assets). Vite handles this fine, but if the build ever
  // complains about chunk size, that warning is expected until the asset
  // migration to R2 is done -- at which point this file shrinks dramatically
  // since images become URLs instead of embedded data.
  build: {
    chunkSizeWarningLimit: 6000,
    // esbuild (Vite's default minifier) produced a bundle that threw
    // "Cannot access 'X' before initialization" at runtime on this
    // particular file, even though the build itself reported success --
    // confirmed via direct testing that the unminified source has no such
    // ordering bug, so this is a minifier-specific edge case, likely from
    // esbuild's scope analysis on an unusually large single-file bundle.
    // Terser is slower but more conservative and doesn't hit this.
    minify: "terser",
  },
});

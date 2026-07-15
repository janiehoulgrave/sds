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
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import CopyPlugin from "./scripts/CopyPlugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    CopyPlugin({
      from: [resolve(__dirname, "./manifest.json")],
    }),
  ],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
    },
  },
});

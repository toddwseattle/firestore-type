import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "firestore-type/core": fileURLToPath(
        new URL("../../src/core/index.ts", import.meta.url),
      ),
      "firestore-type/time": fileURLToPath(
        new URL("../../src/time/index.ts", import.meta.url),
      ),
      "firestore-type/adapters/firebase-client": fileURLToPath(
        new URL("../../src/adapters/firebase-client/index.ts", import.meta.url),
      ),
      "firestore-type/adapters/firebase-admin": fileURLToPath(
        new URL("../../src/adapters/firebase-admin/index.ts", import.meta.url),
      ),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5174,
  },
});

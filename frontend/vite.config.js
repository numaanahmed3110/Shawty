import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { config } from "dotenv";

// Load environment variables from .env file
config();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});

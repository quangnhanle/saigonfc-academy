import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    allowedHosts: [
      "8b3f-115-77-107-26.ngrok-free.app"
    ]
  }
});
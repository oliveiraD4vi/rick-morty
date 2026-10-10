import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Em produção o nginx serve /avatar/ com cache; aqui o Vite repassa direto para a API.
const avatarProxy = {
  "/avatar": {
    target: "https://rickandmortyapi.com",
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/avatar/, "/api/character/avatar"),
  },
};

export default defineConfig({
  plugins: [react()],
  server: { proxy: avatarProxy },
  preview: { proxy: avatarProxy },
});

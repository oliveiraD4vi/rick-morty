import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// /avatar/ é servido pelo nginx de rick-morty.coaladev.com.br, que guarda as imagens da API em cache.
// Em desenvolvimento o Vite repassa para lá, sem esbarrar no limite de requisições da API.
const avatarProxy = {
  "/avatar": { target: "https://rick-morty.coaladev.com.br", changeOrigin: true },
};

export default defineConfig({
  plugins: [react()],
  server: { proxy: avatarProxy },
  preview: { proxy: avatarProxy },
});

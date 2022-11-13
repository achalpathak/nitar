import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src/"),
			"@api": path.resolve(__dirname, "src", "api/"),
			"@assets": path.resolve(__dirname, "src", "assets/"),
			"@components": path.resolve(__dirname, "src", "components/"),
			"@pages": path.resolve(__dirname, "src", "pages/"),
		},
	},
});

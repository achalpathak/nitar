import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr";
// import reactCss from "vite-react-css";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), svgr(), splitVendorChunkPlugin()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src/"),
			"@api": path.resolve(__dirname, "src", "api/"),
			"@assets": path.resolve(__dirname, "src", "assets/"),
			"@container": path.resolve(__dirname, "src", "container/"),
			"@components": path.resolve(__dirname, "src", "components/"),
			"@pages": path.resolve(__dirname, "src", "pages/"),
			"@types": path.resolve(__dirname, "src", "types/"),
		},
	},
});

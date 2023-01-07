import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr";
import fs from "fs";
// import reactCss from "vite-react-css";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), svgr(), splitVendorChunkPlugin()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src/"),
			"@api": path.resolve(__dirname, "src", "api/"),
			"@assets": path.resolve(__dirname, "src", "assets/"),
			"@constants": path.resolve(__dirname, "src", "constants/"),
			"@container": path.resolve(__dirname, "src", "container/"),
			"@components": path.resolve(__dirname, "src", "components/"),
			"@hooks": path.resolve(__dirname, "src", "hooks/"),
			"@pages": path.resolve(__dirname, "src", "pages/"),
			"@redux": path.resolve(__dirname, "src", "redux/"),
			"@router": path.resolve(__dirname, "src", "router/"),
			"@types": path.resolve(__dirname, "src", "types/"),
			"@utils": path.resolve(__dirname, "src", "utils/"),
		},
	},
	server: {
		https: {
			key: fs.readFileSync("./ssl/localhost-key.pem"),
			cert: fs.readFileSync("./ssl/localhost.pem"),
		},
		watch: {
			usePolling: true,
		},
		host: true, // needed for the Docker Container port mapping to work
		strictPort: true,
		port: 5173, // you can replace this port with any port
		proxy: {
			"/api/": "http://backend:8000",
			"/backend/": "http://backend:8000",
			"/media/": "http://backend:8000",
		},
	},
	build: {
		chunkSizeWarningLimit: 1000,
		assetsDir: "static",
	},
});

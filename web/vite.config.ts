import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		watch: {
			usePolling: true,
			},
		host: "0.0.0.0",
		port: 5173,
		proxy: {
			"/api": {
				target: "http://backend:3001", // Use the service name from docker-compose
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""), // Removes /api before sending to backend
			},
		},
	},
})

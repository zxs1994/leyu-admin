import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import tailwindcss from '@tailwindcss/vite'
import svgLoader from 'vite-svg-loader'
import pkg from './package.json'
import compression from 'vite-plugin-compression'

import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	return {
		plugins: [
			vue(),
			vueDevTools(),
			tailwindcss(),
			Components({
				resolvers: [
					AntDesignVueResolver({
						importStyle: false, // css in js
					}),
				],
			}),
			svgLoader(),
			compression({
				algorithm: 'gzip',
				ext: '.gz',
				threshold: 1024, // 1KB 就压，稳妥
				deleteOriginFile: false, // 不删原文件
			}),
		],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},
		// server: {
		// 	host: '0.0.0.0', // 👈 让局域网也能访问（可选）
		// 	port: 9527, // 👈 启动端口号
		// 	open: true, // 启动后自动打开浏览器（可选）
		// },
		define: {
			__APP_VERSION__: JSON.stringify(pkg.version),
		},
	}
})


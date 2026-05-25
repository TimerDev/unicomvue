import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from "node:child_process";

function safe(cmd) {
  try { return execSync(cmd).toString().trim(); } catch { return ""; }
}

const BRANCH = safe("git rev-parse --abbrev-ref HEAD");
const COMMIT = safe("git rev-parse --short HEAD");
const BUILD_TIME = new Date().toISOString();

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    command === 'serve' ? vueDevTools() : null,
    tailwindcss(),
  ].filter(Boolean),
  define: {
    __APP_BRANCH__: JSON.stringify(BRANCH),
    __APP_COMMIT__: JSON.stringify(COMMIT),
    __APP_BUILD_TIME__: JSON.stringify(BUILD_TIME),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '^/(gettoken|ocs_proxy|basicdata_proxy|qci_proxy)$': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
      },
    },
    host: '0.0.0.0',
    cors:true
  },
}))

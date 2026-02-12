// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   test: {
//     globals: true,
//     environment: 'jsdom',
//     setupFiles: './src/setupTests.js',
//     coverage: {
//       reporter: ['text', 'json', 'html'],
//     },
//   },
//   server: {
//     proxy: {
//       '/': {
//         target: 'http://127.0.0.1:5555',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, ''),
//       },
//     },
//   },
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Use a prefix like /api to avoid proxying your frontend routes
      '/api': {
        target: 'http://127.0.0.1:5555',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Removes /api before sending to Flask
      },
    },
  },
})
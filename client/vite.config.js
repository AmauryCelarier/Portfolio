import { defineConfig } from 'vite'
// vite.config.js

export default {
    define: {
      'process.env': process.env
    },
    server: {
      proxy: process.env.NODE_ENV === 'development'
        ? {
            '/api': 'http://localhost:3001'
          }
        : {}
    }
  }
// vite.config.js
export default {
    server: {
      proxy: process.env.NODE_ENV === 'development'
        ? {
            '/api': 'http://localhost:3001'
          }
        : {}
    }
  }
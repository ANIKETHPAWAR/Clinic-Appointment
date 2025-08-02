// Environment configuration
export const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  NODE_ENV: import.meta.env.MODE || 'development',
  IS_PRODUCTION: import.meta.env.PROD || false,
}; 
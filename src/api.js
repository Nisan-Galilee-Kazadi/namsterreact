const API_URL = 
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.PROD ? 'https://namsterbackend-3.onrender.com/api' : 'http://localhost:3001/api');
export { API_URL };

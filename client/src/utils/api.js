/**
 * Central API URL resolver for CampusLoop.
 * 
 * - In local dev (or when VITE_API_URL is not set): returns relative path (e.g. '/api/listings'),
 *   which is seamlessly handled by Vite's dev proxy.
 * - In production (on Vercel): if VITE_API_URL is set in environment variables
 *   (e.g. 'https://campusloop-api.onrender.com'), prepends it automatically.
 */
const rawUrl = import.meta.env.VITE_API_URL || '';
export const API_BASE_URL = rawUrl.replace(/\/$/, '');

export const apiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

export default apiUrl;

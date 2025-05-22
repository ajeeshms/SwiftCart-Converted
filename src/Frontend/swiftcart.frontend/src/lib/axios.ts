// filename: src\lib\axios.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

// Set base URL to empty string so axios makes requests relative to the host,
// which Vite's proxy will then handle during development.
const baseURL = ''; // import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Ensure cookies are sent/received (potentially for backend cookie auth, though we use Bearer)
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    // Ensure headers object exists before setting Authorization
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 (Unauthorized) and 403 (Forbidden) errors
        if (error.response?.status === 401 || error.response?.status === 403) {
            useAuthStore.getState().logout();
            // Redirect to login, preserving the original path to return to
            window.location.href = `/login?from=${window.location.pathname}`;
        }
        return Promise.reject(error);
    }
);
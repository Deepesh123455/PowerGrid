import axios from 'axios';

interface PersistedAppState {
    state?: {
        accessToken?: string | null;
    };
}

// Base API instance
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach tokens
apiClient.interceptors.request.use(
    (config) => {
        const rawAuthStore = localStorage.getItem('powergrid-auth-storage');
        const rawLegacyStore = localStorage.getItem('powergrid-storage');
        let token: string | null = null;

        if (rawAuthStore) {
            try {
                const parsedStore = JSON.parse(rawAuthStore) as PersistedAppState;
                token = parsedStore.state?.accessToken ?? null;
            } catch {
                token = null;
            }
        }

        // Backward compatibility for sessions persisted before auth decoupling.
        if (!token && rawLegacyStore) {
            try {
                const parsedStore = JSON.parse(rawLegacyStore) as PersistedAppState;
                token = parsedStore.state?.accessToken ?? null;
            } catch {
                token = null;
            }
        }

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle errors (like 401s globally)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 unauth, possibly refresh token here if needed
        return Promise.reject(error);
    }
);

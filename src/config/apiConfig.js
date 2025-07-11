// utils/apiConfig.js

const localApi = 'http://localhost:3001/api';
const renderApi = 'https://game-api-zjod.onrender.com/api';

// Use logic to choose which one
const useRenderInDev = false; // Toggle this if you want Render even in local dev

let baseUrl;

if (import.meta.env.PROD) {
    baseUrl = renderApi;
} else {
    baseUrl = useRenderInDev ? renderApi : localApi;
}

export const API_BASE_URL = baseUrl;

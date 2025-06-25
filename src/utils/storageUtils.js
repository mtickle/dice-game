// src/utils/storageUtils.js

export const saveToStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error(`[storageUtils] Failed to save ${key}:`, e);
    }
};

export const loadFromStorage = (key, fallback = []) => {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (e) {
        console.error(`[storageUtils] Failed to load ${key}:`, e);
        return fallback;
    }
};

export const clearStorageKey = (key) => {
    try {
        localStorage.setItem(key, JSON.stringify([]));
    } catch (e) {
        console.error(`[storageUtils] Failed to clear ${key}:`, e);
    }
};

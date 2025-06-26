// src/utils/storageUtils.js



export const saveToStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value ?? []));
        //localStorage.setItem(key, value);
    } catch (e) {
        console.error(`[storageUtils] Failed to save ${key}:`, e);
    }
};

export function loadFromStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error(`[storageUtils] Error loading ${key}:`, error);
        return [];
    }
}

export const clearStorageKey = (key) => {
    try {
        localStorage.setItem(key, JSON.stringify([]));
    } catch (e) {
        console.error(`[storageUtils] Failed to clear ${key}:`, e);
    }
};

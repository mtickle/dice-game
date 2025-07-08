// src/utils/storageUtils.js

export const saveToStorage = (key, value) => {

    // try {
    //     uploadToAtlas(value)
    // } catch (e) {
    //     console.error(`[storageUtils] oops:`, e);
    // }
    try {
        localStorage.setItem(key, JSON.stringify(value ?? []));
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

export async function saveThingsToDatabase(endpoint, data) {

    //let apiUrl = 'http://localhost:3001/api/' + endpoint;
    let apiUrl = 'https://game-api-zjod.onrender.com/api/' + endpoint;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Failed to save game');
        return await response.json();
    } catch (err) {
        console.error('Error saving game:', err.body || err.message || err``);
    }
}

export async function loadThingsFromDatabase(endpoint, data) {
    try {
        const apiUrl = `https://game-api-zjod.onrender.com/api/${endpoint}/${data}`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.ok) {
            console.log(`Failed to fetch from ${apiUrl}: ${response.statusText}`);
        }

        const jsonData = await response.json();
        return jsonData;

    } catch (error) {
        console.error('Error loading data from database:', error);
        return null; // Or throw, depending on use case
    }
}

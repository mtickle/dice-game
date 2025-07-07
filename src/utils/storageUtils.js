// src/utils/storageUtils.js
import { useAuth0 } from '@auth0/auth0-react';

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

export async function saveGameToDatabase(gameSummary) {

    //console.log('Saving game to database:', gameSummary);

    try {
        const response = await fetch('http://localhost:3001/api/postGameResults', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gameSummary),
        });

        if (!response.ok) throw new Error('Failed to save game');
        return await response.json();
    } catch (err) {
        console.error('Error saving game:', err.body || err.message || err``);
    }
}

export const uploadToAtlas = async (gameStats) => {
    const playerId = useAuth0().user.sub;
    if (!playerId) {
        console.error('[storageUtils] No playerId available for upload');
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/api/upload-game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerId, gameStats }),
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.error);
        console.log(`[storageUtils] Uploaded game ${result.gameNumber} to Atlas`);
    } catch (error) {
        console.error('[storageUtils] Upload to Atlas failed:', error);
    }
};
// firebaseUtils.js
import { db } from '@config/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

export const saveGameToFirebase = async (gameData) => {
    try {
        await addDoc(collection(db, 'games'), gameData);
        console.log('[Firebase] Game saved.');
    } catch (error) {
        console.error('[Firebase] Failed to save game:', error);
    }
};

export const saveTurnsToFirebase = async (turnLog) => {
    const batch = turnLog.map(turn =>
        addDoc(collection(db, 'turns'), turn).catch(err =>
            console.error('[Firebase] Failed to save turn:', err)
        )
    );
    await Promise.all(batch);
};

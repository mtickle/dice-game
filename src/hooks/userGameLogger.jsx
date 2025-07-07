import { useCallback, useRef } from 'react';

// Initializes and manages game logging
export function useGameLogger(gameNumber, user) {
    const turnLogRef = useRef([]);
    const gameLogRef = useRef([]); // Optional: if tracking multiple games

    // Log a single turn's result
    const logTurn = useCallback((turnData) => {
        const entry = {
            gameNumber,
            playerName: user?.nickname || 'Anonymous',
            ...turnData,
        };
        turnLogRef.current.push(entry);
    }, [gameNumber, user]);

    // Get the full turn log
    const getTurnLog = useCallback(() => {
        return [...turnLogRef.current];
    }, []);

    // Clear the current turn log (e.g. on new game)
    const resetTurnLog = useCallback(() => {
        turnLogRef.current = [];
    }, []);

    // Log and store full game summary (for DB, stats, etc.)
    const logGameSummary = useCallback((scores, totals) => {
        const summary = {
            gameNumber,
            playerName: user?.nickname || 'Anonymous',
            timestamp: new Date().toISOString(),
            scores,
            totals,
            turnLog: [...turnLogRef.current],
        };
        gameLogRef.current.push(summary);
        return summary; // for immediate use (e.g. send to API)
    }, [gameNumber, user]);

    return {
        logTurn,
        getTurnLog,
        resetTurnLog,
        logGameSummary,
    };
}

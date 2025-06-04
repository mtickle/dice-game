// utils/gameLogUtils.js

export function createGameLogEntry({
    type,              // 'roll', 'hold', 'score', 'bonus', 'end'
    player,            // 'player' or 'bot'
    dice,              // current dice array [{ value, held }]
    category = null,   // optional: scoring category
    score = null,      // optional: score applied
    advice = null,     // optional: AI suggestion at time
    bonus = null,      // optional: any bonus applied
    turn = null,       // optional: current turn index
}) {
    return {
        timestamp: new Date().toISOString(),
        type,
        player,
        dice: dice.map(d => ({ ...d })), // snapshot of dice state
        category,
        score,
        advice,
        bonus,
        turn,
    };
}

export function summarizeFinalScore(scores, gameHistory) {
    return {
        upperTotal: calculateUpperTotal(scores),
        lowerTotal: calculateLowerTotal(scores),
        grandTotal: calculateGrandTotal(scores),
        totalTurns: gameHistory.filter(e => e.type === 'score').length,
        yahtzees: Object.entries(scores).filter(([k, v]) => k === 'yahtzee' && v >= 50).length,
    };
}

// Optional: helper to export logs
export function exportGameLog(log) {
    return JSON.stringify(log, null, 2);
}

// You'll want these helpers in scoreUtils if not already imported here:
// import {
//     calculateGrandTotal,
//     calculateLowerTotal,
//     calculateUpperTotal
// } from './scoreUtils';


// aiLabEngine.js

import { runGameSimulation } from './gameSimulator';
import { logLabResult } from './labDataStore';

// === Batch Simulator ===

export async function runLabSession({
    simCount = 1000,
    strategy = 'basic',
    onProgress = () => { },
}) {
    const results = [];

    for (let i = 0; i < simCount; i++) {
        const { finalScore, scores, log } = runGameSimulation(strategy);
        results.push(finalScore);
        logLabResult({ finalScore, scores, log });

        if ((i + 1) % 50 === 0) {
            onProgress(i + 1, simCount);
        }
    }

    const avg = (results.reduce((sum, s) => sum + s, 0) / results.length).toFixed(2);
    const max = Math.max(...results);
    const min = Math.min(...results);

    return { simCount, avg, max, min, results };
}

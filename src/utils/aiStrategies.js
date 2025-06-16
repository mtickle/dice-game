// aiStrategies.js

import { calculateScore } from './utils/scoreUtils';

// Modular: can add multiple strategies
export function selectCategory(strategy, dice, scores, rollCount) {
    switch (strategy) {
        case 'basic':
            return basicGreedyAI(dice, scores);
        // future strategies:
        // case 'perfect':
        // case 'safeUpper':
        default:
            return basicGreedyAI(dice, scores);
    }
}

function basicGreedyAI(dice, scores) {
    const remaining = Object.keys(scores).filter(cat => scores[cat] == null);
    const options = remaining.map(cat => ({
        category: cat,
        score: calculateScore(cat, dice)
    }));

    options.sort((a, b) => b.score - a.score);

    return options.length ? options[0].category : remaining[0];
}

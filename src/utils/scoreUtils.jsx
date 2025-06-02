// utils/scoreUtils.js

import { getCounts } from './diceUtils';
import { lowerCategories, upperCategories } from './utils';

export function calculateScore(category, dice) {
    const counts = getCounts(dice);
    const total = dice.reduce((sum, d) => sum + (d.value || 0), 0);

    //--- Exit if we somehow have no dice or an empty array
    if (!Array.isArray(dice) || dice.length === 0) return 0;

    switch (category) {

        case 'ones':
        case 'twos':
        case 'threes':
        case 'fours':
        case 'fives':
        case 'sixes':
            const face = parseInt(category[0]); // or use a map
            return counts[face - 1] * face;

        case 'twoPair': {
            const pairs = counts
                .map((count, i) => (count >= 2 ? i + 1 : 0))
                .filter((v) => v > 0)
                .sort((a, b) => b - a);
            return pairs.length >= 2 ? pairs[0] * 2 + pairs[1] * 2 : 0;
        }

        case 'threeKind':
            return counts.some((c) => c >= 3) ? total : 0;

        case 'fourKind':
            return counts.some((c) => c >= 4) ? total : 0;

        case 'yahtzee':
            return counts.some((c) => c === 5) ? 50 : 0;

        case 'fullHouse': {
            const hasThree = counts.some(c => c === 3);
            const hasTwo = counts.some(c => c === 2);
            return hasThree && hasTwo ? 25 : 0;
        }

        case 'smallStraight': {
            const joined = counts.map(c => (c > 0 ? '1' : '0')).join('');
            return /1111/.test(joined) ? 30 : 0;
        }

        case 'largeStraight': {
            const joined = counts.map(c => (c > 0 ? '1' : '0')).join('');
            return /11111/.test(joined) ? 40 : 0;
        }

        case 'chance':
            return total;

        default:
            return 0;
    }
}

export function calculateUpperTotal(scores) {
    return ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes']
        .map((key) => scores[key] || 0)
        .reduce((a, b) => a + b, 0);
}

export function calculateLowerTotal(scores) {
    return [
        'twoPair',
        'threeKind',
        'fourKind',
        'fullHouse',
        'smallStraight',
        'largeStraight',
        'yahtzee',
        'chance',
    ]
        .map((key) => scores[key] || 0)
        .reduce((a, b) => a + b, 0);
}

export function calculateBonus(scores) {
    const upper = calculateUpperTotal(scores);
    return upper >= 63 ? 35 : 0;
}

export function calculateGrandTotal(scores) {
    const upper = calculateUpperTotal(scores);
    const lower = calculateLowerTotal(scores);
    const bonus = calculateBonus(scores);
    return upper + lower + bonus;
}

export function getSuggestedScores(currentScores, dice) {
    const suggestions = {};

    [...upperCategories, ...lowerCategories].forEach(category => {
        if (currentScores[category] === null) {
            suggestions[category] = calculateScore(category, dice);
        }
    });

    return suggestions;
}


// utils/scoreUtils.js

import { getCounts } from './diceUtils';

export function calculateScore(category, dice) {
    const counts = getCounts(dice);
    const total = dice.reduce((sum, d) => sum + (d.value || 0), 0);

    switch (category) {
        case 'onePair': {
            const pairs = counts
                .map((count, i) => (count >= 2 ? i + 1 : 0))
                .filter((v) => v > 0);
            return pairs.length ? Math.max(...pairs) * 2 : 0;
        }

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

        case 'fullHouse':
            return counts.includes(3) && counts.includes(2) ? 25 : 0;

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

export function calculateGrandTotal(scores) {
    const upper = calculateUpperTotal(scores);
    const lower = calculateLowerTotal(scores);
    const bonus = upper >= 63 ? 35 : 0;
    return upper + lower + bonus;
}

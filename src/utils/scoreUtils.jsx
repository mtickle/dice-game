// utils/scoreUtils.js

export function calculateScore(category, diceObjs) {
    const dice = diceObjs.map(d => d.value).filter(v => typeof v === 'number');
    const counts = Array(7).fill(0); // Index 1–6
    dice.forEach(d => counts[d]++);
    const total = dice.reduce((a, b) => a + b, 0);

    switch (category) {
        case 'ones':
        case 'twos':
        case 'threes':
        case 'fours':
        case 'fives':
        case 'sixes': {
            const num = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].indexOf(category) + 1;
            return dice.filter(d => d === num).reduce((a, b) => a + b, 0);
        }

        case 'threeKind':
            return counts.some(c => c >= 3) ? total : 0;

        case 'fourKind':
            return counts.some(c => c >= 4) ? total : 0;

        case 'fullHouse':
            return counts.includes(3) && counts.includes(2) ? 25 : 0;

        case 'smallStraight':
            return hasSmallStraight(dice) ? 30 : 0;

        case 'largeStraight':
            return hasLargeStraight(dice) ? 40 : 0;

        case 'yahtzee':
            return counts.includes(5) ? 50 : 0;

        case 'chance':
            return total;

        case 'twoPair':
            return hasTwoPair(counts) ? getTwoPairScore(counts) : 0;

        default:
            return 0;
    }
}

export function calculateSuggestedScores(diceObjs, currentScores = {}) {
    const dice = diceObjs.map(d => d.value).filter(v => typeof v === 'number');
    const counts = Array(7).fill(0);
    dice.forEach(die => counts[die]++);

    const total = dice.reduce((a, b) => a + b, 0);
    const score = {};

    for (let i = 1; i <= 6; i++) {
        const cat = getCategoryName(i);
        if (currentScores[cat] === null) {
            score[cat] = dice.filter(d => d === i).reduce((a, b) => a + b, 0);
        }
    }

    if (currentScores.threeKind === null)
        score.threeKind = counts.some(c => c >= 3) ? total : 0;

    if (currentScores.fourKind === null)
        score.fourKind = counts.some(c => c >= 4) ? total : 0;

    if (currentScores.fullHouse === null)
        score.fullHouse = counts.includes(3) && counts.includes(2) ? 25 : 0;

    if (currentScores.smallStraight === null)
        score.smallStraight = hasSmallStraight(dice) ? 30 : 0;

    if (currentScores.largeStraight === null)
        score.largeStraight = hasLargeStraight(dice) ? 40 : 0;

    if (currentScores.yahtzee === null)
        score.yahtzee = counts.includes(5) ? 50 : 0;

    if (currentScores.chance === null)
        score.chance = total;

    if (currentScores.twoPair === null)
        score.twoPair = hasTwoPair(counts) ? getTwoPairScore(counts) : 0;

    return score;
}

function getCategoryName(i) {
    return ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'][i - 1];
}

function hasSmallStraight(dice) {
    const unique = [...new Set(dice)].sort();
    const straights = [
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 5, 6]
    ];
    return straights.some(s => s.every(n => unique.includes(n)));
}

function hasLargeStraight(dice) {
    const sorted = [...new Set(dice)].sort();
    return JSON.stringify(sorted) === JSON.stringify([1, 2, 3, 4, 5]) ||
        JSON.stringify(sorted) === JSON.stringify([2, 3, 4, 5, 6]);
}

function hasTwoPair(counts) {
    return counts.filter(c => c >= 2).length >= 2;
}

function getTwoPairScore(counts) {
    let pairs = [];
    for (let i = 1; i <= 6; i++) {
        if (counts[i] >= 2) {
            pairs.push(i);
            if (pairs.length === 2) break;
        }
    }
    return pairs.reduce((acc, val) => acc + val * 2, 0);
}

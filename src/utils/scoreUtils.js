export function calculateScore(category, diceObjs) {
    const dice = diceObjs.map(d => d.value).filter(v => typeof v === 'number');
    const counts = Array(6).fill(0);
    dice.forEach(d => counts[d - 1]++);
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
        case 'odds':
            return (counts[0] || 0) * 1 + (counts[2] || 0) * 3 + (counts[4] || 0) * 5; // 1s, 3s, 5s
        case 'evens':
            return (counts[1] || 0) * 2 + (counts[3] || 0) * 4 + (counts[5] || 0) * 6; // 2s, 4s, 6s
        case 'threeofakind':
            return hasThreeOfKind(counts) ? total : 0;
        case 'fourofaind':
            return hasFourOfKind(counts) ? total : 0;
        case 'fullhouse':
            return hasFullHouse(counts) ? 25 : 0;
        case 'smallstraight':
            return hasSmallStraight(dice) ? 30 : 0;
        case 'largestraight':
            return hasLargeStraight(dice) ? 40 : 0;
        case 'yahtzee':
            return counts.includes(5) ? 50 : 0;
        case 'chance':
            return total;
        case 'twopair':
            return hasTwoPair(counts) ? getTwoPairScore(counts) : 0;
        case 'onepair': {
            for (let i = 5; i >= 0; i--) {
                if (counts[i] >= 2) {
                    return (i + 1) * 2;
                }
            }
            return 0;
        }
        default:
            return 0;
    }
}

export function calculateSuggestedScores(diceObjs, currentScores = {}) {
    const dice = diceObjs.map(d => d.value).filter(v => typeof v === 'number');
    const counts = Array(6).fill(0);
    dice.forEach(d => counts[d - 1]++);
    const total = dice.reduce((a, b) => a + b, 0);
    const score = {};

    for (let i = 1; i <= 6; i++) {
        const cat = getCategoryName(i);
        if (currentScores[cat] === null || currentScores[cat] === undefined) {
            const val = dice.filter(d => d === i).reduce((a, b) => a + b, 0);
            if (val > 0) score[cat] = val;
        }
    }

    // Add ODDS and EVENS suggestions
    if (currentScores.odds === null || currentScores.odds === undefined) {
        const oddsScore = (counts[0] || 0) * 1 + (counts[2] || 0) * 3 + (counts[4] || 0) * 5;
        if (oddsScore > 0) score.odds = oddsScore;
    }
    if (currentScores.evens === null || currentScores.evens === undefined) {
        const evensScore = (counts[1] || 0) * 2 + (counts[3] || 0) * 4 + (counts[5] || 0) * 6;
        if (evensScore > 0) score.evens = evensScore;
    }

    if (currentScores.threeofakind === null && hasThreeOfKind(counts)) score.threeofakind = total;
    if (currentScores.fourofakind === null && hasFourOfKind(counts)) score.fourofakind = total;
    if (currentScores.fullhouse === null && hasFullHouse(counts)) score.fullhouse = 25;
    if (currentScores.smallstraight === null && hasSmallStraight(dice)) score.smallstraight = 30;
    if (currentScores.largestraight === null && hasLargeStraight(dice)) score.largestraight = 40;
    if (currentScores.yahtzee === null && counts.includes(5)) score.yahtzee = 50;
    if (currentScores.chance === null) score.chance = total;
    if (currentScores.twopair === null && hasTwoPair(counts)) score.twopair = getTwoPairScore(counts);
    if (currentScores.onepair === null) {
        for (let i = 5; i >= 0; i--) {
            if (counts[i] >= 2) {
                score.onepair = (i + 1) * 2;
                break;
            }
        }
    }

    return score;
}

// --- Helper functions ---

function getCategoryName(i) {
    return ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'][i - 1] || null; // Only 1-6 mapped
}

function hasThreeOfKind(counts) {
    return counts.some(c => c >= 3);
}

function hasFourOfKind(counts) {
    return counts.some(c => c >= 4);
}

function hasFullHouse(counts) {
    return counts.includes(3) && counts.includes(2);
}

function hasSmallStraight(dice) {
    const unique = [...new Set(dice)].sort();
    const straights = [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6]];
    return straights.some(s => s.every(n => unique.includes(n)));
}

function hasLargeStraight(dice) {
    const sorted = [...new Set(dice)].sort();
    return JSON.stringify(sorted) === JSON.stringify([1, 2, 3, 4, 5])
        || JSON.stringify(sorted) === JSON.stringify([2, 3, 4, 5, 6]);
}

function hasTwoPair(counts) {
    return counts.filter(c => c >= 2).length >= 2;
}

function getTwoPairScore(counts) {
    let pairs = [];
    for (let i = 6; i >= 1; i--) {
        if (counts[i - 1] >= 2) {
            pairs.push(i);
            if (pairs.length === 2) break;
        }
    }
    return pairs.reduce((acc, val) => acc + val * 2, 0);
}

export function matchesCategory(category, diceObjs) {
    const dice = diceObjs.map(d => d.value).filter(v => typeof v === 'number');
    const counts = Array(6).fill(0);
    dice.forEach(d => counts[d - 1]++);

    switch (category) {
        case 'fullhouse': return hasFullHouse(counts);
        case 'smallstraight': return hasSmallStraight(dice);
        case 'largestraight': return hasLargeStraight(dice);
        case 'fourofakind': return hasFourOfKind(counts);
        default: return false;
    }
}
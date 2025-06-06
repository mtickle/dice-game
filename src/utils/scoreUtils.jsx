
export function calculateScore(category, diceObjs) {

    const dice = diceObjs.map(d => d.value).filter(v => typeof v === 'number');
    const counts = Array(6).fill(0); // Index 0–5 for values 1–6
    dice.forEach(d => counts[d - 1]++);
    const total = dice.reduce((a, b) => a + b, 0);

    // console.log('Raw diceObjs:', diceObjs);
    // console.log('Mapped dice values:', dice);

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

        case 'onePair': {
            // Find the highest value with at least two dice
            for (let i = 5; i >= 0; i--) {
                if (counts[i] >= 2) {
                    const score = (i + 1) * 2;
                    console.log(`Found pair of ${(i + 1)}s, score: ${score}`);
                    return score;
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
    const counts = Array(6).fill(0); // Index 0–5 for values 1–6
    dice.forEach(d => counts[d - 1]++);
    const total = dice.reduce((a, b) => a + b, 0);
    const score = {};

    // Upper section (ones through sixes)
    for (let i = 1; i <= 6; i++) {
        const cat = getCategoryName(i);
        if (currentScores[cat] === null) {
            const val = dice.filter(d => d === i).reduce((a, b) => a + b, 0);
            if (val > 0) score[cat] = val;
        }
    }

    // Three of a Kind
    if (currentScores.threeKind === null) {
        const val = counts.some(c => c >= 3) ? total : 0;
        if (val > 0) score.threeKind = val;
    }

    // Four of a Kind
    if (currentScores.fourKind === null) {
        const val = counts.some(c => c >= 4) ? total : 0;
        if (val > 0) score.fourKind = val;
    }

    // Full House
    if (currentScores.fullHouse === null) {
        const val = (counts.includes(3) && counts.includes(2)) ? 25 : 0;
        if (val > 0) score.fullHouse = val;
    }

    // Small Straight
    if (currentScores.smallStraight === null) {
        const val = hasSmallStraight(dice) ? 30 : 0;
        if (val > 0) score.smallStraight = val;
    }

    // Large Straight
    if (currentScores.largeStraight === null) {
        const val = hasLargeStraight(dice) ? 40 : 0;
        if (val > 0) score.largeStraight = val;
    }

    // Yahtzee
    if (currentScores.yahtzee === null) {
        const val = counts.includes(5) ? 50 : 0;
        if (val > 0) score.yahtzee = val;
    }

    // Chance
    if (currentScores.chance === null) {
        if (total > 0) score.chance = total;
    }

    // Two Pair
    if (currentScores.twoPair === null) {
        const val = hasTwoPair(counts) ? getTwoPairScore(counts) : 0;
        if (val > 0) score.twoPair = val;
    }

    // One Pair
    if (currentScores.onePair === null) {
        let val = 0;
        for (let i = 5; i >= 0; i--) {
            if (counts[i] >= 2) {
                val = (i + 1) * 2;
                break;
            }
        }
        if (val > 0) score.onePair = val;
    }

    return score;
}


// export function calculateSuggestedScores(diceObjs, currentScores = {}) {

//     const dice = diceObjs.map(d => d.value).filter(v => typeof v === 'number');
//     const counts = Array(6).fill(0); // Index 0–5 for values 1–6
//     dice.forEach(d => counts[d - 1]++);
//     const total = dice.reduce((a, b) => a + b, 0);
//     const score = {};

//     for (let i = 1; i <= 6; i++) {
//         const cat = getCategoryName(i);
//         if (currentScores[cat] === null) {
//             const val = dice.filter(d => d === i).reduce((a, b) => a + b, 0);
//             if (val > 0) score[cat] = val;
//         }
//     }

//     if (currentScores.threeKind === null) {
//         const val = counts.some(c => c >= 3) ? total : 0;
//         if (val > 0) score.threeKind = val;
//     }

//     if (currentScores.fourKind === null) {
//         const val = counts.some(c => c >= 4) ? total : 0;
//         if (val > 0) score.fourKind = val;
//     }

//     if (currentScores.fullHouse === null) {
//         const val = (counts.includes(3) && counts.includes(2)) ? 25 : 0;
//         if (val > 0) score.fullHouse = val;
//     }

//     if (currentScores.smallStraight === null) {
//         const val = hasSmallStraight(dice) ? 30 : 0;
//         if (val > 0) score.smallStraight = val;
//     }

//     if (currentScores.largeStraight === null) {
//         const val = hasLargeStraight(dice) ? 40 : 0;
//         if (val > 0) score.largeStraight = val;
//     }

//     if (currentScores.yahtzee === null) {
//         const val = counts.includes(5) ? 50 : 0;
//         if (val > 0) score.yahtzee = val;
//     }

//     if (currentScores.chance === null) {
//         if (total > 0) score.chance = total;
//     }

//     if (currentScores.twoPair === null) {
//         const val = hasTwoPair(counts) ? getTwoPairScore(counts) : 0;
//         if (val > 0) score.twoPair = val;
//     }

//     if (currentScores.onePair === null) {



//         // const val = counts.findIndex(c => c >= 2);
//         // // Find the highest value with at least two dice
//         // if (val >= 0) {
//         //     const score = (val + 1) * 2; // Convert index to value (1-6)
//         //     console.log(`Found pair of ${(val + 1)}s, score: ${score}`);
//         //     score.onePair = score;
//         // }

//         // for (let i = 5; i >= 0; i--) {
//         //     if (counts[i] >= 2) {
//         //         const score = (i + 1) * 2;
//         //         console.log(`Found pair of ${(i + 1)}s, score: ${score}`);
//         //     }
//         // }
//         // if (val > 0) score.onePair = val;


//         //const val = counts.findIndex(c => c >= 2);
//         //if (val > 0) score.onePair = val * 2; // Only one pair — the highest
//     }

//     return score;
// }


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

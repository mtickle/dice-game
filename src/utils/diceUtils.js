
export function generateNewDice() {
    return Array.from({ length: 5 }, () => ({
        value: Math.ceil(Math.random() * 6),
        held: false,
    }));
}

// export function getCounts(dice) {
//     const counts = Array(6).fill(0);
//     dice.forEach((d) => {
//         if (d.value != null) counts[d.value - 1]++;
//     });
//     return counts;
// }

export function getCounts(dice) {
    const counts = [0, 0, 0, 0, 0, 0]; // Only six entries: for 1–6
    for (const die of dice) {
        if (die?.value != null && die.value >= 1 && die.value <= 6) {
            counts[die.value - 1]++;
        }
    }
    return counts;
}

export function rollUnheldDice(dice) {
    return dice.map((die) =>
        die.held ? die : { ...die, value: Math.ceil(Math.random() * 6) }
    );
}

export function toggleHold(index, dice) {
    return dice.map((die, i) =>
        i === index ? { ...die, held: !die.held } : die
    );
}


export function getUsedDiceIndexesForCategory(category, dice) {
    const used = new Array(dice.length).fill(false);

    const count = {};
    dice.forEach((d) => (count[d] = (count[d] || 0) + 1));

    const markIndices = (value, limit = Infinity) => {
        let found = 0;
        dice.forEach((d, i) => {
            if (d === value && found < limit) {
                used[i] = true;
                found++;
            }
        });
    };

    switch (category) {
        case 'ones':
        case 'twos':
        case 'threes':
        case 'fours':
        case 'fives':
        case 'sixes': {
            const num = parseInt(category[0]); // 'f' from "fives"
            const value = {
                one: 1, two: 2, three: 3, four: 4, five: 5, six: 6
            }[category.replace(/s$/, '')];
            dice.forEach((d, i) => {
                if (d === value) used[i] = true;
            });
            break;
        }

        case 'threeOfAKind':
        case 'fourOfAKind': {
            const needed = category === 'threeOfAKind' ? 3 : 4;
            for (const val in count) {
                if (count[val] >= needed) {
                    markIndices(Number(val), needed);
                    break;
                }
            }
            break;
        }

        case 'yahtzee': {
            for (const val in count) {
                if (count[val] === 5) {
                    dice.forEach((d, i) => {
                        used[i] = true;
                    });
                    break;
                }
            }
            break;
        }

        case 'fullHouse': {
            let triple = null;
            let pair = null;
            for (const val in count) {
                if (count[val] === 3) triple = Number(val);
                else if (count[val] === 2) pair = Number(val);
            }
            if (triple !== null) markIndices(triple, 3);
            if (pair !== null) markIndices(pair, 2);
            break;
        }

        case 'smallStraight':
        case 'largeStraight': {
            const needed = category === 'largeStraight' ? 5 : 4;
            const unique = [...new Set(dice)].sort();
            const sequences = [
                [1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6], // small
                [1, 2, 3, 4, 5], [2, 3, 4, 5, 6]         // large
            ];
            const match = sequences.find(seq => seq.every(v => unique.includes(v)) && seq.length === needed);
            if (match) {
                match.forEach((val) => {
                    for (let i = 0; i < dice.length; i++) {
                        if (dice[i] === val && !used[i]) {
                            used[i] = true;
                            break;
                        }
                    }
                });
            }
            break;
        }

        case 'chance': {
            used.fill(true);
            break;
        }

        case 'evens': {
            dice.forEach((d, i) => {
                if (d % 2 === 0) used[i] = true;
            });
            break;
        }

        case 'odds': {
            dice.forEach((d, i) => {
                if (d % 2 === 1) used[i] = true;
            });
            break;
        }

        case 'twoPair': {
            const pairs = Object.entries(count).filter(([v, c]) => c >= 2).map(([v]) => Number(v));
            if (pairs.length >= 2) {
                markIndices(pairs[0], 2);
                markIndices(pairs[1], 2);
            }
            break;
        }

        case 'onePair': {
            const pair = Object.entries(count).find(([v, c]) => c >= 2);
            if (pair) markIndices(Number(pair[0]), 2);
            break;
        }

        default:
            break;
    }

    return used;
}


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

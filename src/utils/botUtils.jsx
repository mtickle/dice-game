// utils/botUtils.js

import { getCounts } from './diceUtils';
import { calculateScore } from './scoreUtils';

// Prioritized categories for targeting
const priorityCategories = [
    'yahtzee',
    'fourKind',
    'threeKind',
    'fullHouse',
    'largeStraight',
    'smallStraight',
    'twoPair',
    'chance',
];

export function chooseBestCategory(dice, scores) {
    let bestCategory = null;
    let bestScore = -1;

    Object.keys(scores).forEach((category) => {
        if (scores[category] === null) {
            const score = calculateScore(category, dice);
            if (score > bestScore) {
                bestScore = score;
                bestCategory = category;
            }
        }
    });

    return bestCategory;
}

// Analyze dice and return index list of which to hold
function chooseDiceToHold(dice, scores) {
    const counts = getCounts(dice);
    const valueToKeep = counts.indexOf(Math.max(...counts)) + 1;

    // If pursuing Yahtzee or Four of a Kind, hold most frequent number
    const holdIndices = dice
        .map((d, i) => (d.value === valueToKeep ? i : -1))
        .filter((i) => i !== -1);

    // Adjust strategy for specific cases
    if (counts.includes(3) && counts.includes(2)) {
        // Already have full house — keep all
        return dice.map((_, i) => i);
    }

    return holdIndices;
}

export function botPlayTurn({
    rollDice,
    holdDie,
    dice,
    scores,
    applyScore,
    setTurnComplete,
    setDice,
}) {
    let rollCount = 0;

    const botTurn = () => {
        if (rollCount === 0) {
            rollDice();
            rollCount++;
            setTimeout(botTurn, 600);
        } else if (rollCount < 3) {
            const holdIndices = chooseDiceToHold(dice, scores);

            dice.forEach((_, i) => holdDie(i, holdIndices.includes(i)));

            rollDice();
            rollCount++;
            setTimeout(botTurn, 600);
        } else {
            const bestCategory = chooseBestCategory(dice, scores);
            if (bestCategory) {
                applyScore(bestCategory, true); // true = bot
                setTurnComplete(true);
            }
        }
    };

    botTurn();
}

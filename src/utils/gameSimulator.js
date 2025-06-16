// gameSimulator.js

import { selectCategory } from './aiStrategies';
import { calculateScore } from './utils/scoreUtils';
import { initialScores, lowerCategories, upperCategories } from './utils/utils';

function generateRandomDice() {
    return Array(5).fill(0).map(() => Math.floor(Math.random() * 6) + 1);
}

function rerollDice(dice, held) {
    return dice.map((v, i) => (held[i] ? v : Math.floor(Math.random() * 6) + 1));
}

export function runGameSimulation(strategyName = 'basic') {
    let scores = { ...initialScores };
    let log = [];
    let turn = 1;

    while (Object.values(scores).some(val => val == null)) {
        let dice = generateRandomDice();
        let rollCount = 1;

        // Simple fixed reroll logic (can replace with smarter AI)
        while (rollCount < 3) {
            const held = dice.map(v => v === 6);  // Hold 6s as an example
            dice = rerollDice(dice, held);
            rollCount++;
        }

        const category = selectCategory(strategyName, dice, scores, rollCount);
        const score = calculateScore(category, dice);
        scores[category] = score;

        log.push({ turn, dice, category, score });
        turn++;
    }

    const finalScore = calculateTotalScore(scores);

    return { finalScore, scores, log };
}

function calculateTotalScore(scores) {
    const upperSubtotal = upperCategories.reduce((sum, cat) => sum + (scores[cat] || 0), 0);
    const bonus = upperSubtotal >= 63 ? 35 : 0;
    const upperTotal = upperSubtotal + bonus;
    const lowerTotal = lowerCategories.reduce((sum, cat) => sum + (scores[cat] || 0), 0);
    return upperTotal + lowerTotal;
}

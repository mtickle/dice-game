// utils/strategyUtils.js

import { getCounts } from './diceUtils';

const rollOdds = {
    fullHouse: '1 in 15',
    yahtzee: '1 in 1296',
    largeStraight: '1 in 154',
    smallStraight: '1 in 25',
    fourKind: '1 in 24',
    threeKind: '1 in 8',
};

export function getStrategyAdvice(dice, scores) {
    const counts = getCounts(dice);
    const values = dice.map(d => d.value).filter(v => v !== null);
    const total = values.reduce((a, b) => a + b, 0);

    let advice = [];
    let target = null;
    let odds = null;

    const unscored = Object.entries(scores)
        .filter(([k, v]) => v === null)
        .map(([k]) => k);

    const hasTriple = counts.includes(3);
    // const hasPair = counts.includes(2);
    const hasQuad = counts.includes(4);
    const hasFive = counts.includes(5);
    const hasPair = counts.filter(c => c === 2).length >= 1;

    if (hasFive && scores.yahtzee === null) {
        advice.push("🎯 Yahtzee! Score it now.");
        target = "yahtzee";
    } else if (hasQuad && scores.fourKind === null) {
        advice.push(`💥 Four of a kind! Lock in ${total} points.`);
        target = "fourKind";
        odds = rollOdds.fourKind;
    } else if (hasTriple && hasPair && scores.fullHouse === null) {
        advice.push("🏠 Full House! Solid 25 points.");
        target = "fullHouse";
        odds = rollOdds.fullHouse;
    } else if (isStraight(counts, 5) && scores.largeStraight === null) {
        advice.push("📈 Large Straight! Rare and valuable.");
        target = "largeStraight";
        odds = rollOdds.largeStraight;
    } else if (isStraight(counts, 4) && scores.smallStraight === null) {
        advice.push(`📉 Small Straight - Solid 30 points.`);
        target = "smallStraight";
        odds = rollOdds.smallStraight;
    } else if (hasTriple && scores.threeKind === null) {
        advice.push(`👌 Three of a kind! ${total} points.`);
        target = "threeKind";
        odds = rollOdds.threeKind;
    } else if (hasPair && scores.onePair === null) {
        const bestPairValue = counts.lastIndexOf(2);
        advice.push(`👥 One Pair of ${bestPairValue + 1}s for ${(bestPairValue + 1) * 2} points.`);
        target ||= 'onePair';
        odds = rollOdds.onePair;
    } else if (scores.chance === null) {
        advice.push(`🎲 Consider scoring Chance for ${total} points.`);
        target = "chance";
    }

    // Upper section tip
    const upperNums = ['sixes', 'fives', 'fours', 'threes', 'twos', 'ones'];
    for (const num of upperNums) {
        const value = { ones: 1, twos: 2, threes: 3, fours: 4, fives: 5, sixes: 6 }[num];
        const count = counts[value - 1];
        if (count >= 3 && scores[num] === null) {
            advice.push(`⬆️ You have ${count} × ${value}s for ${count * value} points.`);
            target ||= num;
            break;
        } else if (count >= 2 && scores[num] === null) {
            advice.push(`🤷 You have ${count} × ${value}s`);
        }
    }

    // General fallback
    if (advice.length === 0) {
        advice.push("Sacrifice a category ...");
    }

    return {
        advice,
        odds,
        target,
        summary: advice[0],
    };
}

function isStraight(counts, length) {
    const binary = counts.map(c => (c > 0 ? 1 : 0)).join('');
    return length === 4
        ? binary.includes('1111')
        : binary.includes('11111');
}

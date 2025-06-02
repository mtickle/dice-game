// src/utils.js

export const prettyName = (category) => {
    const names = {
        ones: 'Aces',
        twos: 'Twos',
        threes: 'Threes',
        fours: 'Fours',
        fives: 'Fives',
        sixes: 'Sixes',
        twoPair: 'Two Pair',
        threeKind: '3 of a Kind',
        fourKind: '4 of a Kind',
        fullHouse: 'Full House',
        smallStraight: 'Sm. Straight',
        largeStraight: 'Lg. Straight',
        yahtzee: 'Yahtzee',
        chance: 'Chance',
    };
    return names[category] || category;
};

export const iconMap = {
    ones: '1️⃣',
    twos: '2️⃣',
    threes: '3️⃣',
    fours: '4️⃣',
    fives: '5️⃣',
    sixes: '6️⃣',
    onePair: '👯‍♂️',
    twoPair: '👬',
    threeKind: '🎲🎲🎲',
    fourKind: '🎲🎲🎲🎲',
    fullHouse: '🏠',
    smallStraight: '➡️',
    largeStraight: '⤴️',
    yahtzee: '🎉',
    chance: '🎯',
};

export const dotPositions = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
};

export const upperCategories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];

export const lowerCategories = ['twoPair', 'threeKind', 'fourKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yahtzee', 'chance'];

export const initialScores = {
    ones: null,
    twos: null,
    threes: null,
    fours: null,
    fives: null,
    sixes: null,
    twoPair: null,
    threeKind: null,
    fourKind: null,
    fullHouse: null,
    smallStraight: null,
    largeStraight: null,
    yahtzee: null,
    chance: null,
};


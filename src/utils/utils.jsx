// src/utils.js

export const prettyName = (category) => {
    const names = {
        ones: 'Ones',
        twos: 'Twos',
        threes: 'Threes',
        fours: 'Fours',
        fives: 'Fives',
        sixes: 'Sixes',
        onePair: 'One Pair',
        twoPair: 'Two Pair',
        threeKind: 'Three of a Kind',
        fourKind: 'Four of a Kind',
        fullHouse: 'Full House',
        smallStraight: 'Small Straight',
        largeStraight: 'Large Straight',
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

// src/utils.js

export function DiceBreakerLogo() {
    return (
        <svg
            className="dice-logo"
            width="32"
            height="32"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect x="10" y="10" width="80" height="80" rx="15" ry="15" fill="#111" stroke="#FF00CC" strokeWidth="5" />
            <circle cx="30" cy="30" r="6" fill="#00FFD5" />
            <circle cx="50" cy="50" r="6" fill="#FFD700" />
            <circle cx="70" cy="70" r="6" fill="#00FFD5" />
        </svg>
    );
}

export const prettyName = (category) => {
    const names = {
        ones: 'Aces',
        twos: 'Twos',
        threes: 'Threes',
        fours: 'Fours',
        fives: 'Fives',
        sixes: 'Sixes',
        onePair: 'One Pair',
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

export function getPrettyName(category) {
    return prettyName(category);
}

export const prettyNameWords = (category) => {
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

export const lowerCategories = ['onePair', 'twoPair', 'threeKind', 'fourKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yahtzee', 'chance'];

export const initialScores = {
    ones: null,
    twos: null,
    threes: null,
    fours: null,
    fives: null,
    sixes: null,
    onePair: null,
    twoPair: null,
    threeKind: null,
    fourKind: null,
    fullHouse: null,
    smallStraight: null,
    largeStraight: null,
    yahtzee: null,
    chance: null,
};


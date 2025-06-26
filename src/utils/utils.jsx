export const upperCategories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes', 'odds', 'evens'];
export const lowerCategories = [
    'onePair',
    'twoPair',
    'threeKind',
    'fourKind',
    'fullHouse',
    'smallStraight',
    'largeStraight',
    'yahtzee',
    'chance',
];
export const allCategories = [...upperCategories, ...lowerCategories];
export const initialScores = Object.fromEntries(allCategories.map((cat) => [cat, null]));

export const prettyName = (category) => {
    const names = {
        ones: 'Aces',
        twos: 'Twos',
        threes: 'Threes',
        fours: 'Fours',
        fives: 'Fives',
        sixes: 'Sixes',
        odds: 'Odds',
        evens: 'Evens',
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

export const generateGameNumber = () => {
    const now = new Date();
    return `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${now.getFullYear()}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
};
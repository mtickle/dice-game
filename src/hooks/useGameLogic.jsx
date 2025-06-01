import { useState } from 'react';
import { generateNewDice } from '../utils/diceUtils';
import { calculateScore, initialScores } from '../utils/scoreUtils';

export default function useGameLogic(playerCount = 2) {
    const [players, setPlayers] = useState(() =>
        Array.from({ length: playerCount }, (_, i) => ({
            id: i,
            name: i === 0 ? 'You' : `Bot ${i}`,
            isBot: i !== 0,
            scores: { ...initialScores },
        }))
    );

    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [dice, setDice] = useState(generateNewDice());
    const [rollCount, setRollCount] = useState(0);
    const [turnComplete, setTurnComplete] = useState(false);

    // Bonus state
    const [bonusCategory, setBonusCategory] = useState(null);

    const rollDice = () => {
        if (rollCount >= 3) return;
        setDice(prev =>
            prev.map(d => (d.held ? d : { value: Math.ceil(Math.random() * 6), held: false }))
        );
        setRollCount(rc => rc + 1);
    };

    const holdDie = (index) => {
        setDice(prev => prev.map((d, i) => (i === index ? { ...d, held: !d.held } : d)));
    };

    const applyScore = (category) => {
        const player = players[currentPlayer];
        if (player.scores[category] !== null) return;

        let score = calculateScore(category, dice);
        const firstRollBonusCategories = ['threeKind', 'fourKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yahtzee'];

        if (rollCount === 1 && score > 0 && firstRollBonusCategories.includes(category)) {
            score += 10;
            setBonusCategory(category);
            setTimeout(() => setBonusCategory(null), 3000);
        }

        const updatedPlayers = [...players];
        updatedPlayers[currentPlayer].scores[category] = score;
        setPlayers(updatedPlayers);

        endTurn();
    };

    const endTurn = () => {
        setTurnComplete(true);
        setTimeout(() => {
            setDice(generateNewDice());
            setRollCount(0);
            setTurnComplete(false);
            setCurrentPlayer((currentPlayer + 1) % players.length);
        }, 500);
    };

    return {
        players,
        currentPlayer,
        dice,
        rollCount,
        turnComplete,
        bonusCategory,
        rollDice,
        holdDie,
        applyScore,
        setPlayers, // for future use (e.g., resetting)
    };
}

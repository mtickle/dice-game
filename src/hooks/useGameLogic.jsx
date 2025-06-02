// hooks/useGameLogic.js

import { useEffect, useState } from 'react';
import { chooseBestCategory } from '../utils/botUtils';
import { calculateGrandTotal, calculateLowerTotal, calculateScore, calculateUpperTotal } from '../utils/scoreUtils';

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

const initialDice = () => Array(5).fill({ value: null, held: false });

export default function useGameLogic() {
    const [dice, setDice] = useState(initialDice);
    const [rollCount, setRollCount] = useState(0);
    const [playerScores, setPlayerScores] = useState(initialScores);
    const [botScores, setBotScores] = useState(initialScores);
    const [currentPlayer, setCurrentPlayer] = useState('player'); // 'player' | 'bot'
    const [suggestedScores, setSuggestedScores] = useState({});
    const [turnComplete, setTurnComplete] = useState(false);

    // Suggested scores update
    useEffect(() => {
        if (rollCount > 0 && currentPlayer === 'player') {
            const suggestions = {};
            Object.entries(playerScores).forEach(([category, value]) => {
                if (value === null) {
                    suggestions[category] = calculateScore(category, dice);
                }
            });
            setSuggestedScores(suggestions);
        } else {
            setSuggestedScores({});
        }
    }, [dice, playerScores, currentPlayer, rollCount]);

    // Dice rolling
    const rollDice = () => {
        if (rollCount >= 3 || turnComplete) return;
        setDice(prev =>
            prev.map(d => (d.held ? d : { value: Math.ceil(Math.random() * 6), held: false }))
        );
        setRollCount(c => c + 1);
    };

    const holdDie = index => {
        setDice(prev => prev.map((d, i) => i === index ? { ...d, held: !d.held } : d));
    };

    const resetTurn = () => {
        setDice(initialDice);
        setRollCount(0);
        setTurnComplete(false);
    };

    const applyScore = category => {
        if (currentPlayer !== 'player') return;

        const newScores = { ...playerScores, [category]: calculateScore(category, dice) };
        setPlayerScores(newScores);
        setTurnComplete(true);

        setTimeout(() => {
            setCurrentPlayer('bot');
            resetTurn();
        }, 500);
    };

    // Bot logic
    useEffect(() => {
        if (currentPlayer === 'bot') {
            setTimeout(() => botTakeTurn(), 600);
        }
    }, [currentPlayer]);

    const botTakeTurn = () => {
        let botDice = initialDice();
        for (let i = 0; i < 3; i++) {
            botDice = botDice.map(() => ({ value: Math.ceil(Math.random() * 6), held: false }));
        }
        const botSuggestion = chooseBestCategory(botDice, botScores);
        const updated = { ...botScores, [botSuggestion]: calculateScore(botSuggestion, botDice) };
        setBotScores(updated);

        setTimeout(() => {
            setCurrentPlayer('player');
            resetTurn();
        }, 500);
    };

    return {
        dice,
        rollCount,
        rollDice,
        holdDie,
        applyScore,
        turnComplete,
        currentPlayer,
        playerScores,
        botScores,
        suggestedScores,
        upperTotal: calculateUpperTotal(playerScores),
        lowerTotal: calculateLowerTotal(playerScores),
        grandTotal: calculateGrandTotal(playerScores),
        bonusCategory: Object.keys(playerScores).find(cat =>
            cat !== null && calculateScore(cat, dice) >= 10 // just an example
        ),
        resetGame: () => {
            setPlayerScores(initialScores());
            setBotScores(initialScores());
            setCurrentPlayer('player');
            resetTurn();
        }
    };
}

import { useEffect, useState } from 'react';
import { getSuggestedScores } from '../utils/botUtils';
import { initialScores } from '../utils/constants';
import { calculateScore } from '../utils/scoreUtils';
import { lowerCategories, upperCategories } from '../utils/utils';

export function useGameLogic() {
    const [players, setPlayers] = useState([
        { name: 'You', scores: { ...initialScores } },
        { name: 'Bot', scores: { ...initialScores } },
    ]);

    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [dice, setDice] = useState(Array(5).fill().map(() => ({ value: null, held: false })));
    const [rollCount, setRollCount] = useState(0);
    const [turnComplete, setTurnComplete] = useState(false);
    const [bonusCategory, setBonusCategory] = useState(null);
    const [bonusMessage, setBonusMessage] = useState('');
    const [bonusFadingOut, setBonusFadingOut] = useState(false);

    const currentPlayer = players[currentPlayerIndex];

    // Check if game is over (all scores filled for all players)
    const isGameOver = players.every(p =>
        Object.values(p.scores).every(score => score !== null)
    );

    // Suggested scores for the current player based on current dice
    const suggestedScores = getSuggestedScores(currentPlayer.scores, dice);

    // Calculate totals helper
    const safeNumber = (v) => (typeof v === 'number' && !isNaN(v) ? v : 0);

    const calcTotals = (scores) => {
        const upperSubtotal = upperCategories.reduce(
            (sum, key) => sum + safeNumber(scores[key]),
            0
        );
        const bonus = upperSubtotal >= 63 ? 35 : 0;
        const upperTotal = upperSubtotal + bonus;
        const lowerTotal = lowerCategories.reduce(
            (sum, key) => sum + safeNumber(scores[key]),
            0
        );
        const grandTotal = upperTotal + lowerTotal;
        return { upperSubtotal, bonus, upperTotal, lowerTotal, grandTotal };
    };

    const totals = calcTotals(currentPlayer.scores);

    // Roll dice, max 3 times, not if turn complete or game over
    const rollDice = () => {
        if (rollCount >= 3 || turnComplete || isGameOver) return;
        setDice(dice.map(d => (d.held ? d : { ...d, value: Math.floor(Math.random() * 6) + 1 })));
        setRollCount(c => c + 1);
    };

    // Toggle hold state on a die, only after first roll and if turn not complete
    const toggleHold = (i) => {
        if (rollCount === 0 || turnComplete) return;
        setDice(dice.map((d, idx) => (idx === i ? { ...d, held: !d.held } : d)));
    };

    // Apply score to a category, only if allowed
    const applyScore = (category) => {
        if (turnComplete || currentPlayer.scores[category] !== null || rollCount === 0) return;

        const score = calculateScore(category, dice);
        const newPlayers = [...players];
        newPlayers[currentPlayerIndex].scores[category] = score;
        setPlayers(newPlayers);
        setTurnComplete(true);

        // Bonus message for first roll with score >= 10
        if (rollCount === 1 && score >= 10) {
            setBonusCategory(category);
            setBonusMessage(`🎉 Bonus! +10 points for first-roll ${category}!`);

            setTimeout(() => {
                setBonusFadingOut(true);
                setTimeout(() => {
                    setBonusCategory(null);
                    setBonusMessage('');
                    setBonusFadingOut(false);
                }, 500);
            }, 3000);
        }

        // After short delay, reset dice, roll count, turn, and move to next player
        setTimeout(() => {
            setDice(Array(5).fill().map(() => ({ value: null, held: false })));
            setRollCount(0);
            setTurnComplete(false);
            setBonusCategory(null);
            setBonusMessage('');
            setBonusFadingOut(false);

            setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
        }, 600);
    };

    // Bot turn logic: simple auto-roll and scoring
    useEffect(() => {
        if (currentPlayer.name === 'Bot' && !isGameOver && rollCount === 0) {
            const botPlay = async () => {
                let rolls = 0;
                let workingDice = [...dice];

                while (rolls < 3) {
                    // Roll all dice
                    workingDice = workingDice.map(d => ({ ...d, value: Math.floor(Math.random() * 6) + 1 }));
                    rolls++;

                    const suggested = getSuggestedScores(currentPlayer.scores, workingDice);
                    const topCategory = Object.entries(suggested).sort((a, b) => b[1] - a[1])[0];

                    if (topCategory[1] >= 20 || rolls === 3) {
                        applyScore(topCategory[0]);
                        return;
                    }
                }
            };

            setTimeout(botPlay, 1000);
        }
    }, [currentPlayerIndex, currentPlayer.name, dice, isGameOver]);

    // Reset the game to initial state
    const resetGame = () => {
        setPlayers([
            { name: 'You', scores: { ...initialScores } },
            { name: 'Bot', scores: { ...initialScores } },
        ]);
        setDice(Array(5).fill().map(() => ({ value: null, held: false })));
        setRollCount(0);
        setCurrentPlayerIndex(0);
        setTurnComplete(false);
        setBonusCategory(null);
        setBonusMessage('');
        setBonusFadingOut(false);
    };

    return {
        players,
        currentPlayerIndex,
        currentPlayer,
        dice,
        rollCount,
        turnComplete,
        bonusCategory,
        bonusMessage,
        bonusFadingOut,
        rollDice,
        toggleHold,
        applyScore,
        resetGame,
        isGameOver,
        suggestedScores,
        ...totals,
    };
}

export default useGameLogic;

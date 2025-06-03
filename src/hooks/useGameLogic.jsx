import { useState } from 'react';
import { calculateScore, calculateSuggestedScores } from '../utils/scoreUtils';
import { initialScores } from '../utils/utils';

export function useGameLogic() {

    const [scores, setScores] = useState({ ...initialScores });
    const [dice, setDice] = useState(Array(5).fill().map(() => ({ value: null, held: false })));
    const [rollCount, setRollCount] = useState(0);
    const [turnComplete, setTurnComplete] = useState(false);
    const [bonusCategory, setBonusCategory] = useState(null);
    const [bonusMessage, setBonusMessage] = useState('');
    const [bonusFadingOut, setBonusFadingOut] = useState(false);
    const suggestedScores = calculateSuggestedScores(dice, scores);
    const isGameOver = Object.values(scores).every(score => score !== null);

    const rollDice = () => {
        if (rollCount >= 3 || turnComplete || isGameOver) return;
        setDice(dice.map(d => d.held ? d : { ...d, value: Math.floor(Math.random() * 6) + 1 }));
        setRollCount(c => c + 1);
    };

    const toggleHold = (i) => {
        if (rollCount === 0 || turnComplete) return;
        setDice(dice.map((d, idx) => idx === i ? { ...d, held: !d.held } : d));
    };

    const applyScore = (category) => {
        if (turnComplete || scores[category] !== null || rollCount === 0) return;

        const score = calculateScore(category, dice);
        const newScores = { ...scores, [category]: score };
        setScores(newScores);
        setTurnComplete(true);

        if (rollCount === 1 && score >= 10) {
            console.log(`First roll bonus for ${category}: +10 points so now you have ${score + 10} points!`);
            setBonusCategory(category);
            setBonusMessage(`🎉 Bonus! +10 points for first-roll ${category}!`);

            setTimeout(() => {
                setBonusFadingOut(true);
                setTimeout(() => {
                    setBonusCategory(null);
                    setBonusMessage('');
                    setBonusFadingOut(false);
                }, 3000);
            }, 3000);
        }

        setTimeout(() => {
            setDice(Array(5).fill().map(() => ({ value: null, held: false })));
            setRollCount(0);
            setTurnComplete(false);
            setBonusCategory(null);
            setBonusMessage('');
            setBonusFadingOut(false);
        }, 600);
    };

    const resetGame = () => {
        setScores({ ...initialScores });
        setDice(Array(5).fill().map(() => ({ value: null, held: false })));
        setRollCount(0);
        setTurnComplete(false);
        setBonusCategory(null);
        setBonusMessage('');
        setBonusFadingOut(false);
    };

    return {
        players: [], // Placeholder for player data
        initialScores,
        scores,
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
    };
}

export default useGameLogic;

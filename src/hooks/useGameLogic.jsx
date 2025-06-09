import { useState } from 'react';
import { createGameLogEntry } from '../utils/gameLogUtils';
import { calculateScore, calculateSuggestedScores } from '../utils/scoreUtils';
import { getStrategyAdvice } from '../utils/strategyUtils';
import { initialScores } from '../utils/utils';

// Helpers for localStorage
const loadGameLog = () => {
    try {
        const saved = localStorage.getItem('yahtzeeGameLog');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const saveGameLog = (log) => {
    try {
        localStorage.setItem('yahtzeeGameLog', JSON.stringify(log));
    } catch { }
};

export function useGameLogic() {
    const [scores, setScores] = useState({ ...initialScores });
    const [dice, setDice] = useState(Array(5).fill().map(() => ({ value: null, held: false })));
    const [rollCount, setRollCount] = useState(0);
    const [turnComplete, setTurnComplete] = useState(false);
    const [bonusCategory, setBonusCategory] = useState(null);
    const [bonusMessage, setBonusMessage] = useState('');
    const [earnedBonuses, setEarnedBonuses] = useState({});
    const [bonusFadingOut, setBonusFadingOut] = useState(false);
    const [turn, setTurn] = useState(1);
    const [adviceText, setAdviceText] = useState('');
    const [gameLog, setGameLog] = useState(loadGameLog());

    const isGameOver = Object.values(scores).every(score => score !== null);
    const suggestedScores = calculateSuggestedScores(dice, scores);

    const qualifyingFirstRollBonusCategories = [
        'fullHouse',
        'smallStraight',
        'largeStraight',
        'fourKind',
    ];

    const rollDice = () => {
        if (rollCount >= 3 || turnComplete || isGameOver) return;

        // Mark dice as "rolling"
        const diceWithAnimation = dice.map(d => d.held ? d : { ...d, rolling: true });
        setDice(diceWithAnimation);

        // Wait briefly to let animation play
        setTimeout(() => {
            const newDice = diceWithAnimation.map(d =>
                d.held
                    ? d
                    : { value: Math.floor(Math.random() * 6) + 1, held: false, rolling: false }
            );
            setDice(newDice);
            setRollCount(prev => prev + 1);

            const advice = getStrategyAdvice(newDice, scores);
            setAdviceText(advice);
        }, 300); // 300ms matches animation duration
    };


    const toggleHold = (index) => {
        if (rollCount === 0 || turnComplete) return;
        setDice(dice.map((d, i) => i === index ? { ...d, held: !d.held } : d));
    };

    const applyScore = (category) => {
        if (turnComplete || scores[category] !== null || rollCount === 0) return;

        let score = calculateScore(category, dice);
        const isFirstRollBonus = rollCount === 1 && qualifyingFirstRollBonusCategories.includes(category);

        if (isFirstRollBonus) {
            score += 10; // Apply first roll bonus
            console.log(`First roll bonus applied for category: ${category}`);
            setEarnedBonuses(prev => {
                const updated = { ...prev, [category]: true };
                console.log('earnedBonuses updated:', updated);
                return updated;
            });
        }

        const updatedScores = { ...scores, [category]: score };
        setScores(updatedScores);
        setTurnComplete(true);

        //--- Create game log entry
        const logEntry = createGameLogEntry({
            type: 'score',
            player: 'player',
            dice,
            category,
            score,
            advice: adviceText,
            bonus: isFirstRollBonus ? 10 : null,
            turn
        });

        const newLog = [...gameLog, logEntry];
        setGameLog(newLog);
        saveGameLog(newLog);

        setTimeout(() => {
            setDice(Array(5).fill().map(() => ({ value: null, held: false })));
            setRollCount(0);
            setTurnComplete(false);
            setBonusCategory(null);
            setAdviceText('');
            setTurn(prev => prev + 1);
        }, 100);
    };

    const resetGame = () => {
        setScores({ ...initialScores });
        setDice(Array(5).fill().map(() => ({ value: null, held: false })));
        setRollCount(0);
        setTurnComplete(false);
        setGameLog([]);
        setTurn(1);
    };

    const resetGameLog = () => {
        setGameLog([]);
        localStorage.removeItem('yahtzeeGameLog');
    };

    return {
        players: [], // future expansion
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
        resetGameLog,
        isGameOver,
        suggestedScores,
        adviceText,
        turn,
        gameLog,
        earnedBonuses,
    };



}

export default useGameLogic;

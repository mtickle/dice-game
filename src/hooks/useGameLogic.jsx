// src/hooks/useGameLogic.jsx
import { useState } from 'react';
import { createGameLogEntry } from '../utils/gameLogUtils';
import { calculateScore, calculateSuggestedScores, matchesCategory } from '../utils/scoreUtils';
import { getStrategyAdvice } from '../utils/strategyUtils';
import { allCategories, initialScores, lowerCategories, upperCategories } from '../utils/utils';


// Helpers for localStorage (safe, isolated)
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

// Totals calculator helper function
function calculateTotals(scores) {
    const upperSubtotal = upperCategories.reduce((sum, cat) => sum + (scores[cat] || 0), 0);
    const bonus = upperSubtotal >= 63 ? 35 : 0;
    const upperTotal = upperSubtotal + bonus;

    const lowerTotal = lowerCategories.reduce((sum, cat) => sum + (scores[cat] || 0), 0);
    const grandTotal = upperTotal + lowerTotal;

    return { upperSubtotal, bonus, upperTotal, lowerTotal, grandTotal };
}

export function useGameLogic() {
    const [scores, setScores] = useState({ ...initialScores });
    const [dice, setDice] = useState(Array(5).fill().map(() => ({ value: null, held: false })));
    const [rollCount, setRollCount] = useState(0);
    const [turnComplete, setTurnComplete] = useState(false);
    const [earnedBonuses, setEarnedBonuses] = useState({});
    const [turn, setTurn] = useState(1);
    const [adviceText, setAdviceText] = useState('');
    const [gameLog, setGameLog] = useState(loadGameLog());

    const isGameOver = Object.values(scores).every(score => score !== null);
    const suggestedScores = calculateSuggestedScores(dice, scores);
    const totals = calculateTotals(scores);

    const qualifyingFirstRollBonusCategories = [
        'fullHouse',
        'smallStraight',
        'largeStraight',
        'fourKind',
    ];

    const rollDice = () => {
        if (rollCount >= 3 || turnComplete || isGameOver) return;

        const diceWithAnimation = dice.map(d => d.held ? d : { ...d, rolling: true });
        setDice(diceWithAnimation);

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
        }, 300);
    };

    const toggleHold = (index) => {
        if (rollCount === 0 || turnComplete) return;
        setDice(dice.map((d, i) => i === index ? { ...d, held: !d.held } : d));
    };

    const applyScore = (category) => {
        if (turnComplete || scores[category] != null || rollCount === 0) return;

        let score = calculateScore(category, dice);

        const isFirstRoll = rollCount === 1;
        const isEligibleForBonus = qualifyingFirstRollBonusCategories.includes(category);
        const qualifiesForBonus = isFirstRoll && isEligibleForBonus && matchesCategory(category, dice);

        if (qualifiesForBonus) {
            score += 10;
            setEarnedBonuses(prev => ({ ...prev, [category]: true }));
        }

        const updatedScores = { ...scores, [category]: score };
        setScores(updatedScores);
        setTurnComplete(true);

        const logEntry = createGameLogEntry({
            type: 'score',
            player: 'player',
            dice,
            category,
            score,
            advice: adviceText,
            bonus: qualifiesForBonus ? 10 : null,
            turn
        });

        const newLog = [...gameLog, logEntry];
        setGameLog(newLog);
        saveGameLog(newLog);

        setTimeout(() => {
            setDice(Array(5).fill().map(() => ({ value: null, held: false })));
            setRollCount(0);
            setTurnComplete(false);
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
        setAdviceText('');
        setEarnedBonuses({});
    };

    const resetGameLog = () => {
        setGameLog([]);
        localStorage.removeItem('yahtzeeGameLog');
    };

    // 🔥 AutoPlay logic for test mode
    const autoplayTurn = () => {
        if (isGameOver) return;
        if (turnComplete) return;

        if (rollCount < 3) {
            rollDice();
        } else {
            // Aggressive scoring logic:
            let bestCategory = null;
            let bestScore = -1;
            for (const cat of allCategories) {
                if (scores[cat] == null) {
                    const possible = calculateScore(cat, dice);
                    if (possible > bestScore) {
                        bestScore = possible;
                        bestCategory = cat;
                    }
                }
            }
            if (bestCategory) {
                applyScore(bestCategory);
            }
        }
    };

    return {
        players: [],
        initialScores,
        scores,
        dice,
        rollCount,
        turnComplete,
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
        autoplayTurn,
        ...totals,
    };
}

export default useGameLogic;

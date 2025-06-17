import { useCallback, useEffect, useState } from 'react';
import { calculateScore, calculateSuggestedScores, matchesCategory } from '../utils/scoreUtils';
import { getStrategyAdvice } from '../utils/strategyUtils';
import { allCategories, initialScores, lowerCategories, upperCategories } from '../utils/utils';

// Totals calculator
function calculateTotals(scores) {
    const upperSubtotal = upperCategories.reduce((sum, cat) => sum + (scores[cat] || 0), 0);
    const bonus = upperSubtotal >= 63 ? 35 : 0;
    const upperTotal = upperSubtotal + bonus;
    const lowerTotal = lowerCategories.reduce((sum, cat) => sum + (scores[cat] || 0), 0);
    const grandTotal = upperTotal + lowerTotal;
    return { upperSubtotal, bonus, upperTotal, lowerTotal, grandTotal };
}

export function useGameLogic(logTurnResult, logGameStats) {
    const [gameCount, setGameCount] = useState(0);
    const [scores, setScores] = useState({ ...initialScores });
    const [dice, setDice] = useState(Array(5).fill().map(() => ({ value: null, held: false })));
    const [rollCount, setRollCount] = useState(0);
    const [turnComplete, setTurnComplete] = useState(false);
    const [earnedBonuses, setEarnedBonuses] = useState({});
    const [turn, setTurn] = useState(1);
    const [adviceText, setAdviceText] = useState('');

    const isGameOver = Object.values(scores).every(score => score !== null);
    const suggestedScores = calculateSuggestedScores(dice, scores);
    const totals = calculateTotals(scores);

    const qualifyingFirstRollBonusCategories = [
        'fullHouse',
        'smallStraight',
        'largeStraight',
        'fourKind',
    ];

    const rollDice = useCallback(() => {
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
    }, [dice, rollCount, turnComplete, isGameOver, scores]);

    const toggleHold = useCallback((index) => {
        if (rollCount === 0 || turnComplete) return;
        setDice(dice.map((d, i) => i === index ? { ...d, held: !d.held } : d));
    }, [dice, rollCount, turnComplete]);

    const applyScore = useCallback((category) => {
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

        if (logTurnResult) {
            const turnResult = {
                gameNumber: gameCount + 1,
                turnNumber: turn,
                dice: dice.map(d => d.value),
                rollCount,
                category,
                score,
                bonus: qualifiesForBonus ? 10 : 0,
                suggestedScores: { ...suggestedScores },
                timestamp: new Date().toISOString(),
            };
            logTurnResult(turnResult);
        }

        setTimeout(() => {
            setDice(Array(5).fill().map(() => ({ value: null, held: false })));
            setRollCount(0);
            setTurnComplete(false);
            setAdviceText('');
            setTurn(prev => prev + 1);
        }, 100);
    }, [scores, dice, rollCount, turnComplete, turn, suggestedScores, logTurnResult, gameCount]);

    const resetGame = useCallback(() => {
        console.log(`[resetGame] Resetting game state, isGameOver = ${isGameOver}, newGameNumber = ${gameCount + 1}`);

        // Prepare game stats
        const gameStats = {
            gameNumber: gameCount + 1,
            scores: { ...scores },
            totalScore: totals.grandTotal,
            timestamp: new Date().toISOString(),
        };

        // Save to local storage
        try {
            const existingStats = localStorage.getItem('gameStats');
            const statsArray = existingStats ? JSON.parse(existingStats) : [];
            const updatedStats = Array.isArray(statsArray) ? [...statsArray, gameStats] : [gameStats];
            console.log('[resetGame] Saving to local storage:', updatedStats);
            localStorage.setItem('gameStats', JSON.stringify(updatedStats));
            if (logGameStats) {
                logGameStats(gameStats);
            }
        } catch (error) {
            console.error('[resetGame] Error saving to local storage:', error);
            localStorage.setItem('gameStats', JSON.stringify([gameStats]));
            if (logGameStats) {
                logGameStats(gameStats);
            }
        }

        // Reset state
        setGameCount(prev => prev + 1);
        setScores({ ...initialScores });
        setDice(Array(5).fill().map(() => ({ value: null, held: false })));
        setRollCount(0);
        setTurnComplete(false);
        setTurn(1);
        setAdviceText('');
        setEarnedBonuses({});
    }, [isGameOver, gameCount, scores, totals.grandTotal, logGameStats]);

    useEffect(() => {
        if (isGameOver) {
            resetGame();
        }
    }, [isGameOver, resetGame]);

    const resetGameLog = useCallback(() => {
        // No-op, as gameLog is managed in App.jsx
    }, []);

    const autoplayTurn = useCallback(() => {
        if (isGameOver || turnComplete) return;

        if (rollCount < 3) {
            rollDice();
        } else {
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
    }, [isGameOver, turnComplete, rollCount, rollDice, scores, dice, applyScore]);

    return {
        gameCount,
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
        earnedBonuses,
        autoplayTurn,
        ...totals,
    };
}
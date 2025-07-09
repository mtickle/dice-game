import { useCallback, useEffect, useState } from 'react';
import { calculateScore, calculateSuggestedScores, matchesCategory } from '../utils/scoreUtils';
import { getStrategyAdvice } from '../utils/strategyUtils';
import { allCategories, generateGameNumber, initialScores, lowerCategories, upperCategories } from '../utils/utils';

function calculateTotals(scores) {
    const upperSubtotal = upperCategories.reduce((sum, cat) => sum + (scores[cat] || 0), 0);
    const bonus = upperSubtotal >= 69 ? 35 : 0;
    const upperTotal = upperSubtotal + bonus;
    const lowerTotal = lowerCategories.reduce((sum, cat) => sum + (scores[cat] || 0), 0);
    const grandTotal = upperTotal + lowerTotal;
    return { upperSubtotal, bonus, upperTotal, lowerTotal, grandTotal };
}

export function useGameLogic(logTurnResult, logGameStats, gameNumber, setGameNumber) {
    const [gameCount, setGameCount] = useState(1);
    const [scores, setScores] = useState({ ...initialScores });
    const [dice, setDice] = useState(Array(5).fill().map(() => ({ value: null, held: false })));
    const [rollCount, setRollCount] = useState(0);
    const [turnComplete, setTurnComplete] = useState(false);
    const [earnedBonuses, setEarnedBonuses] = useState({});
    const [turn, setTurn] = useState(1);
    const [adviceText, setAdviceText] = useState('');
    const [turnInProgress, setTurnInProgress] = useState(false);
    const [gameSessionLog, setGameSessionLog] = useState([]);

    const isGameOver = Object.values(scores).every(score => score !== null);
    const rawSuggestedScores = calculateSuggestedScores(dice, scores);
    const suggestedScores = rollCount > 0
        ? rawSuggestedScores
        : { ...rawSuggestedScores, chance: null };
    const totals = calculateTotals(scores);

    const qualifyingFirstRollBonusCategories = [
        'fullhouse',
        'smallstraight',
        'largestraight',
        'fourofakind',
        'onepair',
        'twopair',
    ];

    const rollDice = useCallback(() => {
        if (rollCount >= 3 || turnComplete || isGameOver || turnInProgress) return;

        setTurnInProgress(true);
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
            setTurnInProgress(false);
            const advice = getStrategyAdvice(newDice, scores);
            setAdviceText(advice);
        }, 300);
    }, [dice, rollCount, turnComplete, isGameOver, scores, turnInProgress]);

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

        // Apply bonus if conditions are met
        if (qualifiesForBonus) {
            score += 10;
            setEarnedBonuses(prev => ({ ...prev, [category]: true }));
        }

        // Update score state
        const updatedScores = { ...scores, [category]: score };
        setScores(updatedScores);
        setTurnComplete(true);

        // Log the result of this turn
        if (logTurnResult) {
            const turnResult = {
                gameNumber,
                turnNumber: turn,
                dice: dice.map(d => d.value),
                heldDice: dice.map(d => d.held),
                rollCount,
                category,
                score,
                bonus: qualifiesForBonus ? 10 : 0,
                suggestedScores: { ...suggestedScores },
                timestamp: new Date().toISOString(),
            };
            logTurnResult(turnResult);
        }

        // Reset dice and state after a short delay
        setTimeout(() => {
            setDice(Array(5).fill().map(() => ({ value: null, held: false })));
            setRollCount(0);
            setTurnComplete(false);
            setAdviceText('');
            setTurn(prev => prev + 1);
        }, 100);

    }, [
        scores,
        dice,
        rollCount,
        turnComplete,
        turn,
        suggestedScores,
        logTurnResult,
        gameNumber,
        qualifyingFirstRollBonusCategories,
        matchesCategory,
    ]);


    const resetGame = useCallback((skipSave = false) => {
        if (!skipSave) {
            const gameStats = {
                gameNumber,
                scores: { ...scores },
                totalScore: totals.grandTotal,
                timestamp: new Date().toISOString(),
            };
            if (logGameStats) {
                logGameStats(gameStats);
            }
        }

        setGameCount(prev => prev + 1);
        setScores({ ...initialScores });
        setDice(Array(5).fill().map(() => ({ value: null, held: false })));
        setRollCount(0);
        setTurnComplete(false);
        setTurn(1);
        setAdviceText('');
        setEarnedBonuses({});
        setGameNumber(generateGameNumber());
    }, [gameNumber, scores, totals.grandTotal, logGameStats, setGameNumber]);

    useEffect(() => {
        if (isGameOver) {
            resetGame();
        }
    }, [isGameOver, resetGame]);

    const resetGameLog = useCallback(() => { }, []);

    const autoplayTurn = useCallback(() => {
        if (isGameOver || turnComplete || turnInProgress) return;

        if (rollCount < 3) {
            const totals = calculateTotals(scores);
            let bestCategory = null;
            let bestScore = -1;
            const needsBonus = totals.upperSubtotal < 69;

            for (const cat of allCategories) {
                if (scores[cat] == null) {
                    const possible = calculateScore(cat, dice);
                    if (needsBonus && upperCategories.includes(cat)) {
                        if (possible > bestScore) {
                            bestScore = possible;
                            bestCategory = cat;
                        }
                    } else if (!needsBonus) {
                        if (possible > bestScore) {
                            bestScore = possible;
                            bestCategory = cat;
                        }
                    }
                }
            }

            if (bestCategory && bestScore > 0) {
                applyScore(bestCategory);
                return;
            }
            rollDice();
        }
    }, [isGameOver, turnComplete, rollCount, rollDice, scores, dice, applyScore, turnInProgress]);

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
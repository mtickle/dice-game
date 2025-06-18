import { useEffect, useRef } from 'react';
import { upperCategories } from '../utils/utils';

export default function AutoPlayer({
    rollDice,
    applyScore,
    rollCount,
    turnComplete,
    isGameOver,
    suggestedScores,
    scores,
    gameCount,
    autoPlaying,
    setAutoPlaying,
    totals, // Added to access upperSubtotal
}) {
    const hasLoggedGameOver = useRef(false);

    // Log game-over once
    useEffect(() => {
        if (isGameOver && autoPlaying && !hasLoggedGameOver.current) {
            console.log(`[AutoPlayer] Game ${gameCount} over — logging stats and restarting.`);
            hasLoggedGameOver.current = true;
        } else if (!isGameOver) {
            hasLoggedGameOver.current = false;
        }
    }, [isGameOver, autoPlaying, gameCount]);

    // Debug state changes
    useEffect(() => {
        console.log(`[AutoPlayer] isGameOver = ${isGameOver}, autoPlaying = ${autoPlaying}, gameCount = ${gameCount}`);
    }, [isGameOver, autoPlaying, gameCount]);

    // Handle game moves
    useEffect(() => {
        if (!autoPlaying || isGameOver || turnComplete) return;

        const timer = setTimeout(() => {
            makeAIMove();
        }, 100);

        return () => clearTimeout(timer);
    }, [autoPlaying, rollCount, turnComplete, isGameOver, suggestedScores, scores]);

    const makeAIMove = () => {
        if (!scores || typeof scores !== 'object') {
            console.error('[AutoPlayer] Invalid scores object. Stopping autoplay.');
            setAutoPlaying(false);
            return;
        }

        if (rollCount < 3) {
            rollDice();
            return;
        }

        const availableSuggested = suggestedScores && typeof suggestedScores === 'object'
            ? Object.keys(suggestedScores).filter((cat) => suggestedScores[cat] != null && scores[cat] == null)
            : [];

        if (availableSuggested.length === 0) {
            const remaining = Object.keys(scores).filter((cat) => scores[cat] == null);
            if (remaining.length > 0) {
                const categoryToScore = remaining[0];
                console.log(`[AutoPlayer] Game ${gameCount + 1}: Sacrificing category: ${categoryToScore} (score = 0)`);
                try {
                    applyScore(categoryToScore);
                } catch (error) {
                    console.error(`[AutoPlayer] Game ${gameCount + 1}: Error applying score:`, error);
                    setAutoPlaying(false);
                }
            } else {
                console.error(`[AutoPlayer] Game ${gameCount + 1}: No categories left to score. Forcing game end.`);
                setAutoPlaying(false);
            }
            return;
        }

        // Aggressive upper section strategy
        const upperSubtotal = totals?.upperSubtotal || 0;
        const bonusThreshold = 63;
        const bonusGap = bonusThreshold - upperSubtotal;
        const upperTargets = {
            ones: 3, // 3 × 1
            twos: 6, // 3 × 2
            threes: 9, // 3 × 3
            fours: 12, // 3 × 4
            fives: 15, // 3 × 5
            sixes: 18, // 3 × 6
        };

        let categoryToScore = null;
        let bestScore = -1;

        // Prioritize upper categories if close to bonus or high score
        if (bonusGap > 0 && bonusGap <= 18) { // Within ~2 upper categories of bonus
            const upperAvailable = availableSuggested.filter((cat) => upperCategories.includes(cat));
            if (upperAvailable.length > 0) {
                categoryToScore = upperAvailable.reduce((best, cat) => {
                    const score = suggestedScores[cat] || 0;
                    const target = upperTargets[cat] || 0;
                    if (score >= target && score > (suggestedScores[best] || 0)) {
                        return cat;
                    }
                    return best;
                }, upperAvailable[0]);
                bestScore = suggestedScores[categoryToScore] || 0;
            }
        }

        // Fall back to highest score if no good upper option
        if (!categoryToScore) {
            categoryToScore = availableSuggested.reduce((best, cat) => {
                const score = suggestedScores[cat] || 0;
                if (score > bestScore) {
                    bestScore = score;
                    return cat;
                }
                return best;
            }, availableSuggested[0]);
        }

        console.log(
            `[AutoPlayer] Game ${gameCount + 1}: Scoring ${categoryToScore} (score = ${suggestedScores[categoryToScore]}, upperSubtotal = ${upperSubtotal}, bonusGap = ${bonusGap})`
        );

        try {
            applyScore(categoryToScore);
        } catch (error) {
            console.error(`[AutoPlayer] Game ${gameCount + 1}: Error applying score:`, error);
            setAutoPlaying(false);
        }
    };

    return (
        <div className="flex justify-center mt-4 items-center">
            <button
                className={`px-4 py-2 rounded-xl text-white font-bold transition 
          ${autoPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                onClick={() => setAutoPlaying(!autoPlaying)}
            >
                {autoPlaying ? 'Stop AutoPlay' : 'Start AutoPlay'}
            </button>
        </div>
    );
}
import { useEffect, useRef } from 'react';

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
    playTurn,
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
            console.error("[AutoPlayer] Invalid scores object. Stopping autoplay.");
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

        let categoryToScore;

        if (availableSuggested.length > 0) {
            categoryToScore = availableSuggested.reduce((best, cat) => {
                return (suggestedScores[cat] || 0) > (suggestedScores[best] || 0) ? cat : best;
            }, availableSuggested[0]);
        } else {
            const remaining = Object.keys(scores).filter((cat) => scores[cat] == null);
            if (remaining.length > 0) {
                categoryToScore = remaining[0];
                //console.log(`[AutoPlayer] Game ${gameCount + 1}: Sacrificing category: ${categoryToScore} (score = 0)`);
            } else {
                //console.error(`[AutoPlayer] Game ${gameCount + 1}: No categories left to score. Forcing game end.`);
                setAutoPlaying(false);
                return;
            }
        }

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
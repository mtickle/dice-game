import { useEffect, useState } from 'react';

export default function AutoPlayer({
    rollDice,
    applyScore,
    rollCount,
    turnComplete,
    isGameOver,
    suggestedScores,
    scores,
    resetGame,
    logGameStats
}) {
    const [autoPlaying, setAutoPlaying] = useState(false);

    useEffect(() => {
        if (!autoPlaying) return;

        if (isGameOver) {
            console.log("[AutoPlay] Game over — logging stats and resetting.");
            if (logGameStats) logGameStats();

            // Prevent infinite re-renders by pausing autoplay for one render cycle
            setTimeout(() => {
                resetGame();
                setAutoPlaying(false);
            }, 300);
            return;
        }

        if (!turnComplete) {
            const timer = setTimeout(() => {
                makeAIMove();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [autoPlaying, rollCount, turnComplete, isGameOver, suggestedScores, scores]);

    const makeAIMove = () => {
        if (isGameOver || turnComplete) return;

        // Defensive check: scores must exist and be an object
        // if (!scores || typeof scores !== 'object') {
        //     console.warn("[AutoPlay] Scores object invalid. Skipping turn.");
        //     return;
        // }

        if (rollCount < 3) {
            rollDice();
        } else {
            const availableSuggested = Object.keys(suggestedScores || {}).filter(
                (cat) => suggestedScores[cat] != null
            );

            let categoryToScore;

            if (availableSuggested.length > 0) {
                // Pick highest scoring suggestion
                categoryToScore = availableSuggested.reduce((best, cat) => {
                    return suggestedScores[cat] > (suggestedScores[best] ?? 0) ? cat : best;
                }, availableSuggested[0]);
            } else {
                // No good suggestions — fallback to sacrifice mode
                const remaining = Object.keys(scores).filter(
                    (cat) => scores[cat] == null
                );

                if (remaining.length > 0) {
                    categoryToScore = remaining[0];
                    console.log(`[AutoPlay] Sacrificing category: ${categoryToScore}`);
                } else {
                    console.warn("[AutoPlay] No categories left to score.");
                    return;
                }
            }

            if (categoryToScore) {
                applyScore(categoryToScore);
            }
        }
    };

    return (
        <div className="flex justify-center mt-4">
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

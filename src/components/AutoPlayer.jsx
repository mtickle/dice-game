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

        // Defensive: wait until valid state is fully loaded
        if (!scores || Object.keys(scores).length === 0 || !suggestedScores || Object.keys(suggestedScores).length === 0) {
            console.log("[AutoPlay] Waiting for full state...");
            return;
        }

        if (isGameOver) {
            if (logGameStats) logGameStats();
            setTimeout(() => {
                resetGame();
            }, 300);
            return;
        }

        if (!turnComplete) {
            const timer = setTimeout(() => {
                makeAIMove();
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [autoPlaying, rollCount, turnComplete, isGameOver, suggestedScores, scores]);

    const makeAIMove = () => {
        if (isGameOver || turnComplete) return;

        if (rollCount < 3) {
            rollDice();
        } else {
            let categoryToScore;

            // Prefer suggested scores if any
            const availableSuggested = Object.keys(suggestedScores).filter(cat => suggestedScores[cat] != null);
            if (availableSuggested.length > 0) {
                categoryToScore = availableSuggested.reduce((best, cat) => {
                    return suggestedScores[cat] > (suggestedScores[best] ?? 0) ? cat : best;
                }, availableSuggested[0]);
            } else {
                // Defensive: sacrifice mode
                const remaining = Object.keys(scores).filter(cat => scores[cat] == null);
                if (remaining.length > 0) {
                    categoryToScore = remaining[0];  // Just grab first remaining unscored category
                } else {
                    console.warn("[AutoPlay] No valid category to score — fallback safety");
                    return;
                }
            }

            console.log(`[AutoPlay] Scoring category: ${categoryToScore}`);
            applyScore(categoryToScore);
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

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

    // Simple sanity check to verify scores object is valid
    const isScoreObjectReady = (scores) => {
        if (!scores || typeof scores !== 'object') return false;
        const keys = Object.keys(scores);
        return keys.length >= 13; // You may adjust if you're using variants
    };

    useEffect(() => {
        if (!autoPlaying) return;

        if (!isScoreObjectReady(scores)) {
            console.log("[AutoPlay] Scores not ready yet.");
            return;
        }

        if (isGameOver) {
            console.log("[AutoPlay] Game Over. Logging and restarting...");
            if (logGameStats) logGameStats();
            resetGame();
            return;
        }

        if (!turnComplete) {
            if (rollCount < 3) {
                rollDice();
            } else {
                makeAIMove();
            }
        }
    }, [autoPlaying, rollCount, turnComplete, isGameOver, suggestedScores, scores]);

    const makeAIMove = () => {
        const availableSuggested = Object.keys(suggestedScores ?? {}).filter(cat => suggestedScores[cat] != null);
        console.log("[AutoPlay] Suggested categories available:", availableSuggested);

        let categoryToScore = null;

        if (availableSuggested.length > 0) {
            categoryToScore = availableSuggested.reduce((best, cat) => {
                return suggestedScores[cat] > (suggestedScores[best] ?? 0) ? cat : best;
            }, availableSuggested[0]);
        } else {
            // No suggested scores - sacrifice fallback
            const scoreKeys = Object.keys(scores ?? {});
            const remaining = scoreKeys.filter((cat) => scores[cat] == null);
            console.log("[AutoPlay] Sacrifice candidates:", remaining);

            if (remaining.length > 0) {
                // Optional: more intelligent sacrifice ordering
                const sacrificeOrder = [
                    'chance', 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
                    'threeOfKind', 'fourOfKind', 'smallStraight', 'largeStraight', 'fullHouse', 'yahtzee'
                ];
                categoryToScore = sacrificeOrder.find(cat => remaining.includes(cat)) ?? remaining[0];
            } else {
                console.warn("[AutoPlay] No remaining categories to score.");
                return;
            }
        }

        console.log(`[AutoPlay] Applying score to: ${categoryToScore}`);
        if (categoryToScore) {
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

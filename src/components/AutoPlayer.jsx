import { generateGameNumber, upperCategories } from '@utils/utils';
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
    totals,
    turnLog,
    setTurnLog,
    gameStats,
    setGameStats,
    showAllTurns,
    setShowAllTurns,
    resetGame,
    gameNumber,
    setGameNumber
}) {
    const hasLoggedGameOver = useRef(false);

    // Log game-over once
    useEffect(() => {
        if (isGameOver && autoPlaying && !hasLoggedGameOver.current) {
            hasLoggedGameOver.current = true;
            const newGame = {
                gameNumber,
                totalScore: turnLog.reduce((sum, turn) => sum + (turn.score || 0), 0),
                scores: turnLog.reduce((acc, turn) => ({ ...acc, [turn.category]: turn.score }), {}),
                timestamp: new Date().toISOString(),
            };
            setGameStats(prev => {
                const updatedStats = [...prev, newGame];
                //localStorage.setItem('gameStats', JSON.stringify(updatedStats));
                //saveGameToFirebase(newGame);
                //saveToStorage(newGame);

                //--- Let's save the game here using a util



                return updatedStats;
            });
        } else if (!isGameOver) {
            hasLoggedGameOver.current = false;
        }
    }, [isGameOver, autoPlaying, turnLog, gameStats, setGameStats, gameNumber]);

    // Handle AI moves
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

        const categoryThresholds = {
            yahtzee: 50,
            fullHouse: 25,
            largeStraight: 40,
            smallStraight: 30,
            fourOfAKind: 30,
            threeOfAKind: 25,
            onePair: 18,
            twoPair: 22,
            chance: 30,
            ones: 3,
            twos: 6,
            threes: 9,
            fours: 12,
            fives: 15,
            sixes: 18,
        };

        const availableSuggested = suggestedScores && typeof suggestedScores === 'object'
            ? Object.keys(suggestedScores).filter((cat) => suggestedScores[cat] != null && scores[cat] == null)
            : [];

        // Try to score early if any suggested score exceeds its threshold
        if (rollCount < 3 && availableSuggested.length > 0) {
            const earlyScoreCategory = availableSuggested
                .map((cat) => ({
                    cat,
                    score: suggestedScores[cat],
                    threshold: categoryThresholds[cat] ?? 999,
                }))
                .filter(({ score, threshold }) => score >= threshold)
                .sort((a, b) => b.score - a.score)[0]; // pick best scoring category

            if (earlyScoreCategory) {
                try {
                    applyScore(earlyScoreCategory.cat);
                } catch (error) {
                    console.error(`[AutoPlayer] Game ${gameCount + 1}: Error applying early score:`, error);
                    setAutoPlaying(false);
                }
                return;
            }
        }

        // If no early score, continue rolling (if rolls remain)
        if (rollCount < 3) {
            rollDice();
            return;
        }

        // End-of-turn decision making (after 3 rolls)
        const upperSubtotal = totals?.upperSubtotal || 0;
        const bonusThreshold = 63;
        const bonusGap = bonusThreshold - upperSubtotal;
        const upperTargets = {
            ones: 5,
            twos: 6,
            threes: 9,
            fours: 12,
            fives: 20,
            sixes: 24,
        };

        let categoryToScore = null;
        let bestScore = -1;

        // Try to help upper bonus if we're close
        if (bonusGap > 0 && bonusGap <= 18) {
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

        // Pick best of remaining if nothing prioritized
        if (!categoryToScore && availableSuggested.length > 0) {
            categoryToScore = availableSuggested.reduce((best, cat) => {
                const score = suggestedScores[cat] || 0;
                if (score > bestScore) {
                    bestScore = score;
                    return cat;
                }
                return best;
            }, availableSuggested[0]);
        }

        // Fallback: nothing valid to score — sacrifice something
        if (!categoryToScore) {
            const remaining = Object.keys(scores).filter((cat) => scores[cat] == null);
            if (remaining.length > 0) {
                const sacrificePriority = [
                    'ones', 'twos', 'threes', 'chance',
                    'fourOfAKind', 'threeOfAKind', 'onePair', 'twoPair'
                ];

                const categoryToSacrifice = sacrificePriority.find(cat => remaining.includes(cat)) || remaining[0];

                console.warn(`[AutoPlayer] Forcing score of 0 in "${categoryToSacrifice}" due to no valid plays.`);

                try {
                    applyScore(categoryToSacrifice);
                } catch (error) {
                    console.error(`[AutoPlayer] Game ${gameCount + 1}: Error sacrificing category:`, error);
                    setAutoPlaying(false);
                }
            } else {
                console.error(`[AutoPlayer] Game ${gameCount + 1}: No categories left to score. Forcing game end.`);
                setAutoPlaying(false);
            }
            return;
        }

        try {
            applyScore(categoryToScore);
        } catch (error) {
            console.error(`[AutoPlayer] Game ${gameCount + 1}: Error applying score:`, error);
            setAutoPlaying(false);
        }
    };

    const exportData = (data, filename) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExport = () => {
        exportData(turnLog, `yahtzee_turnLog_${new Date().toISOString()}.json`);
        exportData(gameStats, `yahtzee_gameStats_${new Date().toISOString()}.json`);
    };


    //--- This is a full DATA RESET
    const handleReset = () => {
        if (window.confirm('Reset all turn and game data? This cannot be undone.')) {
            setTurnLog([]);
            setGameStats([]);
            try {
                //--- Empty out the local storage.
                localStorage.setItem('turnLog', JSON.stringify([]));
                localStorage.setItem('gameStats', JSON.stringify([]));
            } catch (error) {
                console.error('[AutoPlayer] Error resetting data:', error);
            }
            resetGame(true);
            setGameNumber(generateGameNumber());
        }
    };

    const handleToggleTurns = () => {
        setShowAllTurns((prev) => !prev);
    };

    return (
        <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm w-full">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Auto Player & Controls</h2>
            <div className="flex gap-3 mb-4">
                <button
                    className="px-4 bg-blue-600 text-white rounded-xl py-2 hover:bg-blue-700 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
                    onClick={handleExport}
                >
                    Export Data
                </button>
                <button
                    className="px-4 bg-red-600 text-white rounded-xl py-2 hover:bg-red-700 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
                    onClick={handleReset}
                >
                    Reset All Data
                </button>
                <button
                    className={`px-4 text-white rounded-xl py-2 hover:bg-blue-700 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-md 
                        ${autoPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                    onClick={() => setAutoPlaying(!autoPlaying)}
                >
                    {autoPlaying ? 'Stop AutoPlay' : 'Start AutoPlay'}
                </button>
            </div>
        </div>
    );
}

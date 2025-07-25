

import { saveThingsToDatabase } from '@utils/storageUtils';
import { upperCategories } from '@utils/utils';
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
    setShowAllTurns,
    resetGame,
    gameNumber,
    setGameNumber,
    user,
    setRefreshKey
}) {
    const hasLoggedGameOver = useRef(false);



    //--- GAME OVER DUDE
    useEffect(() => {
        if (isGameOver && autoPlaying && !hasLoggedGameOver.current) {


            //--- Filter out the turns for the current game and prepare the data for saving.
            //const turnsForThisGame = turnLog.filter(turn => turn.gameNumber === gameNumber);

            //--- The game is over, let's get scores together and save them.
            const combineScoresData = (inputData) => {
                const { scores, totals } = inputData;
                return {
                    scores: {
                        gameNumber: gameNumber,
                        playerName: user?.nickname || 'Anonymous',
                        ...scores,
                        ...totals
                    },
                };
            };

            const turnsForThisGame = turnLog
                .filter(turn => turn.gameNumber === gameNumber)
                .map(turn => ({
                    ...turn,
                    playerName: user?.nickname || 'Anonymous',
                }));

            //-- Fire the laser. Game results and turns are saved to the database.
            saveThingsToDatabase('postGameResults', combineScoresData({ scores, totals }));
            saveThingsToDatabase('postGameTurns', turnsForThisGame);

            //--- This should reload the stats.
            setTimeout(() => {
                setRefreshKey(prev => prev + 1);

            }, 1000);

            hasLoggedGameOver.current = true;
            const newGame = {
                gameNumber,
                totalScore: turnLog.reduce((sum, turn) => sum + (turn.score || 0), 0),
                scores: turnLog.reduce((acc, turn) => ({ ...acc, [turn.category]: turn.score }), {}),
                timestamp: new Date().toISOString(),

            };
            setGameStats(prev => {
                const updatedStats = [...prev, newGame];
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
            fullhouse: 25,
            largestraight: 40,
            smallstraight: 30,
            fourofakind: 15,
            threeofakind: 25,
            onepair: 18,
            twopair: 22,
            chance: 30,
            ones: 4,
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
        const bonusThreshold = 69;
        const bonusGap = bonusThreshold - upperSubtotal;
        const upperTargets = {
            ones: 3,
            twos: 6,
            threes: 9,
            fours: 12,
            fives: 15,
            sixes: 18,
        };

        let categoryToScore = null;
        let bestScore = -1;


        // Try to help upper bonus if we're close
        if (bonusGap > 0 && bonusGap <= 12) {
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
                    'threeofakind', 'onepair', 'twopair', 'odds', 'evens', 'fourofakind'
                ];

                const categoryToSacrifice = sacrificePriority.find(cat => remaining.includes(cat)) || remaining[0];

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





    return (

        <div className="w-full flex gap-4 justify-center bg-[#fffdf7] p-4 rounded-2xl shadow-md border-2 border-[#e2dccc]">
            <div className="flex gap-3 mb-0">

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

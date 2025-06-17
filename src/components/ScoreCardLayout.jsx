import AdvicePanel from './AdvicePanel';
import AutoPlayer from './AutoPlayer';
import DiceField from './DiceField';
import GameHistory from './GameHistory';
import ScoreCardSection from './ScoreCardSection';
import { LowerSectionTotals, UpperSectionTotals } from './SectionTotals';

export default function ScoreCardLayout(props) {
    const {
        upperCategories,
        lowerCategories,
        scores,
        suggestedScores,
        applyScore,
        rollCount,
        turnComplete,
        prettyName,
        earnedBonuses,
        upperSubtotal,
        bonus,
        upperTotal,
        lowerTotal,
        grandTotal,
        dice,
        rollDice,
        toggleHold,
        suggestions,
        lifetimeStats,
        isGameOver,
        resetGame,
        autoPlaying,
        setAutoPlaying,
        logGameStats,
        gameCount,
        setGameCount
    } = props;

    return (
        <div className="flex flex-col items-center p-4 min-h-screen">
            <div className="flex flex-row justify-center items-start gap-8">
                <div className="w-[300px]">
                    <ScoreCardSection
                        categories={upperCategories}
                        scores={scores}
                        suggestedScores={suggestedScores}
                        applyScore={applyScore}
                        rollCount={rollCount}
                        turnComplete={turnComplete}
                        prettyName={prettyName}
                        isUpperSection={true}
                        earnedBonuses={earnedBonuses}
                        totalsNode={
                            <UpperSectionTotals
                                upperSubtotal={upperSubtotal}
                                bonus={bonus}
                                upperTotal={upperTotal}
                            />
                        }
                    />
                </div>

                <div className="flex flex-col items-center gap-4">
                    <DiceField dice={dice} rollDice={rollDice} toggleHold={toggleHold} rollCount={rollCount} />
                    <AutoPlayer
                        rollDice={rollDice}
                        applyScore={applyScore}
                        rollCount={rollCount}
                        turnComplete={turnComplete}
                        isGameOver={isGameOver}
                        suggestedScores={suggestedScores}
                        scores={scores}
                        gameCount={gameCount}
                        autoPlaying={autoPlaying}
                        setAutoPlaying={setAutoPlaying}
                        autoplayTurn={autoplayTurn}
                    />
                    <AdvicePanel strategy={suggestions} rollCount={rollCount} suggestedScores={suggestedScores} prettyName={prettyName} />
                    <GameHistory />
                    {/* <LifetimeStatsPanel stats={lifetimeStats} /> */}
                </div>

                <div className="w-[300px]">
                    <ScoreCardSection
                        categories={lowerCategories}
                        scores={scores}
                        suggestedScores={suggestedScores}
                        applyScore={applyScore}
                        rollCount={rollCount}
                        turnComplete={turnComplete}
                        prettyName={prettyName}
                        isUpperSection={false}
                        earnedBonuses={earnedBonuses}
                        totalsNode={
                            <LowerSectionTotals
                                lowerTotal={lowerTotal}
                                grandTotal={grandTotal}
                            />
                        }
                    />
                </div>
            </div>
        </div>
    );
}
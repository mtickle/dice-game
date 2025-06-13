import DiceField from './DiceField';
import ScoreCardSection from './ScoreCardSection';
import SectionTotals from './SectionTotals';
import StrategyPanel from './StrategyPanel';

export default function ScoreCardLayout(props) {
    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-6xl">

            <DiceField
                dice={props.dice}
                rollDice={props.rollDice}
                toggleHold={props.toggleHold}
            />

            <StrategyPanel advice={props.gameAdvice} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="p-4 bg-white border border-gray-300 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Upper Section</h2>
                    <ScoreCardSection
                        categories={['ones', 'twos', 'threes', 'fours', 'fives', 'sixes']}
                        scores={props.scores}
                        suggestedScores={props.suggestedScores}
                        applyScore={props.applyScore}
                        rollCount={props.rollCount}
                        turnComplete={props.turnComplete}
                        prettyName={props.prettyName}
                        isUpperSection={true}
                        earnedBonuses={props.earnedBonuses}
                    />
                    <SectionTotals
                        upperSubtotal={props.upperSubtotal}
                        bonus={props.bonus}
                        upperTotal={props.upperTotal}
                    />
                </div>

                <div className="p-4 bg-white border border-gray-300 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Lower Section</h2>
                    <ScoreCardSection
                        categories={['threeKind', 'fourKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yahtzee', 'chance', 'onePair', 'twoPair']}
                        scores={props.scores}
                        suggestedScores={props.suggestedScores}
                        applyScore={props.applyScore}
                        rollCount={props.rollCount}
                        turnComplete={props.turnComplete}
                        prettyName={props.prettyName}
                        isUpperSection={false}
                        earnedBonuses={props.earnedBonuses}
                    />
                    <SectionTotals
                        lowerTotal={props.lowerTotal}
                        grandTotal={props.grandTotal}
                    />
                </div>
            </div>
        </div>
    );
}

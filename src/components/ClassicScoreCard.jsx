import ClassicScoreRow from './ClassicScoreRow';

export default function ClassicScoreCard({ scores, suggestedScores, onScore }) {
    const upper = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
    const lower = [
        'onePair', 'twoPair', 'threeKind', 'fourKind',
        'fullHouse', 'smallStraight', 'largeStraight', 'yahtzee', 'chance'
    ];

    const upperTotal = upper.reduce((sum, key) => sum + (scores[key] ?? 0), 0);
    const lowerTotal = lower.reduce((sum, key) => sum + (scores[key] ?? 0), 0);
    const grandTotal = upperTotal + lowerTotal;

    return (
        <div className="scorecard">
            <div className="score-section">
                <h4>Upper Section</h4>
                {upper.map(category => (
                    console.log(`Rendering score row for ${category}`),
                    <ClassicScoreRow
                        key={category}
                        category={category}
                        score={scores[category]}
                        suggested={suggestedScores[category]}
                        onClick={() => onScore(category)}
                    />
                ))}
                <div className="score-totals">
                    <div>Upper Subtotal: {upperTotal}</div>
                    <div className="score-bonus">
                        Bonus:
                        <progress value={upperTotal} max="63" />
                    </div>
                    <div>Upper Total: {upperTotal}</div>
                </div>
            </div>

            <div className="score-section">
                <h4>Lower Section</h4>
                {lower.map(category => (
                    <ClassicScoreRow
                        key={category}
                        category={category}
                        score={scores[category]}
                        suggested={suggestedScores[category]}
                        onClick={() => onScore(category)}
                    />
                ))}
                <div className="score-totals">
                    <div>Lower Total: {lowerTotal}</div>
                    <div>Grand Total: {grandTotal}</div>
                </div>
            </div>
        </div>
    );
}

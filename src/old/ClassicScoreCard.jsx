import '@/styles/ClassicScoreCard.css';
import { prettyName } from '@/utils/utils';
import ClassicScoreRow from './ClassicScoreRow';

export default function ClassicScoreCard({ scores, suggestedScores, onScoreSelect, turnComplete }) {
    const categories = [
        'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
        'threeofakind', 'fourofakind', 'fullhouse', 'smallstraight',
        'largestraight', 'yahtzee', 'chance', 'onepair', 'twopair'
    ];

    return (
        <div className="classic-scorecard">
            <h2>Scorecard</h2>
            {categories.map(category => (
                <ClassicScoreRow
                    key={category}
                    label={prettyName(category)}
                    score={scores[category]}
                    onClick={() => onScoreSelect(category)}
                    clickable={!turnComplete && scores[category] === null}
                    suggested={suggestedScores[category] !== undefined ? suggestedScores[category] : null}
                />
            ))}
        </div>
    );
}

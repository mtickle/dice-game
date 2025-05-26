
import Card from 'react-bootstrap/Card';
import ScoreCardSection from './ScoreCardSection';

export default function UnifiedScoreSection({
    title,
    categories,
    scores,
    suggestedScores,
    applyScore,
    rollCount,
    turnComplete,
    prettyName,
    totalsNode,
    bonusCategory 
}) {
    return (
        <Card>
            <Card.Header>{title}</Card.Header>
            <Card.Body bg="Secondary">
                <ScoreCardSection
                    title=""
                    categories={categories}
                    scores={scores}
                    suggestedScores={suggestedScores}
                    applyScore={applyScore}
                    rollCount={rollCount}
                    turnComplete={turnComplete}
                    prettyName={prettyName}
                    bonusCategory={bonusCategory}
                />
                {totalsNode}
            </Card.Body>
        </Card>
    );
}

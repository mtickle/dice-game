
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
    isUpperSection,
    bonusCategory,
    upperSubtotal,
    bonus,
    upperTotal,
    lowerTotal,
    grandTotal
}) {
    return (
        <Card>
            <Card.Header>{title}</Card.Header>
            <Card.Body bg="Secondary">
                <ScoreCardSection
                    categories={categories}
                    scores={scores}
                    suggestedScores={suggestedScores}
                    applyScore={applyScore}
                    rollCount={rollCount}
                    turnComplete={turnComplete}
                    prettyName={prettyName}
                    bonusCategory={bonusCategory}
                    isUpperSection={isUpperSection}
                    bonus={bonus}
                    upperTotal={upperTotal}
                />
            </Card.Body>
        </Card>
    );
}

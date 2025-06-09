
import Card from 'react-bootstrap/Card';
import ScoreCardSection from './ScoreCardSection';
import UnifiedSectionTotals from './UnifiedSectionTotals';

export default function UnifiedScoreSection({
    title,
    categories,
    scores,
    suggestedScores,
    applyScore,
    rollCount,
    turnComplete,
    prettyName,
    isUpperSection,
    bonusCategory,
    upperSubtotal,
    bonus,
    upperTotal,
    totalsNode,
    lowerTotal,
    grandTotal,
    earnedBonuses,
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
                    upperSubtotal={upperSubtotal}
                    bonus={bonus}
                    upperTotal={upperTotal}
                    earnedBonuses={earnedBonuses}
                    totalsNode={
                        <UnifiedSectionTotals
                            upperSubtotal={upperSubtotal}
                            bonus={bonus}
                            upperTotal={upperTotal}
                            lowerTotal={lowerTotal}
                            grandTotal={grandTotal}
                        />
                    }

                />
            </Card.Body>
        </Card>
    );
}

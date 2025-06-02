import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import './styles/Dice.css';

import { useGameLogic } from './hooks/useGameLogic';
import { dotPositions, lowerCategories, prettyName, upperCategories } from './utils/utils';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import DiceField from './components/DiceField';
import UnifiedScoreSection from './components/UnifiedScoreSection';
import UnifiedSectionTotals from './components/UnifiedSectionTotals';

function App() {

  const {
    scores,
    dice,
    rollCount,
    turnComplete,
    bonusCategory,
    bonusMessage,
    bonusFadingOut,
    rollDice,
    toggleHold,
    applyScore,
    resetGame,
    isGameOver,
    suggestedScores,
  } = useGameLogic();


  // Totals for UI display
  const safeScore = (val) => (typeof val === 'number' && !isNaN(val) ? val : 0);

  const upperSubtotal = upperCategories.reduce(
    (sum, key) => sum + safeScore(scores[key]),
    0
  );

  const bonus = upperSubtotal >= 63 ? 35 : 0;
  const upperTotal = upperSubtotal + bonus;

  const lowerTotal = lowerCategories.reduce(
    (sum, key) => sum + safeScore(scores[key]),
    0
  );

  const grandTotal = upperTotal + lowerTotal;

  return (
    <Container>
      <Row>
        <Col>
          <UnifiedScoreSection
            title="Upper Section"
            categories={upperCategories}
            scores={scores}
            suggestedScores={suggestedScores}
            applyScore={applyScore}
            rollCount={rollCount}
            turnComplete={turnComplete}
            prettyName={prettyName}
            bonusCategory={bonusCategory}
            isUpperSection={true}
            isLowerSection={false}
            upperTotal={upperTotal}
          />
        </Col>
        <Col>
          <UnifiedScoreSection
            title="Lower Section"
            categories={lowerCategories}
            scores={scores}
            suggestedScores={suggestedScores}
            applyScore={applyScore}
            rollCount={rollCount}
            turnComplete={turnComplete}
            prettyName={prettyName}
            bonusCategory={bonusCategory}
            isUpperSection={false}
            isLowerSection={true}
          />
        </Col>
        <Col>
          <DiceField
            dice={dice}
            toggleHold={toggleHold}
            rollDice={rollDice}
            rollCount={rollCount}
            suggestedScores={suggestedScores}
            dotPositions={dotPositions}
            isGameOver={isGameOver}
            resetGame={resetGame}
            scores={scores}
            applyScore={applyScore}
            bonusMessage={bonusMessage}
            bonusFadingOut={bonusFadingOut}
          />
          <UnifiedSectionTotals
            upperSubtotal={upperSubtotal}
            bonus={bonus}
            upperTotal={upperTotal}
            lowerTotal={lowerTotal}
            grandTotal={grandTotal}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default App;

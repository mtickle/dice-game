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
    players,
    currentPlayer,
    dice,
    rollCount,
    bonusCategory,
    rollDice,
    toggleHold,
    applyScore,
    resetGame,
    currentPlayerIndex,
    scores = currentPlayer?.scores || {},
    turnComplete,
    suggestedScores,
    bonusMessage,
    bonusFadingOut,
    isGameOver,
    upperSubtotal,
    bonus,
    upperTotal,
    lowerTotal,
    grandTotal,
  } = useGameLogic();

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
            totalsNode={null}
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
            upperSubtotal={upperSubtotal}
            bonus={bonus}
            upperTotal={upperTotal}
            lowerTotal={lowerTotal}
            totalsNode={null}
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

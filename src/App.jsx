import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import './styles/Dice.css';

import { useGameLogic } from './hooks/useGameLogic';
import { getStrategyAdvice } from './utils/strategyUtils';
import { dotPositions, lowerCategories, prettyName, upperCategories } from './utils/utils';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import DiceField from './components/DiceField';
import GameLogPanel from './components/GameLogPanel';
import HelperPanel from './components/HelperPanel';
import StatsPanel from './components/StatsPanel';
import StrategyPanel from './components/StrategyPanel';
import UnifiedScoreSection from './components/UnifiedScoreSection';

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
    resetGameLog,
    isGameOver,
    suggestedScores,
    gameLog
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
  const strategy = getStrategyAdvice(dice, scores);

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
            upperSubtotal={upperSubtotal}
            upperTotal={upperTotal}
            bonus={bonus}
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
            lowerTotal={lowerTotal}
            grandTotal={grandTotal}
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
          <StrategyPanel
            strategy={strategy}
            rollCount={rollCount}
          />
          <HelperPanel
            resetGameLog={resetGameLog}
            resetGame={resetGame} />


        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <StatsPanel
            gameLog={gameLog}
          />
        </Col>
        <Col>
          <GameLogPanel
            gameLog={gameLog}
            prettyName={prettyName}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default App;

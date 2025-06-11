import '@styles/App.css';
import '@styles/Dice.css';
import '@styles/ScoreCardSection.css';
import '@styles/ScoreRow.css';
import '@styles/ScoreTotals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useGameLogic } from './hooks/useGameLogic';
import { getStrategyAdvice } from './utils/strategyUtils';
import { DiceBreakerLogo, dotPositions, lowerCategories, prettyName, upperCategories } from './utils/utils';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';

import DiceField from '@components/DiceField';
import HelperPanel from '@components/HelperPanel';
import StrategyPanel from '@components/StrategyPanel';
import UnifiedScoreSection from '@components/UnifiedScoreSection';


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
    gameLog,
    earnedBonuses
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
    <Container className="container container-area">
      <Navbar bg="dark" variant="dark" className="mb-4" >
        <Container className="d-flex justify-content-between align-items-center">
          <Navbar.Brand className="d-flex align-items-center gap-2">
            <DiceBreakerLogo />
            <span className="fw-bold text-gradient">Dice Breaker</span>
          </Navbar.Brand>
          <span className="text-light fst-italic d-none d-md-block">
            Crack the combos. Rule the roll.
          </span>
        </Container>
      </Navbar >
      {/* <FullPageLayout>
        <ClassicScoreCard
          scores={scores}
          suggestedScores={suggestedScores}
          applyScore={applyScore}
          bonusCategory={bonusCategory}
          bonusMessage={bonusMessage}
          bonusFadingOut={bonusFadingOut}
        />
        <div style={{ flexBasis: '400px' }}>
          <DiceField dice={dice} toggleHold={toggleHold} rollDice={rollDice} rollCount={rollCount} />
          <StrategyPanel
            strategy={strategy}
            rollCount={rollCount}
          />         
        </div>
      </FullPageLayout> */}
      {/* <Row>
        <Col md={6}>
          <ClassicScoreCard
            scores={scores}
            suggestedScores={suggestedScores}
            applyScore={applyScore}
            bonusCategory={bonusCategory}
            bonusMessage={bonusMessage}
            bonusFadingOut={bonusFadingOut}
          />
        </Col>
        <Col md={6}>

        </Col>
      </Row> */}
      <Row>
        <Col md={3}>
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
            earnedBonuses={earnedBonuses}
          />
        </Col>
        <Col md={3}>
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
        <Col md={6}>
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
      {/* <Row className="mt-4">
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
      </Row> */}
    </Container >
  );
}

export default App;

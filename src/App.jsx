import { useState } from 'react';
//--- CSS imports.
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import './styles/Dice.css';

//--- Utility imports.
import { initialScores, rollCount, rollDice } from './hooks/useGameLogic';
import { calculateGrandTotal, calculateLowerTotal, calculateScore, calculateUpperTotal } from './utils/scoreUtils';
import { dotPositions, lowerCategories, prettyName, upperCategories } from './utils/utils';

//--- Bootstrap imports.
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

//--- Components imports.
import DiceField from './components/DiceField';
import UnifiedScoreSection from './components/UnifiedScoreSection';
import UnifiedSectionTotals from './components/UnifiedSectionTotals';

function App() {


  //--- Dice state: 5 dice, each with value (1-6 or null) and held status
  const [dice, setDice] = useState(
    Array(5).fill().map(() => ({ value: null, held: false }))
  );

  //const [rollCount, setRollCount] = useState(0);
  const [scores, setScores] = useState(initialScores);
  const [turnComplete, setTurnComplete] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [bonusMessage, setBonusMessage] = useState('');
  const [bonusCategory, setBonusCategory] = useState(null);
  const [bonusFadingOut, setBonusFadingOut] = useState(false);


  //--- Check if all categories scored → Game Over
  const isGameOver = Object.values(scores).every(score => score !== null);


  //--- EXTRA SCORING TOOLS.
  //--- These are being passed into the scoring components below.
  const upperSubtotal = upperCategories.reduce(
    (sum, key) => sum + (scores[key] ?? 0),
    0
  );

  const bonus = upperSubtotal >= 63 ? 35 : 0;
  const upperTotal = upperSubtotal + bonus;


  const lowerTotal = lowerCategories.reduce(
    (sum, key) => sum + (scores[key] ?? 0),
    0
  );

  const grandTotal = upperTotal + lowerTotal;

  //--- Toggle hold/unhold die by index
  const toggleHold = (index) => {
    if (turnComplete || rollCount === 0) return; // optional: prevent hold before first roll
    setDice(dice.map((die, i) =>
      i === index ? { ...die, held: !die.held } : die
    ));
  };

  //--- Apply score for a category when user selects it
  const applyScore = (category) => {
    if (scores[category] !== null || turnComplete || rollCount === 0) return;

    setTurnComplete(true);

    let score = 0;
    const qualifyingFirstRollBonusCategories = [
      'twoPair',
      'threeKind',
      'fourKind',
      'yahtzee',
      'fullHouse',
      'smallStraight',
      'largeStraight',
    ];

    // Upper section logic
    if (['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].includes(category)) {
      const num = {
        ones: 1, twos: 2, threes: 3,
        fours: 4, fives: 5, sixes: 6,
      }[category];

      const count = dice.filter(d => d.value === num).length;
      score = count * num;
    } else {
      // Lower section logic
      score = calculateScore(category, dice);

      // Apply 10-point bonus if it's a first roll and a qualifying category that actually scored
      if (
        rollCount === 1 &&
        qualifyingFirstRollBonusCategories.includes(category) &&
        score > 0
      ) {
        score += 10;
        //setBonusMessage(`🎉 Bonus! +10 points for first-roll ${prettyName(category)}!`);
        setBonusCategory(category);

        setTimeout(() => {
          setBonusFadingOut(true); // trigger CSS class

          setTimeout(() => {
            //setBonusMessage('');
            setBonusCategory(null);
            setBonusFadingOut(false);
          }, 300); // duration should match fadeOutSlide
        }, 3000); // initial display time
      }
    }

    const updatedScores = { ...scores, [category]: score };
    setScores(updatedScores);

    // Wait briefly before resetting turn
    setTimeout(() => {
      setDice(Array(5).fill().map(() => ({ value: null, held: false })));
      setRollCount(0);
      setTurnComplete(false);

      const gameOver = Object.values(updatedScores).every(v => v !== null);
      if (gameOver) {
        const newRecord = {
          timestamp: new Date().toLocaleString(),
          upperTotal: calculateUpperTotal(updatedScores),
          lowerTotal: calculateLowerTotal(updatedScores),
          grandTotal: calculateGrandTotal(updatedScores),
        };
        setGameHistory(prev => [newRecord, ...prev]);
      }
    }, 100);
  };

  //---- CALCULATE TOTALS 
  // Calculate lower total


  // Calculate suggested scores for UI hints (only for unscored categories)
  const suggestedScores = {};
  Object.keys(scores).forEach(category => {
    if (scores[category] === null) {
      if (upperCategories.includes(category)) {
        const num = {
          ones: 1, twos: 2, threes: 3,
          fours: 4, fives: 5, sixes: 6,
        }[category];
        const count = dice.filter(d => d.value === num).length;
        suggestedScores[category] = count * num;
      } else {
        suggestedScores[category] = calculateScore(category, dice);
      }
    }
  });

  // Reset entire game state
  function resetGame() {
    setDice(Array(5).fill().map(() => ({ value: null, held: false })));
    setScores({
      ones: null, twos: null, threes: null, fours: null, fives: null, sixes: null,
      twoPair: null, threeKind: null, fourKind: null, fullHouse: null, smallStraight: null,
      largeStraight: null, yahtzee: null, chance: null,
    });
    setRollCount(0);
    setTurnComplete(false);
  }

  return (
    <>
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
            &nbsp;

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
              //grandTotal={grandTotal}
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

            &nbsp;

            <UnifiedSectionTotals
              upperSubtotal={upperSubtotal}
              bonus={bonus}
              upperTotal={upperTotal}
              lowerTotal={lowerTotal}
              grandTotal={grandTotal}
            />
            &nbsp;


            {/* <GameHistory history={gameHistory} /> */}
          </Col>
        </Row>
        <Row>
        </Row>
      </Container>
    </>
  )
}

export default App

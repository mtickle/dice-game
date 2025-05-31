import { useState } from 'react';
//--- CSS imports.
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import './styles/Dice.css';
import { dotPositions, initialScores, lowerCategories, prettyName, upperCategories } from './utils/utils';


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

  const [rollCount, setRollCount] = useState(0);
  const [scores, setScores] = useState(initialScores);
  const [turnComplete, setTurnComplete] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [bonusMessage, setBonusMessage] = useState('');
  const [bonusCategory, setBonusCategory] = useState(null);
  const [bonusFadingOut, setBonusFadingOut] = useState(false);


  //--- Check if all categories scored → Game Over
  const isGameOver = Object.values(scores).every(score => score !== null);

  //--- Calculate subtotal of upper categories (treat null as zero)
  const upperSubtotal = upperCategories.reduce(
    (sum, key) => sum + (scores[key] ?? 0),
    0
  );

  // Bonus if subtotal >= 63
  const bonus = upperSubtotal >= 63 ? 35 : 0;
  const upperTotal = upperSubtotal + bonus;

  // Roll dice (max 3 rolls, and only if turn not complete)
  const rollDice = () => {
    if (rollCount >= 3 || turnComplete) return;

    setDice(prev =>
      prev.map(die =>
        die.held ? die : { ...die, value: Math.floor(Math.random() * 6) + 1 }
      )
    );
    setRollCount(prev => prev + 1);
  };

  //--- Toggle hold/unhold die by index
  const toggleHold = (index) => {
    if (turnComplete || rollCount === 0) return; // optional: prevent hold before first roll
    setDice(dice.map((die, i) =>
      i === index ? { ...die, held: !die.held } : die
    ));
  };

  // Count dice values (array of counts for 1-6)
  const getCounts = (dice) => {
    const counts = Array(6).fill(0);
    dice.forEach(d => {
      if (d.value !== null) counts[d.value - 1]++;
    });
    return counts;
  };

  // Check if counts have a straight of given length
  const hasStraight = (counts, length) => {
    const binary = counts.map(c => (c > 0 ? 1 : 0)).join('');
    // For length 4 or 5, check known straight patterns in the binary string
    const straights = {
      4: ['1111', '01111', '11110'],
      5: ['11111', '011111', '111110'],
    }[length];
    return straights.some(pattern => binary.includes(pattern));
  };

  //--- Calculate score for lower section categories
  const calculateScore = (category, dice) => {
    const values = dice.map(d => d.value).filter(v => v !== null);
    const counts = getCounts(dice);
    const total = values.reduce((a, b) => a + b, 0);

    switch (category) {

      case 'twoPair': {
        const pairs = counts
          .map((count, i) => (count >= 2 ? i + 1 : 0))
          .filter(v => v > 0)
          .sort((a, b) => b - a); // highest first
        return pairs.length >= 2 ? pairs[0] * 2 + pairs[1] * 2 : 0;
      }

      case 'threeKind':
        return counts.some(c => c >= 3) ? total : 0;
      case 'fourKind':
        return counts.some(c => c >= 4) ? total : 0;
      case 'fullHouse':
        return counts.includes(3) && counts.includes(2) ? 25 : 0;
      case 'smallStraight':
        return hasStraight(counts, 4) ? 30 : 0;
      case 'largeStraight':
        return hasStraight(counts, 5) ? 40 : 0;
      case 'yahtzee':
        return counts.includes(5) ? 50 : 0;
      case 'chance':
        return total;
      default:
        return 0;
    }
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
        setBonusMessage(`🎉 Bonus! +10 points for first-roll ${prettyName(category)}!`);
        //setBonusCategory(category);

        setTimeout(() => {
          setBonusFadingOut(true); // trigger CSS class

          setTimeout(() => {
            setBonusMessage('');
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
  const lowerTotal = lowerCategories.reduce(
    (sum, key) => sum + (scores[key] ?? 0),
    0
  );

  // Grand total
  const grandTotal = upperTotal + lowerTotal;

  const calculateUpperTotal = (scores) => {
    const subtotal = upperCategories.reduce((sum, key) => sum + (scores[key] ?? 0), 0);
    const bonus = subtotal >= 63 ? 35 : 0;
    return subtotal + bonus;
  };

  const calculateLowerTotal = (scores) => {
    return lowerCategories.reduce((sum, key) => sum + (scores[key] ?? 0), 0);
  };

  const calculateGrandTotal = (scores) => {
    return calculateUpperTotal(scores) + calculateLowerTotal(scores);
  };


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
              upperTotal={upperTotal}
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

          </Col>
          {/* <Col>
            <UnifiedSectionTotals
              upperSubtotal={upperSubtotal}
              bonus={bonus}
              upperTotal={upperTotal}
              lowerTotal={lowerTotal}
              grandTotal={grandTotal}
            />
            &nbsp;


            <GameHistory history={gameHistory} />
          </Col> */}
        </Row>
        <Row>
        </Row>
      </Container>
    </>
  )
}

export default App

import { AnimatePresence, motion } from 'framer-motion';
import { iconMap, prettyName } from '../../utils/utils';

export default function SuggestedScores({ suggestedScores = {}, applyScore, scores, turnComplete, rollCount, }) {
    const eligibleSuggestions = Object.entries(suggestedScores).filter(
        ([category, score]) =>
            scores[category] === null && score > 0 && rollCount > 0 && !turnComplete
    );

    if (eligibleSuggestions.length === 0) return null;

    return (
        <div className="mt-4">
            <div className="d-flex flex-wrap gap-2">
                <AnimatePresence>
                    {eligibleSuggestions.map(([category, score]) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => applyScore(category)}
                            className={`suggestion-card ${['yahtzee', 'largestraight', 'fourofakind'].includes(category) ? 'highlight' : ''}`}
                            title={`Score ${score} for ${prettyName(category)}`}
                        >
                            <span className="emoji">{iconMap[category] || '🎯'}</span>{' '}
                            <strong>{prettyName(category)}</strong>: {score}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

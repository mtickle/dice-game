export default function AdvicePanel({ strategy, rollCount, suggestedScores, prettyName }) {
    return (
        <div className="flex gap-4 mt-6">

            {/* Strategy Advice */}
            <div className="w-1/2 min-w-[300px] max-w-[50%] bg-yellow-100 border border-yellow-300 rounded p-4 min-h-[220px] overflow-y-auto">
                <h2 className="text-lg font-bold mb-2">Turn Analysis</h2>
                {rollCount === 0 ? (
                    <p className="text-gray-400">Roll the dice to get strategic advice.</p>
                ) : (
                    <div className="text-left space-y-1">
                        {strategy?.advice?.length > 0 ? (
                            strategy.advice.map((line, index) => (
                                <div key={index}>{line}</div>
                            ))
                        ) : (
                            <p className="text-gray-400 italic">No advice available for this roll.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Suggested Scores */}
            <div className="w-1/2 min-w-[300px] max-w-[50%] bg-gray-100 border border-gray-300 rounded p-4 min-h-[220px] overflow-y-auto">
                <h2 className="text-lg font-bold mb-2">Suggested Scores</h2>
                {rollCount === 0 ? (
                    <p className="text-gray-500">Roll the dice to see score suggestions.</p>
                ) : (
                    <div className="flex flex-col gap-1">
                        {Object.entries(suggestedScores || {}).length > 0 ? (
                            Object.entries(suggestedScores).map(([category, score]) => (
                                <div
                                    key={category}
                                    className="flex justify-between items-center bg-white p-2 rounded shadow-sm"
                                >
                                    <span className="font-medium">{prettyName(category)}</span>
                                    <span className="font-mono">{score}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 italic">No suggestions available.</p>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}

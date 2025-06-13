// components/AdvicePanel.jsx

export default function AdvicePanel({ strategy, rollCount, suggestedScores, prettyName }) {
    return (
        <div className="flex flex-col gap-4 w-[300px]">

            {/* Strategy Advice */}
            <div className="bg-gray-900 text-white shadow-md rounded-lg p-4">
                <h2 className="text-lg font-bold mb-2">Turn Analysis</h2>
                {rollCount === 0 ? (
                    <p className="text-gray-400">Roll the dice to get strategic advice.</p>
                ) : (
                    <div className="text-left space-y-1">
                        {strategy?.advice?.map((line, index) => (
                            <div key={index}>{line}</div>
                        ))}
                    </div>
                )}
            </div>

            {/* Suggested Scores */}
            <div className="bg-gray-100 text-black shadow-md rounded-lg p-4">
                <h2 className="text-lg font-bold mb-2">Suggested Scores</h2>
                {rollCount === 0 ? (
                    <p className="text-gray-500">Roll the dice to see score suggestions.</p>
                ) : (
                    <div className="flex flex-col gap-1">
                        {Object.entries(suggestedScores || {}).map(([category, score]) => (
                            <div key={category} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                                <span className="font-medium">{prettyName(category)}</span>
                                <span className="font-mono">{score}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}

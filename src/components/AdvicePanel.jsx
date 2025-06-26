export default function AdvicePanel({ strategy, rollCount, suggestedScores, prettyName }) {
    return (
        <div className="w-full h-full flex gap-4 justify-center bg-[#fffdf7] p-4 rounded-2xl shadow-md border-2 border-[#e2dccc]">

            {/* Strategy Advice */}
            <div className="w-full min-w-[300px] rounded p-2 min-h-[220px] overflow-y-auto">
                <h2 className="text-md font-bold mb-2">Turn Analysis</h2>
                {rollCount === 0 ? (
                    <p className="flex justify-between items-center bg-white p-1 rounded shadow-sm text-md">Waiting ...</p>
                ) : (
                    <div className="text-left space-y-1">
                        {strategy?.advice?.length > 0 ? (
                            strategy.advice.map((line, index) => (

                                <div className="flex justify-between items-center bg-white p-1 rounded shadow-sm text-md" key={index}>{line}</div>
                            ))
                        ) : (
                            <p className="text-gray-400 italic text-sm">No advice available for this roll.</p>
                        )}
                    </div>
                )}
            </div>


            {/* <div className="w-1/2 min-w-[300px] max-w-[50%] bg-gray-100 border border-gray-300 rounded p-4 min-h-[220px] overflow-y-auto">
                <h2 className="text-md font-bold mb-2">Suggested Scores</h2>
                {rollCount === 0 ? (
                    <p className="text-gray-500 text-sm">Roll the dice to see score suggestions.</p>
                ) : (
                    <div className="flex flex-col gap-1">
                        {Object.entries(suggestedScores || {}).length > 0 ? (
                            Object.entries(suggestedScores).map(([category, score]) => (
                                <div
                                    key={category}
                                    className="flex justify-between items-center bg-white p-1 rounded shadow-sm"
                                >
                                    <span className="text-xs">{prettyName(category)}</span>
                                    <span className="text-xs">{score}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 italic">No suggestions available.</p>
                        )}
                    </div>
                )}
            </div> */}

        </div>
    );
}

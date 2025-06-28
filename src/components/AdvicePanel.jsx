export default function AdvicePanel({ strategy, rollCount, gameNumber }) {
    return (
        <div className="w-full flex gap-4 justify-center bg-[#fffdf7] p-4 rounded-2xl shadow-md border-2 border-[#e2dccc] h-full min-h-0">
            <div className="w-full min-w-[300px] rounded p-2 min-h-[100px] overflow-y-auto flex-1">
                <h2 className="text-md font-bold mb-2">
                    Turn Analysis{gameNumber > 0 ? ` - Game ${gameNumber}` : ''}
                </h2>
                {rollCount === 0 ? (
                    <p className="flex justify-between items-center bg-white p-1 rounded shadow-sm text-md">Waiting ...</p>
                ) : (
                    <div className="text-left space-y-1">
                        {strategy?.advice?.length > 0 ? (
                            strategy.advice.map((line, index) => (
                                <div className="flex justify-between items-center bg-white p-1 rounded shadow-sm text-md" key={index}>
                                    {line}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 italic text-sm">No advice available for this roll.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
export default function GameOverScreen({ grandTotal, upperTotal, lowerTotal, bonus, onReset }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-paper p-8 text-center">
            <div className="text-5xl font-extrabold text-black mb-6 drop-shadow-sm">Game Over</div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-300 w-96 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                    <span>Upper Total:</span> <span>{upperTotal}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                    <span>Bonus:</span> <span>{bonus}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                    <span>Lower Total:</span> <span>{lowerTotal}</span>
                </div>
                <hr className="my-2 border-t border-gray-400" />
                <div className="flex justify-between text-2xl font-bold text-green-800">
                    <span>Grand Total:</span> <span>{grandTotal}</span>
                </div>
            </div>

            <button
                onClick={onReset}
                className="mt-10 px-8 py-4 bg-yellow-300 hover:bg-yellow-400 text-black font-bold rounded-xl shadow-md border border-gray-400 transition"
            >
                Play Again
            </button>
        </div>
    );
}

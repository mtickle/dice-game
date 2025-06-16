
export default function GameOverModal({ grandTotal, onRestart }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-[#f5f0e6] rounded-2xl shadow-lg p-8 w-full max-w-md text-center relative">
                <h2 className="text-3xl font-extrabold mb-4 text-[#3c2a21]">🎉 Game Over!</h2>
                <p className="text-xl mb-6">Your final score:</p>
                <div className="text-5xl font-bold mb-8 text-[#8b5e3c]">{grandTotal}</div>
                <button
                    onClick={onRestart}
                    className="bg-[#3c2a21] hover:bg-[#5a3c2d] text-white px-6 py-3 rounded-full transition shadow-md"
                >
                    Play Again
                </button>
            </div>
        </div>
    );
}

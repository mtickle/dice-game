export default function GameOverModal({ grandTotal, onRestart }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-[320px]">
                <h2 className="text-3xl font-bold mb-4">Game Over</h2>
                <p className="text-xl mb-6">Your Score: <span className="font-semibold">{grandTotal}</span></p>
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-xl text-lg shadow"
                    onClick={onRestart}
                >
                    Play Again
                </button>
            </div>
        </div>
    );
}

import { useState } from 'react';
//import { AppContext } from '@components/App';

export default function ControlPanel({ onExport, onReset, onToggleTurns, onAutoPlay }) {
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);

    const handleAutoPlay = () => {
        setIsAutoPlaying((prev) => !prev);
        onAutoPlay(!isAutoPlaying);
    };

    const handleExport = () => {
        onExport();
    };

    const handleReset = () => {
        if (window.confirm('Reset all turn and game data? This cannot be undone.')) {
            onReset();
        }
    };

    const handleToggleTurns = () => {
        onToggleTurns();
    };

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-3/4 max-w-md bg-white rounded-2xl shadow-lg p-4 border border-gray-200 z-10">
            <div className="grid grid-cols-2 gap-3">
                <button
                    className="w-full bg-blue-600 text-white rounded-xl py-2 hover:bg-blue-700 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
                    onClick={handleExport}
                >
                    Export Game Data
                </button>
                <button
                    className="w-full bg-red-600 text-white rounded-xl py-2 hover:bg-red-700 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
                    onClick={handleReset}
                >
                    Reset All Data
                </button>
                <button
                    className="w-full bg-gray-600 text-white rounded-xl py-2 hover:bg-gray-700 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
                    onClick={handleToggleTurns}
                >
                    Show All Turns
                </button>
                <button
                    className="w-full bg-green-600 text-white rounded-xl py-2 hover:bg-green-700 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-md"
                    onClick={handleAutoPlay}
                >
                    {isAutoPlaying ? 'Stop AutoPlay' : 'Start AutoPlay'}
                </button>
            </div>
        </div>
    );
}
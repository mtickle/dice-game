export default function SuggestionsPanel({ suggestions }) {
    if (!suggestions || Object.keys(suggestions).length === 0) return null;

    return (
        <div className="w-[300px] bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <h2 className="text-lg font-bold mb-2 border-b border-gray-300 pb-1 text-gray-800">Suggested Scores</h2>

            <div className="space-y-2">
                {Object.entries(suggestions).map(([category, value]) => (
                    <div
                        key={category}
                        className="flex justify-between items-center text-sm px-2 py-1 rounded bg-gray-50 hover:bg-yellow-100 transition"
                    >
                        <span className="font-medium text-gray-700">{category}</span>
                        <span className="font-mono text-gray-900">{value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

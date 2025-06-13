export default function SuggestionsPanel({ advice }) {
    if (!advice) return null;

    return (
        <div className="w-full max-w-3xl bg-yellow-100 border border-yellow-400 text-yellow-900 p-4 rounded shadow-md mb-4">
            <h2 className="font-bold mb-2 text-lg">AI Suggestion:</h2>
            <p className="text-sm">{advice.recommendation}</p>

            {advice.explanation && (
                <div className="mt-2 text-xs text-yellow-800">
                    <strong>Why:</strong> {advice.explanation}
                </div>
            )}
        </div>
    );
}

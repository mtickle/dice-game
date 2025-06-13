export function UpperSectionTotals({ upperSubtotal, bonus, upperTotal }) {
    const rows = [
        { label: 'Upper Subtotal', value: upperSubtotal },
        { label: 'Bonus', value: bonus },
        { label: 'Upper Total', value: upperTotal },
    ];

    return (
        <div className="space-y-2">
            {rows.map(({ label, value }) => (
                <div
                    key={label}
                    className="flex justify-between items-center p-2 border border-gray-300 rounded bg-white shadow-sm"
                >
                    <div className="text-sm font-semibold text-black">{label}</div>
                    <div className="text-lg font-mono text-gray-800">{value}</div>
                </div>
            ))}
        </div>
    );
}

export function LowerSectionTotals({ lowerTotal, grandTotal }) {
    const rows = [
        { label: 'Lower Total', value: lowerTotal },
        { label: 'Grand Total', value: grandTotal },
    ];

    return (
        <div className="space-y-2">
            {rows.map(({ label, value }) => (
                <div
                    key={label}
                    className="flex justify-between items-center p-2 border border-gray-300 rounded bg-white shadow-sm"
                >
                    <div className="text-sm font-semibold text-black">{label}</div>
                    <div className="text-lg font-mono text-gray-800">{value}</div>
                </div>
            ))}
        </div>
    );
}

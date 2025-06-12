export default function UnifiedSectionTotals({
    upperSubtotal,
    bonus,
    upperTotal,
    lowerTotal,
    grandTotal,
}) {
    const rows = [
        { label: 'Upper Subtotal', value: upperSubtotal },
        { label: 'Bonus', value: bonus },
        { label: 'Upper Total', value: upperTotal },
        { label: 'Lower Total', value: lowerTotal },
        { label: 'Grand Total', value: grandTotal },
    ];

    return (
        <div className="mt-4 flex flex-col gap-2">
            {rows.map(({ label, value }) => {
                if (value == null) return null;
                return (
                    <div key={label} className="flex justify-between border-t pt-1">
                        <div className="font-semibold">{label}</div>
                        <div className="font-mono">{value}</div>
                    </div>
                );
            })}
        </div>
    );
}

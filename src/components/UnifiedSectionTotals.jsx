import { useEffect, useMemo, useState } from 'react';
import BonusProgressBar from './BonusProgressBar';

export default function UnifiedSectionTotals({
    upperSubtotal,
    bonus,
    upperTotal,
    lowerTotal,
    grandTotal,
}) {
    const rows = useMemo(() => [
        { label: 'Upper Subtotal', value: upperSubtotal },
        { label: 'Bonus', value: bonus },
        { label: 'Upper Total', value: upperTotal },
        { label: 'Lower Total', value: lowerTotal },
        { label: 'Grand Total', value: grandTotal },
    ], [upperSubtotal, bonus, upperTotal, lowerTotal, grandTotal]);

    const [displayValues, setDisplayValues] = useState(() =>
        rows.reduce((acc, row) => {
            acc[row.label] = row.value;
            return acc;
        }, {})
    );

    const [animatingLabels, setAnimatingLabels] = useState({});

    useEffect(() => {
        rows.forEach(({ label, value }) => {
            if (displayValues[label] !== value) {
                setAnimatingLabels((prev) => ({ ...prev, [label]: true }));
                setTimeout(() => {
                    setDisplayValues((prev) => ({ ...prev, [label]: value }));
                    setAnimatingLabels((prev) => ({ ...prev, [label]: false }));
                }, 200);
            }
        });
    }, [rows]);

    return (
        <div className="space-y-1">
            {rows.map(({ label, value }) => {
                if (value == null) return null;

                const isAnimating = animatingLabels[label];
                const isBonusRow = label === 'Bonus';

                return (
                    <div
                        key={label}
                        className={`flex justify-between items-center px-3 py-2 border border-gray-300 rounded bg-white transition-colors duration-300 ${isAnimating ? 'text-green-600' : 'text-gray-800'}`}
                    >
                        <div className="flex items-center gap-2 font-semibold text-sm">
                            <em>{label}</em>
                            {isBonusRow && <BonusProgressBar upperTotal={upperSubtotal} />}
                        </div>

                        {!isBonusRow && (
                            <div className="text-right font-mono text-base">{displayValues[label]}</div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

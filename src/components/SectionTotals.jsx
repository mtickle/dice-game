// components/UnifiedSectionTotals.jsx

import { useMemo, useState } from 'react';

export default function SectionTotals({
    upperSubtotal,
    bonus,
    upperTotal,
    lowerTotal,
    grandTotal,
}) {
    console.log('Rendering SectionTotals');
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

    // const [animatingLabels, setAnimatingLabels] = useState({});

    // useEffect(() => {
    //     rows.forEach(({ label, value }) => {
    //         if (displayValues[label] !== value) {
    //             setAnimatingLabels((prev) => ({ ...prev, [label]: true }));
    //             setTimeout(() => {
    //                 setDisplayValues((prev) => ({ ...prev, [label]: value }));
    //                 setAnimatingLabels((prev) => ({ ...prev, [label]: false }));
    //             }, 200);
    //         }
    //     });
    // }, [rows]);

    return (
        <div>
            {rows.map(({ label, value }) => {
                console.log(`Rendering row for ${label}: ${value}`);
                if (value == null) return null;

                // const isAnimating = animatingLabels[label];

                return (
                    <div
                        key={label}
                        className="flex justify-between items-center p-2 border border-gray-300 rounded bg-white"
                    >
                        <div className="text-sm font-medium text-black">{label}</div>
                        <div className={`text-lg font-mono ${isAnimating ? 'text-green-600' : 'text-gray-700'}`}>
                            {displayValues[label]}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

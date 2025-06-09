import { useEffect, useState } from 'react';

export default function UnifiedSectionTotals({
    upperSubtotal,
    bonus,
    upperTotal,
    lowerTotal,
    grandTotal,
}) {
    // Prepare rows array with labels and values
    const rows = [
        { label: 'Upper Subtotal', value: upperSubtotal },
        { label: 'Bonus', value: bonus },
        { label: 'Upper Total', value: upperTotal },
        { label: 'Lower Total', value: lowerTotal },
        { label: 'Grand Total', value: grandTotal },
    ];

    // Local state for animated display of values per row (optional but cool)
    // Store display values in a map keyed by label for convenience
    const [displayValues, setDisplayValues] = useState(
        () =>
            rows.reduce((acc, row) => {
                acc[row.label] = row.value;
                return acc;
            }, {})
    );

    const [animatingLabels, setAnimatingLabels] = useState({});

    useEffect(() => {
        rows.forEach(({ label, value }) => {
            if (value !== displayValues[label]) {
                // Trigger animation on change for each differing value
                setAnimatingLabels((prev) => ({ ...prev, [label]: true }));
                setTimeout(() => {
                    setDisplayValues((prev) => ({ ...prev, [label]: value }));
                    setAnimatingLabels((prev) => ({ ...prev, [label]: false }));
                }, 200); // shorter animation delay
            }
        });
    }, [rows, displayValues]);

    return (
        <div>
            <div className="mb-1">&nbsp;</div>
            {rows.map(({ label, value }) => {
                if (value == null) return null; // skip null or undefined

                const isAnimating = animatingLabels[label];

                return (
                    <div
                        key={label}
                        className={`total-row ${isAnimating ? 'score-animate' : ''}`}
                        aria-label={`${label} total`}
                        role="group"
                    >
                        <div className="total-label">
                            <em>{label}</em>
                        </div>
                        <div className="total-value">{displayValues[label]}</div>
                    </div>
                );
            })}
        </div>
    );
}

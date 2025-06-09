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
        <div>
            <div className="mb-1 score-total-section">&nbsp;</div>
            {rows.map(({ label, value }) => {
                if (value == null) return null;

                const isAnimating = animatingLabels[label];
                const isBonusRow = label === 'Bonus';

                return (
                    <div
                        key={label}
                        className={`total-row ${isAnimating ? 'score-animate' : ''}`}
                        aria-label={`${label} total`}
                        role="group"
                    >
                        <div className="total-label d-flex align-items-center gap-2">
                            <em>{label}</em>
                            {isBonusRow && <BonusProgressBar upperTotal={upperSubtotal} />}
                        </div>

                        {!isBonusRow && (
                            <div className="total-value">{displayValues[label]}</div>
                        )}
                    </div>
                );
            })}

        </div>
    );
}

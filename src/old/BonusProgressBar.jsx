const BonusProgressBar = ({ upperTotal }) => {
    const bonusThreshold = 63;
    const progress = Math.min((upperTotal / bonusThreshold) * 100, 100);
    const bonusEarned = upperTotal >= bonusThreshold;

    return (
        <div className="bonus-container">
            <div className="bonus-bar">
                <div
                    className={`bonus-fill ${bonusEarned ? 'earned' : ''}`}
                    style={{ width: `${progress}%`, transition: 'width 0.5s ease' }}
                />
            </div>
        </div>
    );
};

export default BonusProgressBar;

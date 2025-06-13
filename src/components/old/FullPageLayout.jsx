import '@styles/FullPageLayout.css';

export default function FullPageLayout({ children }) {
    return (
        <div className="full-page-container">
            <div className="game-board">
                {children}
            </div>
        </div>
    );
}

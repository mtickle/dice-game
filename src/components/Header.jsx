export default function Header() {
    return (
        <header
            role="banner"
            className="text-center py-5 bg-white border-b-2 border-gray-200 shadow-sm"
        >
            <h1
                className="m-0 text-[2.8rem] font-luckiest tracking-wide text-gray-800 drop-shadow-text-subtle"
            >
                🎲{' '}
                <span className="inline-block bg-dice-gradient bg-clip-text text-transparent">
                    Dice Breaker
                </span>{' '}
                🎲
            </h1>
        </header>
    );
}

export default function Header() {
    return (
        <header
            role="banner"
            className="text-center py-5 bg-white"
        >
            <h1
                className="m-0 text-[2.8rem] font-[Luckiest_Guy] tracking-wide text-gray-800 drop-shadow-text-subtle"
            >
                🎲{' '}
                <span className="inline-block bg-dice-gradient bg-gradient-to-r from-red-600 to-violet-600 bg-clip-text text-transparent ">
                    Dice Breaker
                </span>{' '}
                🎲
            </h1>
        </header>
    );
}
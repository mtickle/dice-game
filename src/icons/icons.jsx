export function OnesIcon({ size = 24, color = 'black', className = '' }) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="24" height="24" fill="white" stroke={color} strokeWidth="1.5" rx="4" ry="4" />
            <circle cx="12" cy="12" r="1.5" fill={color} />
        </svg>
    );
}

export function TwosIcon({ size = 24, color = 'black', className = '' }) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="24" height="24" fill="white" stroke={color} strokeWidth="1.5" rx="4" ry="4" />
            <circle cx="6" cy="6" r="1.5" fill={color} />
            <circle cx="18" cy="18" r="1.5" fill={color} />
        </svg>
    );
}

export function ThreesIcon({ size = 24, color = 'black', className = '' }) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="24" height="24" fill="white" stroke={color} strokeWidth="1.5" rx="4" ry="4" />
            <circle cx="6" cy="6" r="1.5" fill={color} />
            <circle cx="12" cy="12" r="1.5" fill={color} />
            <circle cx="18" cy="18" r="1.5" fill={color} />
        </svg>
    );
}

export function FoursIcon({ size = 24, color = 'black', className = '' }) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="24" height="24" fill="white" stroke={color} strokeWidth="1.5" rx="4" ry="4" />
            <circle cx="6" cy="6" r="1.5" fill={color} />
            <circle cx="18" cy="6" r="1.5" fill={color} />
            <circle cx="6" cy="18" r="1.5" fill={color} />
            <circle cx="18" cy="18" r="1.5" fill={color} />
        </svg>
    );
}

export function FivesIcon({ size = 24, color = 'black', className = '' }) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="24" height="24" fill="white" stroke={color} strokeWidth="1.5" rx="4" ry="4" />
            <circle cx="6" cy="6" r="1.5" fill={color} />
            <circle cx="18" cy="6" r="1.5" fill={color} />
            <circle cx="12" cy="12" r="1.5" fill={color} />
            <circle cx="6" cy="18" r="1.5" fill={color} />
            <circle cx="18" cy="18" r="1.5" fill={color} />
        </svg>
    );
}

export function SixesIcon({ size = 24, color = 'black', className = '' }) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="24" height="24" fill="white" stroke={color} strokeWidth="1.5" rx="4" ry="4" />
            <circle cx="6" cy="6" r="1.5" fill={color} />
            <circle cx="18" cy="6" r="1.5" fill={color} />
            <circle cx="6" cy="12" r="1.5" fill={color} />
            <circle cx="18" cy="12" r="1.5" fill={color} />
            <circle cx="6" cy="18" r="1.5" fill={color} />
            <circle cx="18" cy="18" r="1.5" fill={color} />
        </svg>
    );
}

// Two Pair icon: two pairs of dice dots side by side
export function TwoPairIcon({ size = 24, color = 'black', className = '' }) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="24" height="24" fill="white" stroke={color} strokeWidth="1.5" rx="4" ry="4" />
            {/* Left pair */}
            <circle cx="7" cy="8" r="1.5" fill={color} />
            <circle cx="7" cy="16" r="1.5" fill={color} />
            {/* Right pair */}
            <circle cx="17" cy="8" r="1.5" fill={color} />
            <circle cx="17" cy="16" r="1.5" fill={color} />
        </svg>
    );
}

// Three of a Kind icon: three dots in a vertical line
export function ThreeKindIcon({ size = 24, color = 'black', className = '' }) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="24" height="24" fill="white" stroke={color} strokeWidth="1.5" rx="4" ry="4" />
            <text
                x="12"
                y="18"
                textAnchor="middle"
                fontSize="16"
                fill={color}
                fontWeight="normal"
                fontFamily="Arial, sans-serif"
                pointerEvents="none"
            >
                3x
            </text>
        </svg>
    );
}

// Four of a Kind icon: four dots in a square
export function FourKindIcon({ size = 24, color = 'black', className = '' }) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="24" height="24" fill="white" stroke={color} strokeWidth="1.5" rx="4" ry="4" />
            <text
                x="12"
                y="18"
                textAnchor="middle"
                fontSize="16"
                fill={color}
                fontWeight="normal"
                fontFamily="Arial, sans-serif"
                pointerEvents="none"
            >
                4x
            </text>
        </svg>
    );
}

// Full House icon: a three of a kind plus a pair
export function FullHouseIcon({ size = 24, color = 'black', className = '' }) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="24" height="24" fill="white" stroke={color} strokeWidth="1.5" rx="4" ry="4" />
            {/* Roof */}
            <path d="M3 12 L12 3 L21 12" />
            {/* Walls */}
            <rect x="6" y="12" width="12" height="9" />
            {/* Door */}
            <rect x="10" y="16" width="4" height="5" />
        </svg>
    );
}

// Small Straight icon: four dots in a line
export function SmallStraightIcon({ size = 24, color = 'black', className = '' }) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="24" height="24" fill="white" stroke={color} strokeWidth="1.5" rx="4" ry="4" />
            <circle cx="6" cy="12" r="1.5" fill={color} />
            <circle cx="12" cy="12" r="1.5" fill={color} />
            <circle cx="18" cy="12" r="1.5" fill={color} />
            <circle cx="24" cy="12" r="1.5" fill={color} />
        </svg>
    );
}

// Large Straight icon: five dots in a line
export function LargeStraightIcon({ size = 24, color = 'black', className = '' }) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 28 24"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="28" height="24" fill="white" stroke={color} strokeWidth="1.5" rx="4" ry="4" />
            <circle cx="4" cy="12" r="1.5" fill={color} />
            <circle cx="10" cy="12" r="1.5" fill={color} />
            <circle cx="16" cy="12" r="1.5" fill={color} />
            <circle cx="22" cy="12" r="1.5" fill={color} />
            <circle cx="28" cy="12" r="1.5" fill={color} />
        </svg>
    );
}

// Yahtzee icon: five dots in the center (like 5 of a kind)
export function YahtzeeIcon({ size = 24, color = 'black', className = '' }) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="24" height="24" fill="white" stroke={color} strokeWidth="1.5" rx="4" ry="4" />
            <circle cx="12" cy="6" r="1.5" fill={color} />
            <circle cx="6" cy="12" r="1.5" fill={color} />
            <circle cx="12" cy="12" r="1.5" fill={color} />
            <circle cx="18" cy="12" r="1.5" fill={color} />
            <circle cx="12" cy="18" r="1.5" fill={color} />
        </svg>
    );
}

// Chance icon: a big solid circle in the center
export function ChanceIcon({ size = 24, color = 'black', className = '' }) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={color}
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="24" height="24" fill="white" stroke={color} strokeWidth="1.5" rx="4" ry="4" />
            <text
                x="12"
                y="18"
                textAnchor="middle"
                fontSize="16"
                fill={color}
                fontWeight="normal"
                fontFamily="Arial, sans-serif"
                pointerEvents="none"
            >
                ?
            </text>
        </svg>
    );
}

export const iconLibrary = {
    ones: OnesIcon,
    twos: TwosIcon,
    threes: ThreesIcon,
    fours: FoursIcon,
    fives: FivesIcon,
    sixes: SixesIcon,
    twoPair: TwoPairIcon,
    threeKind: ThreeKindIcon,
    fourKind: FourKindIcon,
    fullHouse: FullHouseIcon,
    smallStraight: SmallStraightIcon,
    largeStraight: LargeStraightIcon,
    yahtzee: YahtzeeIcon,
    chance: ChanceIcon,
};
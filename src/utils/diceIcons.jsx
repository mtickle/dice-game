export const diceSvgs = {
    1: (
        <svg width="24" height="24" viewBox="0 0 100 100" className="inline-block mr-1">
            <rect x="5" y="5" width="90" height="90" fill="#fff" stroke="#000" strokeWidth="5" />
            <circle cx="50" cy="50" r="10" fill="#000" />
        </svg>
    ),
    2: (
        <svg width="24" height="24" viewBox="0 0 100 100" className="inline-block mr-1">
            <rect x="5" y="5" width="90" height="90" fill="#fff" stroke="#000" strokeWidth="5" />
            <circle cx="30" cy="30" r="10" fill="#000" />
            <circle cx="70" cy="70" r="10" fill="#000" />
        </svg>
    ),
    3: (
        <svg width="24" height="24" viewBox="0 0 100 100" className="inline-block mr-1">
            <rect x="5" y="5" width="90" height="90" fill="#fff" stroke="#000" strokeWidth="5" />
            <circle cx="30" cy="30" r="10" fill="#000" />
            <circle cx="50" cy="50" r="10" fill="#000" />
            <circle cx="70" cy="70" r="10" fill="#000" />
        </svg>
    ),
    4: (
        <svg width="24" height="24" viewBox="0 0 100 100" className="inline-block mr-1">
            <rect x="5" y="5" width="90" height="90" fill="#fff" stroke="#000" strokeWidth="5" />
            <circle cx="30" cy="30" r="10" fill="#000" />
            <circle cx="70" cy="30" r="10" fill="#000" />
            <circle cx="30" cy="70" r="10" fill="#000" />
            <circle cx="70" cy="70" r="10" fill="#000" />
        </svg>
    ),
    5: (
        <svg width="24" height="24" viewBox="0 0 100 100" className="inline-block mr-1">
            <rect x="5" y="5" width="90" height="90" fill="#fff" stroke="#000" strokeWidth="5" />
            <circle cx="30" cy="30" r="10" fill="#000" />
            <circle cx="70" cy="30" r="10" fill="#000" />
            <circle cx="50" cy="50" r="10" fill="#000" />
            <circle cx="30" cy="70" r="10" fill="#000" />
            <circle cx="70" cy="70" r="10" fill="#000" />
        </svg>
    ),
    6: (
        <svg width="24" height="24" viewBox="0 0 100 100" className="inline-block mr-1">
            <rect x="5" y="5" width="90" height="90" fill="#fff" stroke="#000" strokeWidth="5" />
            <circle cx="30" cy="25" r="10" fill="#000" />
            <circle cx="70" cy="25" r="10" fill="#000" />
            <circle cx="30" cy="50" r="10" fill="#000" />
            <circle cx="70" cy="50" r="10" fill="#000" />
            <circle cx="30" cy="75" r="10" fill="#000" />
            <circle cx="70" cy="75" r="10" fill="#000" />
        </svg>
    ),
};


export const getDiceSvg = (value, bgColor = '#fff') => {
    const dot = (cx, cy) => <circle cx={cx} cy={cy} r="10" fill="#000" />;
    const base = (
        <rect x="5" y="5" width="90" height="90" fill={bgColor} stroke="#000" strokeWidth="5" />
    );

    switch (value) {
        case 1:
            return (
                <svg width="24" height="24" viewBox="0 0 100 100" className="inline-block mr-1">
                    {base}
                    {dot(50, 50)}
                </svg>
            );
        case 2:
            return (
                <svg width="24" height="24" viewBox="0 0 100 100" className="inline-block mr-1">
                    {base}
                    {dot(30, 30)}
                    {dot(70, 70)}
                </svg>
            );
        case 3:
            return (
                <svg width="24" height="24" viewBox="0 0 100 100" className="inline-block mr-1">
                    {base}
                    {dot(30, 30)}
                    {dot(50, 50)}
                    {dot(70, 70)}
                </svg>
            );
        case 4:
            return (
                <svg width="24" height="24" viewBox="0 0 100 100" className="inline-block mr-1">
                    {base}
                    {dot(30, 30)}
                    {dot(70, 30)}
                    {dot(30, 70)}
                    {dot(70, 70)}
                </svg>
            );
        case 5:
            return (
                <svg width="24" height="24" viewBox="0 0 100 100" className="inline-block mr-1">
                    {base}
                    {dot(30, 30)}
                    {dot(70, 30)}
                    {dot(50, 50)}
                    {dot(30, 70)}
                    {dot(70, 70)}
                </svg>
            );
        case 6:
            return (
                <svg width="24" height="24" viewBox="0 0 100 100" className="inline-block mr-1">
                    {base}
                    {dot(30, 25)}
                    {dot(70, 25)}
                    {dot(30, 50)}
                    {dot(70, 50)}
                    {dot(30, 75)}
                    {dot(70, 75)}
                </svg>
            );
        default:
            return null;
    }
};

import { useEffect, useRef, useState } from 'react';

export function useScoreAnimation(value, duration = 250) {
    const [animating, setAnimating] = useState(false);
    const prevValue = useRef(value);

    useEffect(() => {
        if (prevValue.current !== value) {
            setAnimating(true);
            const timeout = setTimeout(() => setAnimating(false), duration);
            prevValue.current = value;
            return () => clearTimeout(timeout);
        }
    }, [value, duration]);

    return animating;
}

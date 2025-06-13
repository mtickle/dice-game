export default function DiceFace({ value, held }) {
    const pip = (position) => (
        <div className={`w-3 h-3 bg-black rounded-full ${position}`} />
    );

    const pipLayout = {
        1: [pip('')],
        2: [pip('self-start self-start'), pip('self-end self-end')],
        3: [pip('self-start self-start'), pip(''), pip('self-end self-end')],
        4: [pip('self-start self-start'), pip('self-start self-end'), pip('self-end self-start'), pip('self-end self-end')],
        5: [pip('self-start self-start'), pip('self-start self-end'), pip('self-end self-start'), pip('self-end self-end'), pip('')],
        6: [pip('self-start self-start'), pip('self-start self-end'), pip('self-center self-start'), pip('self-center self-end'), pip('self-end self-start'), pip('self-end self-end')],
    };

    const pipGrid = {
        1: (
            <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
                <div />
                <div className="flex justify-center items-center">{pip('')}</div>
                <div />
            </div>
        ),
        2: (
            <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
                <div className="flex justify-center items-center">{pip('')}</div>
                <div />
                <div />
                <div />
                <div />
                <div className="flex justify-center items-center">{pip('')}</div>
            </div>
        ),
        3: (
            <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
                <div className="flex justify-center items-center">{pip('')}</div>
                <div />
                <div />
                <div />
                <div className="flex justify-center items-center">{pip('')}</div>
                <div />
                <div />
                <div />
                <div className="flex justify-center items-center">{pip('')}</div>
            </div>
        ),
        4: (
            <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
                <div className="flex justify-center items-center">{pip('')}</div>
                <div />
                <div className="flex justify-center items-center">{pip('')}</div>
                <div />
                <div />
                <div />
                <div className="flex justify-center items-center">{pip('')}</div>
                <div />
                <div className="flex justify-center items-center">{pip('')}</div>
            </div>
        ),
        5: (
            <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
                <div className="flex justify-center items-center">{pip('')}</div>
                <div />
                <div className="flex justify-center items-center">{pip('')}</div>
                <div />
                <div className="flex justify-center items-center">{pip('')}</div>
                <div />
                <div className="flex justify-center items-center">{pip('')}</div>
                <div />
                <div className="flex justify-center items-center">{pip('')}</div>
            </div>
        ),
        6: (
            <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
                <div className="flex justify-center items-center">{pip('')}</div>
                <div className="flex justify-center items-center">{pip('')}</div>
                <div className="flex justify-center items-center">{pip('')}</div>
                <div className="flex justify-center items-center">{pip('')}</div>
                <div className="flex justify-center items-center">{pip('')}</div>
                <div className="flex justify-center items-center">{pip('')}</div>
                <div className="flex justify-center items-center">{pip('')}</div>
                <div className="flex justify-center items-center">{pip('')}</div>
                <div className="flex justify-center items-center">{pip('')}</div>
            </div>
        ),
    };

    return (
        <div
            className={`w-16 h-16 border-4 border-black rounded-lg bg-white flex justify-center items-center relative ${held ? 'bg-yellow-300' : ''
                }`}
        >
            {value ? pipGrid[value] : ''}
        </div>
    );
}

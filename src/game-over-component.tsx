import React, { useCallback } from "react";

export interface Props {
    tryAgain: () => void;
}

export const GameOverComponent = (props: Props) => {

    const doClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        props.tryAgain();
    }, []);

    return (
        <div className="gameover">
            <span>Game Over!</span>
            <button onClick={doClick}>Try Again</button>
        </div>
    );
}
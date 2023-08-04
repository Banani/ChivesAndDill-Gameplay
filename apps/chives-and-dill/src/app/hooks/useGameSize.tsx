import { useCallback, useEffect, useState } from "react";

export const useGameSize = () => {
    const [gameSize, setGameSize] = useState({ width: 0, height: 0 });

    const resizeGame = useCallback(() => {
        let gameWidth = window.innerWidth;
        let gameHeight = window.innerHeight;
        const ratio = 16 / 9;

        if (gameHeight < gameWidth / ratio) {
            gameWidth = gameHeight * ratio;
        } else {
            gameHeight = gameWidth / ratio;
        }

        setGameSize({ width: gameWidth, height: gameHeight });
    }, []);

    useEffect(() => {
        resizeGame();
        window.addEventListener('resize', resizeGame);

        return () => {
            window.removeEventListener('resize', resizeGame);
        };
    }, []);

    return { gameSize };
}
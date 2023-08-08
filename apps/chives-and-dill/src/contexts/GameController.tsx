import { CharacterClientActions, GlobalStoreModule, Location, PlayerClientActions } from '@bananos/types';
import _ from 'lodash';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useEngineModuleReader } from '../hooks';
import { EngineContext } from './EngineApiContext';
import { KeyBoardContext } from './KeyBoardContext';

const keyMovementMap = {
    w: { y: -1 },
    a: { x: -1 },
    s: { y: 1 },
    d: { x: 1 },
};

interface GameController {
    activeTargetId: string,
    setActiveTarget: (targetId: string) => void,
    mousePosition: Location,
    activeCharacterId: string;
}

export const GameControllerContext = React.createContext<GameController>(null);

export const GameController = ({ children }) => {
    const { activeCharacterId } = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER).data;
    const { data: characterMovements } = useEngineModuleReader(GlobalStoreModule.CHARACTER_MOVEMENTS);
    const { data: availableSpells } = useEngineModuleReader(GlobalStoreModule.AVAILABLE_SPELLS);

    const keyBoardContext = useContext(KeyBoardContext);
    const { callEngineAction } = useContext(EngineContext);

    const [activeTargetId, setActiveTargetId] = useState<string | null>(null)
    const [mousePosition, setMousePosition] = useState({ x: null, y: null });

    let gameWidth = window.innerWidth;
    let gameHeight = window.innerHeight;
    const ratio = 16 / 9;

    if (gameHeight < gameWidth / ratio) {
        gameWidth = gameHeight * ratio;
    } else {
        gameHeight = gameWidth / ratio;
    }

    useEffect(() => {
        keyBoardContext.addKeyHandler({
            id: 'gameControllerWASD',
            matchRegex: '[wasd]',
            keydown: (key) => callEngineAction({ type: CharacterClientActions.PlayerStartMove, source: key, ...keyMovementMap[key] }),
            keyup: (key) => callEngineAction({ type: CharacterClientActions.PlayerStopMove, source: key }),
        });

        return () => {
            keyBoardContext.removeKeyHandler('ConfirmationDialogEnter');
        };
    }, [callEngineAction]);

    const keyPressHandler = (event) => {
        const key = event.key.toLowerCase();

        const keyBinds = {};
        let i = 1;
        for (let spellId in availableSpells) {
            keyBinds[i++] = spellId;
        }

        if (keyBinds[key]) {
            callEngineAction({
                type: PlayerClientActions.CastSpell,
                targetId: activeTargetId,
                directionLocation: {
                    x: characterMovements[activeCharacterId].location.x + mousePosition.x - gameWidth / 2,
                    y: characterMovements[activeCharacterId].location.y + mousePosition.y - gameHeight / 2,
                },
                spellId: keyBinds[key],
            });
        }
    };

    const updateMousePosition = useMemo(() => _.throttle((e: MouseEvent) => {
        setMousePosition({ x: e.offsetX, y: e.offsetY });
    }, 100), []);

    useEffect(() => {
        window.addEventListener('mousemove', updateMousePosition);

        return () => window.removeEventListener('mousemove', updateMousePosition);
    }, []);

    return (
        <GameControllerContext.Provider value={{ mousePosition, activeTargetId, setActiveTarget: setActiveTargetId, activeCharacterId }}>
            <div onKeyDown={(event) => keyPressHandler(event)} tabIndex={0}>
                {children}
            </div>
        </GameControllerContext.Provider>
    );
};
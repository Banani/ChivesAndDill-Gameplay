import { GlobalStoreModule } from '@bananos/types';
import React, { useContext, useEffect } from 'react';
import { ModalsManagerContextProvider } from '../contexts/ModalsManagerContext';
import { useEngineModuleReader } from '../hooks/useEngineModuleReader';
import { GameUserInterface } from './GameUserInterface';
import { ViewPort } from './ViewPort';
import { GameControllerContext } from './gameController/gameController';
import { ClassesModal } from './guiContent/classesModal/classesModal';

export interface GameApi {
    setActiveTarget: (characterId: string) => void;
}

export function Game() {
    const activeCharacterId = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER)?.data?.activeCharacterId;
    const { setActiveTarget } = useContext(GameControllerContext);

    useEffect(() => {
        const gameApi: GameApi = {
            setActiveTarget: (characterId: string) => setActiveTarget(characterId)
        };
        (window as any).gameApi = gameApi;
    }, []);

    return (
        <>
            {!activeCharacterId && <ClassesModal />}
            {activeCharacterId && (
                <ModalsManagerContextProvider>
                    <GameUserInterface />
                    <ViewPort />
                </ModalsManagerContextProvider>
            )}
        </>
    );
}

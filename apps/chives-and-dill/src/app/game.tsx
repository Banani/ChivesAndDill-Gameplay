import { GlobalStoreModule } from '@bananos/types';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ModalsManagerContextProvider } from '../contexts/ModalsManagerContext';
import { useEngineModuleReader } from '../hooks/useEngineModuleReader';
import { setActiveTarget } from '../stores';
import { GameUserInterface } from './GameUserInterface';
import { ViewPort } from './ViewPort';
import GameController from './gameController/gameController';
import { ClassesModal } from './guiContent/classesModal/classesModal';

export interface GameApi {
    setActiveTarget: (characterId: string) => void;
}

export function Game() {
    const activeCharacterId = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER)?.data?.activeCharacterId;
    const dispatch = useDispatch();

    useEffect(() => {
        const gameApi: GameApi = {
            setActiveTarget: (characterId: string) => dispatch(setActiveTarget({ characterId: characterId }))
        };
        (window as any).gameApi = gameApi;
    }, []);

    return (
        <>
            {!activeCharacterId && <ClassesModal />}
            {activeCharacterId && (
                <ModalsManagerContextProvider>
                    <GameController>
                        <GameUserInterface />
                        <ViewPort />
                    </GameController>
                </ModalsManagerContextProvider>
            )}
        </>
    );
}

import { GlobalStoreModule } from '@bananos/types';
import React from 'react';
import { ModalsManagerContextProvider } from '../contexts/ModalsManagerContext';
import { useEngineModuleReader } from '../hooks/useEngineModuleReader';
import { GameUserInterface } from './GameUserInterface';
import { ViewPort } from './ViewPort';
import GameController from './gameController/gameController';
import { ClassesModal } from './guiContent/classesModal/classesModal';

export function Game() {
    const activeCharacterId = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER)?.data?.activeCharacterId;

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

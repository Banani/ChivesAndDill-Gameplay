import { GlobalStoreModule, NpcClientActions, PlayerClientActions } from '@bananos/types';
import React, { useContext, useEffect } from 'react';
import { EngineContext } from '../contexts/EngineApiContext';
import { GameControllerContext } from '../contexts/GameController';
import { ModalsManagerContextProvider } from '../contexts/ModalsManagerContext';
import { useEngineModuleReader } from '../hooks/useEngineModuleReader';
import { GameUserInterface } from './GameUserInterface';
import { ViewPort } from './ViewPort';
import { ClassesModal } from './guiContent/classesModal/classesModal';

export interface GameApi {
    setActiveTarget: (characterId: string) => void;
    openNpcDialog: (npcId: string) => void;
    openLootModal: (corpseId: string) => void;
}

export function Game() {
    const activeCharacterId = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER)?.data?.activeCharacterId;
    const { setActiveTarget } = useContext(GameControllerContext);
    const { callEngineAction } = useContext(EngineContext);

    useEffect(() => {
        const gameApi: GameApi = {
            setActiveTarget: (characterId: string) => setActiveTarget(characterId),
            openNpcDialog: (npcId: string) => callEngineAction({
                type: NpcClientActions.OpenNpcConversationDialog,
                npcId
            }),
            openLootModal: (corpseId: string) => callEngineAction({
                type: PlayerClientActions.OpenLoot,
                corpseId,
            })
        };
        (window as any).gameApi = gameApi;
    }, [callEngineAction]);

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

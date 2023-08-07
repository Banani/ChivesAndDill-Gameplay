import { GlobalStoreModule, NpcClientActions } from '@bananos/types';
import React, { useContext, useEffect } from 'react';
import { GameControllerContext } from '../contexts/GameController';
import { ModalsManagerContextProvider } from '../contexts/ModalsManagerContext';
import { SocketContext } from '../contexts/SocketCommunicator';
import { useEngineModuleReader } from '../hooks/useEngineModuleReader';
import { GameUserInterface } from './GameUserInterface';
import { ViewPort } from './ViewPort';
import { ClassesModal } from './guiContent/classesModal/classesModal';

export interface GameApi {
    setActiveTarget: (characterId: string) => void;
    openNpcDialog: (npcId: string) => void;
}

export function Game() {
    const activeCharacterId = useEngineModuleReader(GlobalStoreModule.ACTIVE_CHARACTER)?.data?.activeCharacterId;
    const { setActiveTarget } = useContext(GameControllerContext);
    const { socket } = useContext(SocketContext);

    useEffect(() => {
        const gameApi: GameApi = {
            setActiveTarget: (characterId: string) => setActiveTarget(characterId),
            openNpcDialog: (npcId: string) => socket?.emit(NpcClientActions.OpenNpcConversationDialog, { npcId })
        };
        (window as any).gameApi = gameApi;
    }, [socket]);

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

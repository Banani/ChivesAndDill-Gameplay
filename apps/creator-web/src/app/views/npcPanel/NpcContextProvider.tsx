import React, { useCallback, useContext, useState } from 'react';
import { ACTIONS } from '../../actions';
import { SocketContext } from '../../contexts';

export const NpcContext = React.createContext<NpcContextProps>({} as NpcContextProps);

export enum NpcActionsList {
    Adding = 'Adding',
    Translate = 'Translate',
    Delete = 'Delete',
}

export interface NpcTemplate {
    id: string;
    name: string;
    healthPoints: number;
    healthPointsRegeneration: number;
    spellPower: number;
    spellPowerRegeneration: number;
    movementSpeed: number;
    stock: Record<string, boolean>;
    quests: Record<string, boolean>;
}

interface NpcContextProps {
    createNpcTemplate: (npcTemplate: NpcTemplate) => void;
    activeNpcTemplate: NpcTemplate;
    addNpc: (val: { npcTemplateId: string; x: number; y: number }) => void;
    setActiveNpcTemplate: React.Dispatch<React.SetStateAction<NpcTemplate>>;
    deleteNpc: (npcId: string) => void;
    currentNpcAction: NpcActionsList;
    setCurrentNpcAction: any;
}

export const NpcContextProvider = ({ children }: any) => {
    const { socket } = useContext(SocketContext);
    const [activeNpcTemplate, setActiveNpcTemplate] = useState<NpcTemplate>({} as NpcTemplate);
    const [currentNpcAction, setCurrentNpcAction] = useState(NpcActionsList.Adding);

    const createNpcTemplate = useCallback(
        (npcTemplate: NpcTemplate) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.CREATE_NPC_TEMPLATE, npcTemplate }));
        },
        [socket]
    );

    const addNpc = useCallback(
        ({ npcTemplateId, x, y }) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.ADD_NPC, npcTemplateId, x, y }));
        },
        [socket]
    );
    const deleteNpc = useCallback(
        (npcId) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.DELETE_NPC, npcId }));
        },
        [socket]
    );

    return (
        <NpcContext.Provider
            value={{
                activeNpcTemplate,
                setActiveNpcTemplate,
                addNpc,
                currentNpcAction,
                setCurrentNpcAction,
                createNpcTemplate,
                deleteNpc,
            }}
        >
            {children}
        </NpcContext.Provider>
    );
};

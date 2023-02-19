import { QuotesEvents } from '@bananos/types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ACTIONS } from '../../actions';
import { PackageContext, SocketContext } from '../../contexts';

export const NpcContext = React.createContext<NpcContextProps>({} as NpcContextProps);

export enum NpcActionsList {
    Adding = 'Adding',
    Translate = 'Translate',
    Delete = 'Delete',
}

// JUZ TAKI JEST W engine, Ale dziala na referenecjach a nie template id, trzbea zmienic
export interface CharacterRespawn {
    location: Location;
    time: number;
    id: string;
    walkingType: string;
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
    npcRespawns: CharacterRespawn[];
    quotesEvents?: QuotesEvents;
}

interface NpcContextProps {
    createNpcTemplate: (npcTemplate: NpcTemplate) => void;
    updateNpcTemplate: (npcTemplate: NpcTemplate) => void;
    deleteNpcTemplate: (npcTemplateId: string) => void;
    activeNpcTemplate: NpcTemplate | null;
    addNpc: (val: { npcTemplateId: string; x: number; y: number }) => void;
    setActiveNpcTemplate: React.Dispatch<React.SetStateAction<NpcTemplate | null>>;
    deleteNpc: (npcId: string) => void;
    currentNpcAction: NpcActionsList;
    setCurrentNpcAction: any;
    highlightedNpcId: string | null;
    setHighlightedNpcId: (id: string | null) => void;
}

export const NpcContextProvider = ({ children }: any) => {
    const { socket } = useContext(SocketContext);
    const packageContext = useContext(PackageContext);
    const [activeNpcTemplate, setActiveNpcTemplate] = useState<NpcTemplate | null>(null);
    const [currentNpcAction, setCurrentNpcAction] = useState(NpcActionsList.Adding);
    const [highlightedNpcId, setHighlightedNpcId] = useState<string | null>(null);

    const npcs = packageContext.backendStore.npcs?.data ?? {};
    const npcTemplates = packageContext?.backendStore?.npcTemplates?.data ?? {};

    useEffect(() => {
        if (highlightedNpcId && !npcs[highlightedNpcId]) {
            setHighlightedNpcId(null);
        }
    }, [highlightedNpcId, npcs]);

    useEffect(() => {
        if (activeNpcTemplate && activeNpcTemplate.id && !npcTemplates[activeNpcTemplate.id]) {
            setActiveNpcTemplate(null);
        }
    }, [activeNpcTemplate, npcs]);

    const createNpcTemplate = useCallback(
        (npcTemplate: NpcTemplate) => {
            console.log(npcTemplate);
            socket.send(JSON.stringify({ actionType: ACTIONS.CREATE_NPC_TEMPLATE, npcTemplate }));
        },
        [socket]
    );

    const updateNpcTemplate = useCallback(
        (npcTemplate: NpcTemplate) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.UPDATE_NPC_TEMPLATE, npcTemplate }));
        },
        [socket]
    );

    const deleteNpcTemplate = useCallback(
        (npcTemplateId: string) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.DELETE_NPC_TEMPLATE, npcTemplateId }));
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
                updateNpcTemplate,
                deleteNpcTemplate,
                deleteNpc,
                highlightedNpcId,
                setHighlightedNpcId
            }}
        >
            {children}
        </NpcContext.Provider>
    );
};

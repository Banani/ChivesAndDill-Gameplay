import { QuotesEvents } from '@bananos/types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ACTIONS } from '../../actions';
import { PackageContext, SocketContext } from '../../contexts';

export const CharacterContext = React.createContext<CharacterContextProps>({} as CharacterContextProps);

export enum CharacterActionsList {
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

// TODO: zmienic to
export interface CharacterTemplate {
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

interface CharacterContextProps {
    createCharacterTemplate: (characterTemplate: CharacterTemplate) => void;
    updateCharacterTemplate: (characterTemplate: CharacterTemplate) => void;
    deleteCharacterTemplate: (characterTemplateId: string) => void;
    activeCharacterTemplate: any | null;
    addCharacter: (val: { characterTemplateId: string; x: number; y: number }) => void;
    setActiveCharacterTemplate: React.Dispatch<React.SetStateAction<any | null>>;
    setActiveCharacterTemplateById: (id: string) => void;
    deleteCharacter: (characterId: string) => void;
    updateCharacter: (character: any) => void;
    currentCharacterAction: CharacterActionsList;
    setCurrentCharacterAction: any;
    highlightedCharacterId: string | null;
    setHighlightedCharacterId: (id: string | null) => void;
}

export const CharacterContextProvider = ({ children }: any) => {
    const { socket } = useContext(SocketContext);
    const packageContext = useContext(PackageContext);
    const [activeCharacterTemplate, setActiveCharacterTemplate] = useState<any | null>(null);
    const [currentCharacterAction, setCurrentCharacterAction] = useState(CharacterActionsList.Adding);
    const [highlightedCharacterId, setHighlightedCharacterId] = useState<string | null>(null);

    const characters = packageContext.backendStore.monsters?.data ?? {};
    const characterTemplates = packageContext?.backendStore?.monsterTemplates?.data ?? {};

    useEffect(() => {
        if (highlightedCharacterId && !characters[highlightedCharacterId]) {
            setHighlightedCharacterId(null);
        }
    }, [highlightedCharacterId, characters]);

    useEffect(() => {
        if (activeCharacterTemplate && activeCharacterTemplate.id && !characterTemplates[activeCharacterTemplate.id]) {
            setActiveCharacterTemplate(null);
        }
    }, [activeCharacterTemplate, characters]);

    const setActiveCharacterTemplateById = useCallback((id: string) => {
        setActiveCharacterTemplate(characterTemplates[id]);
    }, [characterTemplates]);

    const createCharacterTemplate = useCallback(
        (characterTemplate: any) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.CREATE_MONSTER_TEMPLATE, characterTemplate }));
        },
        [socket]
    );

    const updateCharacterTemplate = useCallback(
        (characterTemplate: any) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.UPDATE_MONSTER_TEMPLATE, characterTemplate }));
        },
        [socket]
    );

    const deleteCharacterTemplate = useCallback(
        (characterTemplateId: string) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.DELETE_MONSTER_TEMPLATE, characterTemplateId }));
        },
        [socket]
    );

    const addCharacter = useCallback(
        ({ characterTemplateId, x, y }) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.ADD_MONSTER, characterTemplateId, x, y }));
        },
        [socket]
    );

    const deleteCharacter = useCallback(
        (characterId: string) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.DELETE_MONSTER, characterId }));
        },
        [socket]
    );

    const updateCharacter = useCallback(
        (character: any) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.UPDATE_MONSTER, character }));
        },
        [socket]
    );

    return (
        <CharacterContext.Provider
            value={{
                activeCharacterTemplate,
                setActiveCharacterTemplate,
                addCharacter,
                currentCharacterAction,
                setCurrentCharacterAction,
                setActiveCharacterTemplateById,
                createCharacterTemplate,
                updateCharacterTemplate,
                deleteCharacterTemplate,
                deleteCharacter,
                updateCharacter,
                highlightedCharacterId,
                setHighlightedCharacterId
            }}
        >
            {children}
        </CharacterContext.Provider>
    );
};

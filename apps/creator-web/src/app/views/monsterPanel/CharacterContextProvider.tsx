import { QuotesEvents } from '@bananos/types';
import React, { FunctionComponent, useCallback, useContext, useEffect, useState } from 'react';
import { CharacterTemplateActions } from '../../actions';
import { SocketContext } from '../../contexts';

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

interface CharacterContextProviderProps {
    characters: Record<string, any>,
    characterTemplates: Record<string, any>,
    characterTemplateActions: CharacterTemplateActions
}

export const CharacterContextProvider: FunctionComponent<CharacterContextProviderProps> = ({ children, characters, characterTemplates, characterTemplateActions }) => {
    const { socket } = useContext(SocketContext);
    const [activeCharacterTemplate, setActiveCharacterTemplate] = useState<any | null>(null);
    const [currentCharacterAction, setCurrentCharacterAction] = useState(CharacterActionsList.Adding);
    const [highlightedCharacterId, setHighlightedCharacterId] = useState<string | null>(null);

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
            socket.send(JSON.stringify({ actionType: characterTemplateActions.CREATE_CHARACTER_TEMPLATE, characterTemplate }));
        },
        [socket]
    );

    const updateCharacterTemplate = useCallback(
        (characterTemplate: any) => {
            socket.send(JSON.stringify({ actionType: characterTemplateActions.UPDATE_CHARACTER_TEMPLATE, characterTemplate }));
        },
        [socket]
    );

    const deleteCharacterTemplate = useCallback(
        (characterTemplateId: string) => {
            socket.send(JSON.stringify({ actionType: characterTemplateActions.DELETE_CHARACTER_TEMPLATE, characterTemplateId }));
        },
        [socket]
    );

    const addCharacter = useCallback(
        ({ characterTemplateId, x, y }) => {
            socket.send(JSON.stringify({ actionType: characterTemplateActions.ADD_CHARACTER, characterTemplateId, x, y }));
        },
        [socket]
    );

    const deleteCharacter = useCallback(
        (characterId: string) => {
            socket.send(JSON.stringify({ actionType: characterTemplateActions.DELETE_CHARACTER, characterId }));
        },
        [socket]
    );

    const updateCharacter = useCallback(
        (character: any) => {
            socket.send(JSON.stringify({ actionType: characterTemplateActions.UPDATE_CHARACTER, character }));
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

import { CharacterClass } from '@bananos/types';
import React, { useCallback, useContext, useState } from 'react';
import { ACTIONS } from '../../actions';
import { SocketContext } from '../../contexts';

export const CharacterClassesContext = React.createContext<CharacterClassesContextProps>({} as CharacterClassesContextProps);

interface CharacterClassesContextProps {
    activeCharacterClass: CharacterClass | null;
    setActiveCharacterClass: React.Dispatch<React.SetStateAction<CharacterClass | null>>;
    createCharacterClass: (characterClass: CharacterClass) => void;
    updateCharacterClass: (characterClass: CharacterClass) => void;
    deleteCharacterClass: (characterClassId: string) => void;
}

export const CharacterClassesContextProvider = ({ children }: any) => {
    const { socket } = useContext(SocketContext);
    const [activeCharacterClass, setActiveCharacterClass] = useState<CharacterClass | null>(null);

    const createCharacterClass = useCallback(
        (characterClass: CharacterClass) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.CREATE_CHARACTER_CLASS, characterClass }));
        },
        [socket]
    );

    const updateCharacterClass = useCallback(
        (characterClass: CharacterClass) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.UPDATE_CHARACTER_CLASS, characterClass }));
        },
        [socket]
    );

    const deleteCharacterClass = useCallback(
        (characterClassId: string) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.DELETE_CHARACTER_CLASS, characterClassId }));
        },
        [socket]
    );

    return <CharacterClassesContext.Provider
        value={{
            activeCharacterClass,
            setActiveCharacterClass,
            createCharacterClass,
            deleteCharacterClass,
            updateCharacterClass
        }}>
        {children}
    </CharacterClassesContext.Provider>;
};

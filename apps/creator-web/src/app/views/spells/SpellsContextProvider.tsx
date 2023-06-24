import { Spell } from '@bananos/types';
import React, { useCallback, useContext, useState } from 'react';
import { ACTIONS } from '../../actions';
import { SocketContext } from '../../contexts';

export const SpellsContext = React.createContext<SpellsContextProps>({} as SpellsContextProps);

interface SpellsContextProps {
    activeSpell: Spell | null;
    setActiveSpell: React.Dispatch<React.SetStateAction<Spell | null>>;
    createSpell: (spell: Spell) => void;
    updateSpell: (spell: Spell) => void;
    deleteSpell: (id: string) => void;
}

export const SpellsContextProvider = ({ children }: any) => {
    const { socket } = useContext(SocketContext);
    const [activeSpell, setActiveSpell] = useState<Spell | null>(null);

    const createSpell = useCallback(
        (spell: Spell) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.CREATE_SPELL, spell }));
        },
        [socket]
    );

    const updateSpell = useCallback(
        (spell: Spell) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.UPDATE_SPELL, spell }));
        },
        [socket]
    );

    const deleteSpell = useCallback(
        (spellId: string) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.DELETE_SPELL, spellId }));
        },
        [socket]
    );

    return <SpellsContext.Provider value={{ activeSpell, setActiveSpell, createSpell, deleteSpell, updateSpell }}>{children}</SpellsContext.Provider>;
};

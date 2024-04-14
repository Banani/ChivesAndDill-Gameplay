import React, { useContext, useEffect, useState } from 'react';
import { KeyBoardContext } from './KeyBoardContext';

export enum GlobalModal {
    ChatChannelModal = 'ChatChannelModal',
    Backpack = "Backpack",
    Equipment = "Equipment",
    QuestLog = "QuestLog"
}

interface ModalsManagerContextMethods {
    activeGlobalModal: GlobalModal;
    setActiveGlobalModal: (modal: GlobalModal) => void;
}

export const ModalsManagerContext = React.createContext<ModalsManagerContextMethods>(null);

export const ModalsManagerContextProvider = ({ children }) => {
    const [activeGlobalModal, setActiveGlobalModal] = useState<GlobalModal>(null);
    const keyBoardContext = useContext(KeyBoardContext);

    useEffect(() => {
        keyBoardContext.addKeyHandler({
            id: 'ModalsManagerEscape',
            matchRegex: 'Escape',
            keydown: () => setActiveGlobalModal(null),
        });
        keyBoardContext.addKeyHandler({
            id: 'ModalsManagerO',
            matchRegex: 'o',
            keydown: () => setActiveGlobalModal(prev => prev === GlobalModal.ChatChannelModal ? null : GlobalModal.ChatChannelModal),
        });
        keyBoardContext.addKeyHandler({
            id: 'ModalsManagerB',
            matchRegex: 'b',
            keydown: () => setActiveGlobalModal(prev => prev === GlobalModal.Backpack ? null : GlobalModal.Backpack),
        });
        keyBoardContext.addKeyHandler({
            id: 'ModalsManagerC',
            matchRegex: 'c',
            keydown: () => setActiveGlobalModal(prev => prev === GlobalModal.Equipment ? null : GlobalModal.Equipment),
        });
        keyBoardContext.addKeyHandler({
            id: 'ModalsManagerL',
            matchRegex: 'l',
            keydown: () => setActiveGlobalModal(prev => prev === GlobalModal.QuestLog ? null : GlobalModal.QuestLog),
        });

        return () => {
            keyBoardContext.removeKeyHandler('ModalsManagerEscape');
            keyBoardContext.removeKeyHandler('ModalsManagerO');
            keyBoardContext.removeKeyHandler('ModalsManagerB');
            keyBoardContext.removeKeyHandler('ModalsManagerC');
            keyBoardContext.removeKeyHandler('ModalsManagerL');
        }
    }, []);

    return (
        <ModalsManagerContext.Provider
            value={{
                activeGlobalModal,
                setActiveGlobalModal,
            }}
        >
            {children}
        </ModalsManagerContext.Provider>
    );
};

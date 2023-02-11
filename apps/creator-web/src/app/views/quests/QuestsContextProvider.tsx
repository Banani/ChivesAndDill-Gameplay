import { QuestSchema } from '@bananos/types';
import React, { useCallback, useContext, useState } from 'react';
import { ACTIONS } from '../../actions';
import { SocketContext } from '../../contexts';

export const QuestsContext = React.createContext<QuestsContextProps>({} as QuestsContextProps);

interface QuestsContextProps {
    activeQuest: QuestSchema | null;
    setActiveQuest: React.Dispatch<React.SetStateAction<QuestSchema | null>>;
    createQuest: (questSchema: QuestSchema) => void;
    deleteQuest: (id: string) => void;
}

export const QuestsContextProvider = ({ children }: any) => {
    const { socket } = useContext(SocketContext);
    const [activeQuest, setActiveQuest] = useState<QuestSchema | null>(null);

    const createQuest = useCallback(
        (questSchema: QuestSchema) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.CREATE_QUEST, questSchema }));
        },
        [socket]
    );
    const deleteQuest = useCallback(
        (questId: string) => {
            socket.send(JSON.stringify({ actionType: ACTIONS.DELETE_QUEST, questId }));
        },
        [socket]
    );

    return <QuestsContext.Provider value={{ activeQuest, setActiveQuest, createQuest, deleteQuest }}>{children}</QuestsContext.Provider>;
};

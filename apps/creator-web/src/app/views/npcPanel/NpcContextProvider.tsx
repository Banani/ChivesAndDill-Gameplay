import React, { useCallback, useContext, useState } from 'react';
import { ACTIONS } from '../../actions';
import { SocketContext } from '../../contexts';
import { NpcTemplate } from '../../dialogs';

export const NpcContext = React.createContext<NpcContextProps>({} as NpcContextProps);

export enum NpcActionsList {
   Translate = 'Translate',
}

interface NpcContextProps {
   createNpcTemplate: (npcTemplate: NpcTemplate) => void;
   activeNpcTemplate: any;
   setActiveNpcTemplate: (npcTemplateId: string) => void;
   currentNpcAction: NpcActionsList;
   setCurrentNpcAction: any;
}

export const NpcContextProvider = ({ children }: any) => {
   const { socket } = useContext(SocketContext);
   const [activeNpcTemplate, setActiveNpcTemplate] = useState('');
   const [currentNpcAction, setCurrentNpcAction] = useState(NpcActionsList.Translate);

   const createNpcTemplate = useCallback(
      (npcTemplate: NpcTemplate) => {
         socket.send(JSON.stringify({ actionType: ACTIONS.CREATE_NPC_TEMPLATE, npcTemplate }));
      },
      [socket]
   );

   return (
      <NpcContext.Provider
         value={{
            activeNpcTemplate,
            setActiveNpcTemplate,
            currentNpcAction,
            setCurrentNpcAction,
            createNpcTemplate,
         }}
      >
         {children}
      </NpcContext.Provider>
   );
};

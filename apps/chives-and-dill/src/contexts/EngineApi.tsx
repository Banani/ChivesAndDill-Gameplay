import { ItemClientMessages, NpcClientMessages } from '@bananos/types';
import React, { useContext } from 'react';
import { SocketContext } from '../app/gameController/socketContext';

interface EngineApiMethods {
   requestItemTemplates: (itemTemplateIds: string[]) => void;
   takeQuestFromNpc: ({ npcId, questId }) => void;
}

export const EngineApiContext = React.createContext<EngineApiMethods>(null);

export const EngineApi = ({ children }) => {
   const context = useContext(SocketContext);
   const { socket } = context;

   return (
      <EngineApiContext.Provider
         value={{
            requestItemTemplates: (itemTemplateIds: string[]) => {
               socket?.emit(ItemClientMessages.RequestItemTemplates, {
                  itemTemplateIds,
               });
            },
            takeQuestFromNpc: ({ npcId, questId }) => {
               socket?.emit(NpcClientMessages.TakeQuestFromNpc, {
                  npcId,
                  questId,
               });
            },
         }}
      >
         {children}
      </EngineApiContext.Provider>
   );
};

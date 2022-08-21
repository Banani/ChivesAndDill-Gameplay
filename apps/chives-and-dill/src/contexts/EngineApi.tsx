import { ChatChannelClientMessages, ItemClientMessages, NpcClientMessages } from '@bananos/types';
import React, { useContext } from 'react';
import { SocketContext } from '../app/gameController/socketContext';

interface EngineApiMethods {
   requestItemTemplates: (itemTemplateIds: string[]) => void;
   takeQuestFromNpc: ({ npcId, questId }) => void;
   finalizeQuestWithNpc: ({ npcId, questId }) => void;
   createChatChannel: ({ chatChannelName }) => void;
   invitePlayerCharacterToChatChannel: ({ chatChannelId, characterName }) => void;
   leaveChatChannel: ({ chatChannelId }) => void;
   deleteChatChannel: ({ chatChannelId }) => void;
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
            finalizeQuestWithNpc: ({ npcId, questId }) => {
               socket?.emit(NpcClientMessages.FinalizeQuestWithNpc, {
                  npcId,
                  questId,
               });
            },
            createChatChannel: ({ chatChannelName }) => {
               socket?.emit(ChatChannelClientMessages.CreateChatChannel, { chatChannelName });
            },
            invitePlayerCharacterToChatChannel: ({ chatChannelId, characterName }) => {
               socket?.emit(ChatChannelClientMessages.InvitePlayerCharacterToChatChannel, { chatChannelId, characterName });
            },
            leaveChatChannel: ({ chatChannelId }) => {
               socket?.emit(ChatChannelClientMessages.LeaveChatChannel, { chatChannelId });
            },
            deleteChatChannel: ({ chatChannelId }) => {
               socket?.emit(ChatChannelClientMessages.DeleteChatChannel, { chatChannelId });
            },
         }}
      >
         {children}
      </EngineApiContext.Provider>
   );
};

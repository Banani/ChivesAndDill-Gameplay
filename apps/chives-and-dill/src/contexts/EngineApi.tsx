import { ChatChannelClientMessages, ItemClientMessages, NpcClientMessages, SpellClientMessages } from '@bananos/types';
import React, { useContext } from 'react';
import { SocketContext } from './SocketCommunicator';

interface EngineApiMethods {
    requestItemTemplates: (itemTemplateIds: string[]) => void;
    requestSpellDefinitions: (spellTemplateIds: string[]) => void;
    takeQuestFromNpc: ({ npcId, questId }) => void;
    finalizeQuestWithNpc: ({ npcId, questId }) => void;
    createChatChannel: ({ chatChannelName }) => void;
    invitePlayerCharacterToChatChannel: ({ chatChannelId, characterName }) => void;
    leaveChatChannel: ({ chatChannelId }) => void;
    deleteChatChannel: ({ chatChannelId }) => void;
    closeNpcConversationDialog: () => void;
    removePlayerCharacterFromChatChannel: ({ chatChannelId, characterId }) => void;
    changeChatChannelOwner: ({ chatChannelId, newOwnerId }) => void;
    sendChatMessage: ({ chatChannelId, message, channelType }) => void;
}

export const EngineApiContext = React.createContext<EngineApiMethods>(null);

export const EngineApi = ({ children }) => {
    const { socket } = useContext(SocketContext);

    return (
        <EngineApiContext.Provider
            value={{
                requestItemTemplates: (itemTemplateIds: string[]) => {
                    socket?.emit(ItemClientMessages.RequestItemTemplates, {
                        itemTemplateIds,
                    });
                },
                requestSpellDefinitions: (spellIds: string[]) => {
                    socket?.emit(SpellClientMessages.RequestSpellDefinitions, {
                        spellIds,
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
                sendChatMessage: ({ chatChannelId, message, channelType }) => {
                    socket?.emit(ChatChannelClientMessages.SendChatMessage, { chatChannelId, message, channelType });
                },
                removePlayerCharacterFromChatChannel: ({ chatChannelId, characterId }) => {
                    socket?.emit(ChatChannelClientMessages.RemovePlayerCharacterFromChatChannel, { chatChannelId, characterId });
                },
                changeChatChannelOwner: ({ chatChannelId, newOwnerId }) => {
                    socket?.emit(ChatChannelClientMessages.ChangeChatChannelOwner, { chatChannelId, newOwnerId });
                },

                closeNpcConversationDialog: () => {
                    socket?.emit(NpcClientMessages.CloseNpcConversationDialog);
                },
            }}
        >
            {children}
        </EngineApiContext.Provider>
    );
};

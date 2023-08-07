import { ChatChannelClientActions, ItemClientActions, NpcClientActions, SpellClientActions } from '@bananos/types';
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
                    socket?.emit(ItemClientActions.RequestItemTemplates, {
                        itemTemplateIds,
                    });
                },
                requestSpellDefinitions: (spellIds: string[]) => {
                    socket?.emit(SpellClientActions.RequestSpellDefinitions, {
                        spellIds,
                    });
                },
                takeQuestFromNpc: ({ npcId, questId }) => {
                    socket?.emit(NpcClientActions.TakeQuestFromNpc, {
                        npcId,
                        questId,
                    });
                },
                finalizeQuestWithNpc: ({ npcId, questId }) => {
                    socket?.emit(NpcClientActions.FinalizeQuestWithNpc, {
                        npcId,
                        questId,
                    });
                },

                createChatChannel: ({ chatChannelName }) => {
                    socket?.emit(ChatChannelClientActions.CreateChatChannel, { chatChannelName });
                },
                invitePlayerCharacterToChatChannel: ({ chatChannelId, characterName }) => {
                    socket?.emit(ChatChannelClientActions.InvitePlayerCharacterToChatChannel, { chatChannelId, characterName });
                },
                leaveChatChannel: ({ chatChannelId }) => {
                    socket?.emit(ChatChannelClientActions.LeaveChatChannel, { chatChannelId });
                },
                deleteChatChannel: ({ chatChannelId }) => {
                    socket?.emit(ChatChannelClientActions.DeleteChatChannel, { chatChannelId });
                },
                sendChatMessage: ({ chatChannelId, message, channelType }) => {
                    socket?.emit(ChatChannelClientActions.SendChatMessage, { chatChannelId, message, channelType });
                },
                removePlayerCharacterFromChatChannel: ({ chatChannelId, characterId }) => {
                    socket?.emit(ChatChannelClientActions.RemovePlayerCharacterFromChatChannel, { chatChannelId, characterId });
                },
                changeChatChannelOwner: ({ chatChannelId, newOwnerId }) => {
                    socket?.emit(ChatChannelClientActions.ChangeChatChannelOwner, { chatChannelId, newOwnerId });
                },

                closeNpcConversationDialog: () => {
                    socket?.emit(NpcClientActions.CloseNpcConversationDialog);
                },
            }}
        >
            {children}
        </EngineApiContext.Provider>
    );
};

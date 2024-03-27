import { ChatChannelClientActions, GlobalStoreModule } from '@bananos/types';
import { EngineManager, checkIfErrorWasHandled, checkIfPackageIsValid } from '../../../../testUtilities';

interface setupEngineProps {
    chatChannelName: string;
}

const CURRENT_MODULE = GlobalStoreModule.CHAT_CHANNEL;

const setupEngine = ({ chatChannelName }: setupEngineProps = { chatChannelName: 'channelName' }) => {
    const engineManager = new EngineManager();

    const players = {
        '1': engineManager.preparePlayerWithCharacter({ name: 'character_1' }),
        '2': engineManager.preparePlayerWithCharacter({ name: 'character_2' }),
        '3': engineManager.preparePlayerWithCharacter({ name: 'character_3' }),
    };

    const dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ChatChannelClientActions.CreateChatChannel, chatChannelName });

    const recentlyCreatedChatChannelId = Object.keys(dataPackage.chatChannel.data)[0];

    return { engineManager, players, chatChannelName, recentlyCreatedChatChannelId };
};

describe('Chat channel - change chat channel owner', () => {
    it('Chat channel owner should be able to give ownership to another channel member', () => {
        const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();

        engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientActions.AddPlayerCharacterToChatChannel,
            chatChannelId: recentlyCreatedChatChannelId,
            characterName: players['2'].character.name,
        });

        const dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientActions.ChangeChatChannelOwner,
            chatChannelId: recentlyCreatedChatChannelId,
            newOwnerId: players['2'].characterId,
        });

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: { '1': { characterOwnerId: players['2'].characterId } },
        });
    });

    it('Player should get correct message if channel does not exist', () => {
        const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();

        engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientActions.AddPlayerCharacterToChatChannel,
            chatChannelId: recentlyCreatedChatChannelId,
            characterName: players['2'].character.name,
        });

        const dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientActions.ChangeChatChannelOwner,
            chatChannelId: 'SOME_RANDOM_CHANNEL_ID',
            newOwnerId: players['2'].characterId,
        });

        checkIfErrorWasHandled(GlobalStoreModule.CHAT_CHANNEL, 'Chat channel does not exist.', dataPackage);
    });

    it('Player should get correct message if requested character is not a chat channel member', () => {
        const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();

        const dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientActions.ChangeChatChannelOwner,
            chatChannelId: recentlyCreatedChatChannelId,
            newOwnerId: players['2'].characterId,
        });

        checkIfErrorWasHandled(GlobalStoreModule.CHAT_CHANNEL, 'This character is not a member.', dataPackage);
    });

    it('Player should get correct message if he is not an chat channel owner', () => {
        const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();

        engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientActions.AddPlayerCharacterToChatChannel,
            chatChannelId: recentlyCreatedChatChannelId,
            characterName: players['2'].character.name,
        });

        engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientActions.AddPlayerCharacterToChatChannel,
            chatChannelId: recentlyCreatedChatChannelId,
            characterName: players['3'].character.name,
        });

        const dataPackage = engineManager.callPlayerAction(players['2'].socketId, {
            type: ChatChannelClientActions.ChangeChatChannelOwner,
            chatChannelId: recentlyCreatedChatChannelId,
            newOwnerId: players['3'].characterId,
        });

        checkIfErrorWasHandled(GlobalStoreModule.CHAT_CHANNEL, 'Only the owner is allowed promote a member to be a new owner.', dataPackage);
    });

    it('Chat channel owner should get correct message if he is trying to promote himself to be a new chat channel owner', () => {
        const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();

        engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientActions.AddPlayerCharacterToChatChannel,
            chatChannelId: recentlyCreatedChatChannelId,
            characterName: players['2'].character.name,
        });

        const dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientActions.ChangeChatChannelOwner,
            chatChannelId: recentlyCreatedChatChannelId,
            newOwnerId: players['1'].characterId,
        });

        checkIfErrorWasHandled(GlobalStoreModule.CHAT_CHANNEL, 'You are already the owner of this chat channel.', dataPackage);
    });
});

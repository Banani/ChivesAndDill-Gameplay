import { ChatChannelClientMessages, GlobalStoreModule } from '@bananos/types';
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

    const dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ChatChannelClientMessages.CreateChatChannel, chatChannelName });

    const recentlyCreatedChatChannelId = Object.keys(dataPackage.chatChannel.data)[0];

    return { engineManager, players, chatChannelName, recentlyCreatedChatChannelId };
};

describe('Chat channel InvitePlayerCharacterToChatChannel action', () => {
    it('Player should be able to invite other players to his chat', () => {
        const { players, engineManager, recentlyCreatedChatChannelId } = setupEngine();

        const dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
            chatChannelId: recentlyCreatedChatChannelId,
            characterName: players['2'].character.name,
        });

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: { '1': { membersIds: { playerCharacter_2: true } } },
        });
    });

    it('Player should get error message when tries to add a player which does not exist', () => {
        const { players, engineManager, recentlyCreatedChatChannelId } = setupEngine();

        const dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
            chatChannelId: recentlyCreatedChatChannelId,
            characterName: 'WRONG_NAME',
        });

        checkIfErrorWasHandled(GlobalStoreModule.CHAT_CHANNEL, 'Character with that name does not exist.', dataPackage);
    });

    it('Player should get error message when tries to add player to chat when player is already a member', () => {
        const { players, engineManager, recentlyCreatedChatChannelId } = setupEngine();

        let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
            chatChannelId: recentlyCreatedChatChannelId,
            characterName: players['2'].character.name,
        });

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
            chatChannelId: recentlyCreatedChatChannelId,
            characterName: players['2'].character.name,
        });

        checkIfErrorWasHandled(GlobalStoreModule.CHAT_CHANNEL, 'This character is already a member.', dataPackage);
    });

    it('Player should get error message when tries to add player to chat which does not exist', () => {
        const { players, engineManager } = setupEngine();

        const dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
            chatChannelId: 'SOME_RANDOM_ID',
            characterName: players['2'].character.name,
        });

        checkIfErrorWasHandled(GlobalStoreModule.CHAT_CHANNEL, 'Channel does not exist.', dataPackage);
    });

    it('Player should get error message when tries to add player to chat when he is not an owner', () => {
        const { players, engineManager, recentlyCreatedChatChannelId } = setupEngine();

        let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
            chatChannelId: recentlyCreatedChatChannelId,
            characterName: players['2'].character.name,
        });

        dataPackage = engineManager.callPlayerAction(players['2'].socketId, {
            type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
            chatChannelId: recentlyCreatedChatChannelId,
            characterName: players['3'].character.name,
        });

        checkIfErrorWasHandled(GlobalStoreModule.CHAT_CHANNEL, 'Only the owner is allowed to add new member to the chat channel.', dataPackage);
    });

    it('All chat members should be informed when new player joins chat channel', () => {
        const { players, engineManager, recentlyCreatedChatChannelId } = setupEngine();

        let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
            chatChannelId: recentlyCreatedChatChannelId,
            characterName: players['2'].character.name,
        });

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
            chatChannelId: recentlyCreatedChatChannelId,
            characterName: players['3'].character.name,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: { '1': { membersIds: { playerCharacter_3: true } } },
        });
    });

    it('Player that is joining the chat channel should have all information about the channel', () => {
        const { players, engineManager, recentlyCreatedChatChannelId, chatChannelName } = setupEngine();

        let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientMessages.InvitePlayerCharacterToChatChannel,
            chatChannelId: recentlyCreatedChatChannelId,
            characterName: players['2'].character.name,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                '1': { characterOwnerId: 'playerCharacter_1', id: '1', membersIds: { playerCharacter_1: true, playerCharacter_2: true }, name: chatChannelName },
            },
        });
    });
});

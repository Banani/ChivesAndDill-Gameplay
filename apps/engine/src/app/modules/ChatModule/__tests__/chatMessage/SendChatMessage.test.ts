import { ChannelType, CharacterDirection, ChatChannelClientActions, GlobalStoreModule } from '@bananos/types';
import { EngineEvents } from 'apps/engine/src/app/EngineEvents';
import { EngineManager, checkIfErrorWasHandled, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { PlayerMovedEvent } from 'apps/engine/src/app/types';
import { merge, now } from 'lodash';

interface setupEngineProps {
    chatChannelName: string;
    watchForErrors: boolean;
}

const CURRENT_MODULE = GlobalStoreModule.CHAT_MESSAGES;

const setupEngine = (props: Partial<setupEngineProps> = {}) => {
    const { chatChannelName, watchForErrors } = merge({ chatChannelName: 'channelName', watchForErrors: false }, props);
    const engineManager = new EngineManager({ watchForErrors });
    const currentTime = '12221';

    (now as jest.Mock).mockReturnValue(currentTime);

    const players = {
        '1': engineManager.preparePlayerWithCharacter({ name: 'character_1' }),
        '2': engineManager.preparePlayerWithCharacter({ name: 'character_2' }),
        '3': engineManager.preparePlayerWithCharacter({ name: 'character_3' }),
    };

    let dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ChatChannelClientActions.CreateChatChannel, chatChannelName });

    const recentlyCreatedChatChannelId = Object.keys(dataPackage.chatChannel.data)[0];

    dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
        type: ChatChannelClientActions.InvitePlayerCharacterToChatChannel,
        chatChannelId: recentlyCreatedChatChannelId,
        characterName: players['2'].character.name,
    });

    return { engineManager, players, chatChannelName, recentlyCreatedChatChannelId, currentTime };
};

describe('Chat module - Send chat message action', () => {
    it('Chat members should receive chat message', () => {
        const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();
        const message = 'Hello there.';
        const currentTime = '12221';

        (now as jest.Mock).mockReturnValue(currentTime);

        let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientActions.SendChatMessage,
            chatChannelId: recentlyCreatedChatChannelId,
            channelType: ChannelType.Custom,
            message,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                chatMessage_0: {
                    authorId: players['1'].characterId,
                    chatChannelId: recentlyCreatedChatChannelId,
                    id: 'chatMessage_0',
                    message,
                    time: currentTime,
                    channelType: ChannelType.Custom,
                    location: {
                        x: 50,
                        y: 100,
                    }
                },
            },
        });
    });

    it('Message author should also receive his chat message', () => {
        const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();
        const message = 'Hello there.';
        const currentTime = '12221';

        (now as jest.Mock).mockReturnValue(currentTime);

        let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientActions.SendChatMessage,
            chatChannelId: recentlyCreatedChatChannelId,
            channelType: ChannelType.Custom,
            message,
        });

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                chatMessage_0: {
                    authorId: players['1'].characterId,
                    chatChannelId: recentlyCreatedChatChannelId,
                    id: 'chatMessage_0',
                    message,
                    time: currentTime,
                    channelType: ChannelType.Custom,
                    location: {
                        x: 50,
                        y: 100,
                    }
                },
            },
        });
    });

    it('Only members should receive chat message', () => {
        const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();
        const message = 'Hello there.';
        const currentTime = '12221';

        (now as jest.Mock).mockReturnValue(currentTime);

        let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientActions.SendChatMessage,
            chatChannelId: recentlyCreatedChatChannelId,
            channelType: ChannelType.Custom,
            message,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['3'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, undefined);
    });

    it('Player should get error message when tries to write a message when chat channel does not exist', () => {
        const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();
        const message = 'Hello there.';

        let dataPackage = engineManager.callPlayerAction(players['3'].socketId, {
            type: ChatChannelClientActions.SendChatMessage,
            chatChannelId: 'SOME_RANDOM_ID',
            channelType: ChannelType.Custom,
            message,
        });

        checkIfErrorWasHandled(CURRENT_MODULE, 'Chat channel does not exist.', dataPackage);
    });

    it('Player should get error message when tries to write a message when he is not a member', () => {
        const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();
        const message = 'Hello there.';

        let dataPackage = engineManager.callPlayerAction(players['3'].socketId, {
            type: ChatChannelClientActions.SendChatMessage,
            chatChannelId: recentlyCreatedChatChannelId,
            channelType: ChannelType.Custom,
            message,
        });

        checkIfErrorWasHandled(CURRENT_MODULE, 'You are not a member of this chat channel.', dataPackage);
    });

    it('Messages should be deleted when chat channel is deleted', () => {
        const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine();
        const message1 = 'Hello there.';
        const message2 = 'General PeePeePooPoo.';

        let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientActions.SendChatMessage,
            chatChannelId: recentlyCreatedChatChannelId,
            channelType: ChannelType.Custom,
            message: message1,
        });

        dataPackage = engineManager.callPlayerAction(players['2'].socketId, {
            type: ChatChannelClientActions.SendChatMessage,
            chatChannelId: recentlyCreatedChatChannelId,
            channelType: ChannelType.Custom,
            message: message2,
        });

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientActions.DeleteChatChannel,
            chatChannelId: recentlyCreatedChatChannelId,
        });

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            toDelete: { chatMessage_0: null, chatMessage_1: null },
        });
    });

    it('Only messages from deleted chat channel should be deleted', () => {
        const { engineManager, players, recentlyCreatedChatChannelId } = setupEngine({ watchForErrors: true });
        const message1 = 'Hello there.';
        const message2 = 'General PeePeePooPoo.';

        let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientActions.SendChatMessage,
            chatChannelId: recentlyCreatedChatChannelId,
            channelType: ChannelType.Custom,
            message: message1,
        });

        dataPackage = engineManager.callPlayerAction(players['2'].socketId, {
            type: ChatChannelClientActions.SendChatMessage,
            chatChannelId: recentlyCreatedChatChannelId,
            channelType: ChannelType.Custom,
            message: message2,
        });

        dataPackage = engineManager.callPlayerAction(players['2'].socketId, {
            type: ChatChannelClientActions.CreateChatChannel,
            chatChannelName: 'some_name',
        });
        const secChatChannelId = Object.keys(dataPackage.chatChannel.data)[0];

        engineManager.callPlayerAction(players['2'].socketId, {
            type: ChatChannelClientActions.InvitePlayerCharacterToChatChannel,
            characterName: players['1'].character.name,
            chatChannelId: secChatChannelId,
        });

        engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientActions.SendChatMessage,
            chatChannelId: secChatChannelId,
            channelType: ChannelType.Custom,
            message: 'Siema',
        });

        dataPackage = engineManager.callPlayerAction(players['2'].socketId, {
            type: ChatChannelClientActions.DeleteChatChannel,
            chatChannelId: secChatChannelId,
        });

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            toDelete: { chatMessage_2: null },
        });
    });

    it('Player should get message when it was sent in range channel', () => {
        const { engineManager, players, currentTime } = setupEngine();
        const message = 'Hello there.';

        let dataPackage = engineManager.callPlayerAction(players['3'].socketId, {
            type: ChatChannelClientActions.SendChatMessage,
            chatChannelId: 'say',
            channelType: ChannelType.Range,
            message,
        });

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                chatRangeMessage_0: {
                    authorId: 'playerCharacter_3',
                    channelType: ChannelType.Range,
                    chatChannelId: 'say',
                    id: 'chatRangeMessage_0',
                    message: 'Hello there.',
                    time: currentTime,
                    location: {
                        x: 50,
                        y: 100,
                    }
                },
            },
        });
    });

    it('Player should not get message when he is standing to far away', () => {
        const { engineManager, players } = setupEngine();
        const message = 'Hello there.';

        engineManager.createSystemAction<PlayerMovedEvent>({
            type: EngineEvents.CharacterMoved,
            characterId: players['3'].characterId,
            newCharacterDirection: CharacterDirection.DOWN,
            newLocation: { x: 1500, y: 1500 },
        });

        engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientActions.SendChatMessage,
            chatChannelId: 'say',
            channelType: ChannelType.Range,
            message,
        });

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['3'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, undefined);
    });

    it('Player should get message when it was sent in yell range channel', () => {
        const { engineManager, players, currentTime } = setupEngine();
        const message = 'Hello there.';

        engineManager.createSystemAction<PlayerMovedEvent>({
            type: EngineEvents.CharacterMoved,
            characterId: players['3'].characterId,
            newCharacterDirection: CharacterDirection.DOWN,
            newLocation: { x: 1500, y: 1500 },
        });

        engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientActions.SendChatMessage,
            chatChannelId: 'yell',
            channelType: ChannelType.Range,
            message,
        });

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['3'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                chatRangeMessage_0: {
                    authorId: 'playerCharacter_1',
                    channelType: ChannelType.Range,
                    chatChannelId: 'yell',
                    id: 'chatRangeMessage_0',
                    message: 'Hello there.',
                    time: currentTime,
                    location: {
                        x: 50,
                        y: 100,
                    }
                },
            },
        });
    });

    it('Player should not get message when he is standing to far away for yell', () => {
        const { engineManager, players } = setupEngine();
        const message = 'Hello there.';

        engineManager.createSystemAction<PlayerMovedEvent>({
            type: EngineEvents.CharacterMoved,
            characterId: players['3'].characterId,
            newCharacterDirection: CharacterDirection.DOWN,
            newLocation: { x: 10000, y: 10000 },
        });

        engineManager.callPlayerAction(players['1'].socketId, {
            type: ChatChannelClientActions.SendChatMessage,
            chatChannelId: 'yell',
            channelType: ChannelType.Range,
            message,
        });

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['3'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, undefined);
    });
});

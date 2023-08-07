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
    };

    engineManager.callPlayerAction(players['1'].socketId, { type: ChatChannelClientActions.CreateChatChannel, chatChannelName });

    return { engineManager, players, chatChannelName };
};

describe('Chat channel create action', () => {
    it('Should create chat channel when requested by player', () => {
        const { engineManager, players, chatChannelName } = setupEngine();

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                '1': { characterOwnerId: 'playerCharacter_1', id: '1', membersIds: { playerCharacter_1: true }, name: chatChannelName },
            },
        });
    });

    it('Player should get error message when tries to create chat channel with empty name', () => {
        const { engineManager, players } = setupEngine({ chatChannelName: '' });

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfErrorWasHandled(GlobalStoreModule.CHAT_CHANNEL, 'Chat channel name cannot be empty.', dataPackage);
    });

    it('Only chat owner should be informed about recently created chat channel', () => {
        const { engineManager, players } = setupEngine();

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, undefined);
    });

    it('Owner should be a member of chat channel', () => {
        const { engineManager, players, chatChannelName } = setupEngine();

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        expect(dataPackage.chatChannel.data).toStrictEqual({
            '1': { characterOwnerId: 'playerCharacter_1', id: '1', membersIds: { playerCharacter_1: true }, name: chatChannelName },
        });
    });

    it('Player should get the error message when he tries to create a channel with a name that already exists', () => {
        const { engineManager, players, chatChannelName } = setupEngine();

        engineManager.callPlayerAction(players['1'].socketId, { type: ChatChannelClientActions.CreateChatChannel, chatChannelName });
        const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfErrorWasHandled(GlobalStoreModule.CHAT_CHANNEL, 'Chat channel with that name already exist.', dataPackage);
    });
});

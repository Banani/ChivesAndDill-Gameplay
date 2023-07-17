import { GlobalStoreModule, GroupClientMessages } from '@bananos/types';
import { EngineManager, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { merge } from 'lodash';

interface setupEngineProps {
    chatChannelName: string;
    watchForErrors: boolean;
}

const setupEngine = (props: Partial<setupEngineProps> = {}) => {
    const { chatChannelName, watchForErrors } = merge({ chatChannelName: 'channelName', watchForErrors: false }, props);
    const engineManager = new EngineManager({ watchForErrors });

    const players = {
        '1': engineManager.preparePlayerWithCharacter({ name: 'character_1' }),
        '2': engineManager.preparePlayerWithCharacter({ name: 'character_2' }),
        '3': engineManager.preparePlayerWithCharacter({ name: 'character_3' }),
    };

    return { engineManager, players, chatChannelName };
};

describe('Group module - Party', () => {
    it('Both players should be informed about joining the party', () => {
        const { engineManager, players } = setupEngine();

        engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['2'].characterId
        });

        const dataPackage1 = engineManager.callPlayerAction(players['2'].socketId, {
            type: GroupClientMessages.AcceptInvite
        });

        const dataPackage2 = engineManager.getLatestPlayerDataPackage(players['1'].socketId)

        checkIfPackageIsValid(GlobalStoreModule.PARTY, dataPackage1, {
            data: {
                ['1']: {
                    leader: players['1'].characterId,
                    membersIds: {
                        [players['1'].characterId]: true,
                        [players['2'].characterId]: true,
                    }
                }
            },
        });
        checkIfPackageIsValid(GlobalStoreModule.PARTY, dataPackage2, {
            data: {
                ['1']: {
                    leader: players['1'].characterId,
                    membersIds: {
                        [players['1'].characterId]: true,
                        [players['2'].characterId]: true,
                    }
                }
            },
        });
    });
});

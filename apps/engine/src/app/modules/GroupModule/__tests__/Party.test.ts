import { GlobalStoreModule, GroupClientMessages } from '@bananos/types';
import { EngineManager, checkIfErrorWasHandled, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
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

    it('Party leader should be able to pass leader to someone else', () => {
        const { engineManager, players } = setupEngine();

        engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['2'].characterId
        });

        engineManager.callPlayerAction(players['2'].socketId, {
            type: GroupClientMessages.AcceptInvite
        });

        const dataPackage2 = engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.PromoteToLeader,
            characterId: players['2'].characterId
        });

        const dataPackage1 = engineManager.getLatestPlayerDataPackage(players['1'].socketId)

        checkIfPackageIsValid(GlobalStoreModule.PARTY, dataPackage1, {
            data: {
                ['1']: {
                    leader: players['2'].characterId,
                }
            },
        });
        checkIfPackageIsValid(GlobalStoreModule.PARTY, dataPackage2, {
            data: {
                ['1']: {
                    leader: players['2'].characterId,
                }
            },
        });
    });

    it('Party member should not be able to pass leader to someone else if he is not a leader', () => {
        const { engineManager, players } = setupEngine();

        engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['2'].characterId
        });

        engineManager.callPlayerAction(players['2'].socketId, {
            type: GroupClientMessages.AcceptInvite
        });

        const dataPackage1 = engineManager.callPlayerAction(players['2'].socketId, {
            type: GroupClientMessages.PromoteToLeader,
            characterId: players['2'].characterId
        });

        checkIfErrorWasHandled(GlobalStoreModule.PARTY, 'You are not a leader.', dataPackage1);
    });

    it('Player should not be able to pass anyone a leader if he is not a mamber of any party', () => {
        const { engineManager, players } = setupEngine();

        const dataPackage1 = engineManager.callPlayerAction(players['2'].socketId, {
            type: GroupClientMessages.PromoteToLeader,
            characterId: players['2'].characterId
        });

        checkIfErrorWasHandled(GlobalStoreModule.PARTY, 'You are not in the group.', dataPackage1);
    });

    it('Party leader should not be able to pass a leader to someone who is not a member', () => {
        const { engineManager, players } = setupEngine();

        engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['2'].characterId
        });

        engineManager.callPlayerAction(players['2'].socketId, {
            type: GroupClientMessages.AcceptInvite
        });

        const dataPackage1 = engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.PromoteToLeader,
            characterId: players['3'].characterId
        });

        checkIfErrorWasHandled(GlobalStoreModule.PARTY, 'This player is not a member of your group.', dataPackage1);
    });

    it('Party leader should not be able to promote himself to be a leader', () => {
        const { engineManager, players } = setupEngine();

        engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['2'].characterId
        });

        engineManager.callPlayerAction(players['2'].socketId, {
            type: GroupClientMessages.AcceptInvite
        });

        const dataPackage1 = engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.PromoteToLeader,
            characterId: players['1'].characterId
        });

        checkIfErrorWasHandled(GlobalStoreModule.PARTY, 'You are already a leader.', dataPackage1);
    });
});

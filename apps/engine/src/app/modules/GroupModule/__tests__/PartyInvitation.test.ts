import { GlobalStoreModule, GroupClientMessages } from '@bananos/types';
import { EngineManager, checkIfErrorWasHandled, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { merge } from 'lodash';
import { MAX_PARTY_SIZE } from '../services';

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

describe('Group module - Party Invitation', () => {
    it('Player should be able to invite another player to his party', () => {
        const { engineManager, players } = setupEngine();

        let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['2'].characterId
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.PARTY_INVITATION, dataPackage, {
            data: {
                [players['2'].characterId]: players['1'].characterId
            },
        });
    });

    it('Player should not be able to invite another player to his party if that player has another pending invitation', () => {
        const { engineManager, players } = setupEngine();

        engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['3'].characterId
        });


        let dataPackage = engineManager.callPlayerAction(players['2'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['3'].characterId
        });

        checkIfErrorWasHandled(GlobalStoreModule.PARTY_INVITATION, 'This player is busy.', dataPackage);
    });

    it('Player should not be able to invite another player to his party if that player already invited someone', () => {
        const { engineManager, players } = setupEngine();

        engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['3'].characterId
        });


        let dataPackage = engineManager.callPlayerAction(players['2'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['1'].characterId
        });

        checkIfErrorWasHandled(GlobalStoreModule.PARTY_INVITATION, 'This player is busy.', dataPackage);
    });

    it('Player should not be able to invite character that does not exist', () => {
        const { engineManager, players } = setupEngine();

        let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: "SOME_RANDOM_ID"
        });

        checkIfErrorWasHandled(GlobalStoreModule.PARTY_INVITATION, 'This player does not exist.', dataPackage);
    });

    it('Player should be able to decline the invitation', () => {
        const { engineManager, players } = setupEngine();

        engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['2'].characterId
        });


        let dataPackage = engineManager.callPlayerAction(players['2'].socketId, {
            type: GroupClientMessages.DeclineInvite
        });

        checkIfPackageIsValid(GlobalStoreModule.PARTY_INVITATION, dataPackage, {
            toDelete: {
                [players['2'].characterId]: null
            },
        });
    });


    it('Invitation should be removed, when player accepts it', () => {
        const { engineManager, players } = setupEngine();

        engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['2'].characterId
        });


        let dataPackage = engineManager.callPlayerAction(players['2'].socketId, {
            type: GroupClientMessages.AcceptInvite
        });

        checkIfPackageIsValid(GlobalStoreModule.PARTY_INVITATION, dataPackage, {
            toDelete: {
                [players['2'].characterId]: null
            },
        });
    });

    it('Player should be able to decline one invite an accept another', () => {
        const { engineManager, players } = setupEngine();

        engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['3'].characterId
        });


        let dataPackage = engineManager.callPlayerAction(players['2'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['1'].characterId
        });

        checkIfErrorWasHandled(GlobalStoreModule.PARTY_INVITATION, 'This player is busy.', dataPackage);
    });

    it('Player should not be able to accept the invite if was not invited', () => {
        const { engineManager, players } = setupEngine();

        let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.AcceptInvite
        });

        checkIfErrorWasHandled(GlobalStoreModule.PARTY_INVITATION, 'You do not have pending invitation.', dataPackage);
    });

    it('Player should not be able to invite another player who already has a group', () => {
        const { engineManager, players } = setupEngine();

        engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['2'].characterId
        });

        engineManager.callPlayerAction(players['2'].socketId, {
            type: GroupClientMessages.AcceptInvite
        });

        let dataPackage = engineManager.callPlayerAction(players['3'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['2'].characterId
        });

        checkIfErrorWasHandled(GlobalStoreModule.PARTY_INVITATION, 'This player already has a group.', dataPackage);
    });

    it('Player should not be able to invite himself to the party', () => {
        const { engineManager, players } = setupEngine();

        const dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['1'].characterId
        });

        checkIfErrorWasHandled(GlobalStoreModule.PARTY_INVITATION, 'You cannot add yourself to the group.', dataPackage);
    });

    it('Player should not be able to invite other players to the party if he is not a leader', () => {
        const { engineManager, players } = setupEngine();

        engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['2'].characterId
        });

        engineManager.callPlayerAction(players['2'].socketId, {
            type: GroupClientMessages.AcceptInvite
        });

        let dataPackage = engineManager.callPlayerAction(players['2'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['3'].characterId
        });

        checkIfErrorWasHandled(GlobalStoreModule.PARTY_INVITATION, 'You are not a leader.', dataPackage);
    });

    it('Player should be able to invite more player to group then defined in MAX_PARTY_SIZE', () => {
        const { engineManager, players } = setupEngine();

        for (let i = 4; i < MAX_PARTY_SIZE + 2; i++) {
            players[i] = engineManager.preparePlayerWithCharacter({ name: 'character_' + i })
        }

        for (let i = 2; i < MAX_PARTY_SIZE + 1; i++) {
            engineManager.callPlayerAction(players['1'].socketId, {
                type: GroupClientMessages.InviteToParty,
                characterId: players[i].characterId
            });

            engineManager.callPlayerAction(players[i].socketId, {
                type: GroupClientMessages.AcceptInvite
            });
        }

        let dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['41'].characterId
        });

        checkIfErrorWasHandled(GlobalStoreModule.PARTY_INVITATION, 'Your group is full.', dataPackage);
    });

    it('When Party leader invites somone to the party, and then he leaves, that new person should join the party, not the leader', () => {
        const { engineManager, players } = setupEngine();
        players['4'] = engineManager.preparePlayerWithCharacter({ name: 'character_4' })

        engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['2'].characterId
        });

        engineManager.callPlayerAction(players['2'].socketId, {
            type: GroupClientMessages.AcceptInvite
        });

        engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['3'].characterId
        });

        engineManager.callPlayerAction(players['3'].socketId, {
            type: GroupClientMessages.AcceptInvite
        });

        engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['4'].characterId
        });

        engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.LeaveParty
        });

        let dataPackage = engineManager.callPlayerAction(players['4'].socketId, {
            type: GroupClientMessages.AcceptInvite
        });

        checkIfPackageIsValid(GlobalStoreModule.PARTY, dataPackage, {
            data: {
                '1': {
                    leader: players['2'].characterId,
                    membersIds: {
                        playerCharacter_2: true,
                        playerCharacter_3: true,
                        playerCharacter_4: true,
                    }
                }
            },
        });
    });

    it('Party leader should be able to invite many mambers before any of them accepts', () => {
        const { engineManager, players } = setupEngine();

        engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['2'].characterId
        });

        engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['3'].characterId
        });

        engineManager.callPlayerAction(players['2'].socketId, {
            type: GroupClientMessages.AcceptInvite
        });

        let dataPackage = engineManager.callPlayerAction(players['3'].socketId, {
            type: GroupClientMessages.AcceptInvite
        });

        checkIfPackageIsValid(GlobalStoreModule.PARTY, dataPackage, {
            data: {
                '1': {
                    leader: players['1'].characterId,
                    membersIds: {
                        playerCharacter_1: true,
                        playerCharacter_2: true,
                        playerCharacter_3: true,
                    }
                }
            },
        });
    });

    it('When party is removed before someone accepts the invite, he should join the leader to a new party', () => {
        const { engineManager, players } = setupEngine();

        engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['2'].characterId
        });

        engineManager.callPlayerAction(players['2'].socketId, {
            type: GroupClientMessages.AcceptInvite
        });

        engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.InviteToParty,
            characterId: players['3'].characterId
        });

        engineManager.callPlayerAction(players['1'].socketId, {
            type: GroupClientMessages.LeaveParty
        });

        const dataPackage = engineManager.callPlayerAction(players['3'].socketId, {
            type: GroupClientMessages.AcceptInvite
        });

        checkIfPackageIsValid(GlobalStoreModule.PARTY, dataPackage, {
            data: {
                '2': {
                    leader: players['1'].characterId,
                    membersIds: {
                        playerCharacter_1: true,
                        playerCharacter_3: true,
                    }
                }
            },
        });
    });
});
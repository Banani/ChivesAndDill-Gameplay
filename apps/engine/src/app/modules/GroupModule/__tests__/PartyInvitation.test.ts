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

    it('Player should not be able to invite another player to his party if that player has another pending invitation', () => {
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
});

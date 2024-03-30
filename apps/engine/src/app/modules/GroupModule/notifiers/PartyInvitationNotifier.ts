import { GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { GroupEngineEvents, PlayerAcceptedInviteEvent, PlayerCharacterWasInvitedToAPartyEvent, PlayerDeclinedInvitationEvent } from '../Events';

export class PartyInvitationNotifier extends Notifier<string> {
    constructor() {
        super({ key: GlobalStoreModule.PARTY_INVITATION });
        this.eventsToHandlersMap = {
            [GroupEngineEvents.PlayerCharacterWasInvitedToAParty]: this.handlePlayerCharacterWasInvitedToAParty,
            [GroupEngineEvents.PlayerDeclinedInvitation]: this.handlePlayerDeclinedInvitation,
            [GroupEngineEvents.PlayerAcceptedInvite]: this.handlePlayerAcceptedInvite,
        };
    }

    handlePlayerCharacterWasInvitedToAParty: EngineEventHandler<PlayerCharacterWasInvitedToAPartyEvent> = ({ event, services }) => {
        const receiverId = this.getReceiverId(event.characterId, services);
        if (!receiverId) {
            return;
        }

        this.multicastMultipleObjectsUpdate([
            {
                receiverId,
                objects: {
                    [event.characterId]: event.inviterId
                },
            },
        ]);
    };

    handlePlayerDeclinedInvitation: EngineEventHandler<PlayerDeclinedInvitationEvent> = ({ event, services }) => {
        const receiverId = this.getReceiverId(event.characterId, services);
        if (!receiverId) {
            return;
        }

        this.multicastObjectsDeletion([
            {
                receiverId,
                objects: {
                    [event.characterId]: null
                },
            },
        ]);
    };

    handlePlayerAcceptedInvite: EngineEventHandler<PlayerAcceptedInviteEvent> = ({ event, services }) => {
        const receiverId = this.getReceiverId(event.characterId, services);
        if (!receiverId) {
            return;
        }

        this.multicastObjectsDeletion([
            {
                receiverId,
                objects: {
                    [event.characterId]: null
                },
            },
        ]);
    };
}

import { GlobalStoreModule, GroupClientActions } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { GroupEngineEvents, PlayerAcceptedInviteEvent, PlayerCharacterWasInvitedToAPartyEvent, PlayerDeclinedInvitationEvent, PlayerTriesToAcceptInviteEvent, PlayerTriesToDeclineInviteEvent, PlayerTriesToInviteChracterToPartyEvent } from '../Events';

export class PartyInvitationNotifier extends Notifier<string> {
    constructor() {
        super({ key: GlobalStoreModule.PARTY_INVITATION });
        this.eventsToHandlersMap = {
            [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
            [GroupEngineEvents.PlayerCharacterWasInvitedToAParty]: this.handlePlayerCharacterWasInvitedToAParty,
            [GroupEngineEvents.PlayerDeclinedInvitation]: this.handlePlayerDeclinedInvitation,
            [GroupEngineEvents.PlayerAcceptedInvite]: this.handlePlayerAcceptedInvite,
        };
    }

    handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
        const receiverId = this.getReceiverId(event.playerCharacter.id, services);
        if (!receiverId) {
            return;
        }

        const currentSocket = services.socketConnectionService.getSocketById(receiverId);

        currentSocket.on(GroupClientActions.InviteToParty, ({ characterId }) => {
            this.engineEventCrator.asyncCeateEvent<PlayerTriesToInviteChracterToPartyEvent>({
                type: GroupEngineEvents.PlayerTriesToInviteChracterToParty,
                requestingCharacterId: event.playerCharacter.id,
                characterId
            });
        });

        currentSocket.on(GroupClientActions.DeclineInvite, () => {
            this.engineEventCrator.asyncCeateEvent<PlayerTriesToDeclineInviteEvent>({
                type: GroupEngineEvents.PlayerTriesToDeclineInvite,
                requestingCharacterId: event.playerCharacter.id
            });
        });


        currentSocket.on(GroupClientActions.AcceptInvite, () => {
            this.engineEventCrator.asyncCeateEvent<PlayerTriesToAcceptInviteEvent>({
                type: GroupEngineEvents.PlayerTriesToAcceptInvite,
                requestingCharacterId: event.playerCharacter.id
            });
        });
    };

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

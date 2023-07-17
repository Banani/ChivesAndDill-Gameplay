import { find } from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import {
    GroupEngineEvents,
    PartyInvitation,
    PlayerAcceptedInviteEvent,
    PlayerCharacterWasInvitedToAPartyEvent,
    PlayerDeclinedInvitationEvent,
    PlayerTriesToAcceptInviteEvent,
    PlayerTriesToDeclineInviteEvent,
    PlayerTriesToInviteChracterToPartyEvent
} from '../Events';

export class PartyInvitationService extends EventParser {
    // Invited character => PartyInvitation
    private invitations: Record<string, PartyInvitation> = {};

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [GroupEngineEvents.PlayerTriesToInviteChracterToParty]: this.handlePlayerTriesToInviteChracterToParty,
            [GroupEngineEvents.PlayerTriesToDeclineInvite]: this.handlePlayerTriesToDeclineInvite,
            [GroupEngineEvents.PlayerTriesToAcceptInvite]: this.handlePlayerTriesToAcceptInvite,
        };
    }

    handlePlayerTriesToInviteChracterToParty: EngineEventHandler<PlayerTriesToInviteChracterToPartyEvent> = ({ event, services }) => {
        const character = services.characterService.getAllCharacters()[event.characterId];
        // jesli gracz juz jest w pt, to wysylamy ze gracz jest juz w grupie
        // jesli w grupie jest juz 40 graczy to wysylamy ze grupa jest pelna

        if (!character) {
            this.sendErrorMessage(event.requestingCharacterId, 'This player does not exist.');
            return;
        }

        if (this.invitations[event.characterId] || find(this.invitations, invitation => invitation.inviterId === event.characterId)) {
            this.sendErrorMessage(event.requestingCharacterId, 'This player is busy.');
            return;
        }

        this.invitations[event.characterId] = {
            // jesli postac ma juz party, to ustawiamy party
            partyId: undefined,
            inviterId: event.requestingCharacterId,
        };

        this.engineEventCrator.asyncCeateEvent<PlayerCharacterWasInvitedToAPartyEvent>({
            type: GroupEngineEvents.PlayerCharacterWasInvitedToAParty,
            characterId: event.characterId,
            inviterId: event.requestingCharacterId
        });
    };

    handlePlayerTriesToDeclineInvite: EngineEventHandler<PlayerTriesToDeclineInviteEvent> = ({ event, services }) => {
        delete this.invitations[event.requestingCharacterId];

        this.engineEventCrator.asyncCeateEvent<PlayerDeclinedInvitationEvent>({
            type: GroupEngineEvents.PlayerDeclinedInvitation,
            characterId: event.requestingCharacterId,
        });
    };

    handlePlayerTriesToAcceptInvite: EngineEventHandler<PlayerTriesToAcceptInviteEvent> = ({ event, services }) => {
        if (!this.invitations[event.requestingCharacterId]) {
            this.sendErrorMessage(event.requestingCharacterId, 'You do not have pending invitation.');
            return;
        }

        const invitation = this.invitations[event.requestingCharacterId];
        delete this.invitations[event.requestingCharacterId];

        this.engineEventCrator.asyncCeateEvent<PlayerAcceptedInviteEvent>({
            type: GroupEngineEvents.PlayerAcceptedInvite,
            inviterId: invitation.inviterId,
            partyId: invitation.partyId,
            characterId: event.requestingCharacterId,
        });
    };
}

import { AcceptInvite, DeclineInvite, GroupClientActions, InviteToParty } from '@bananos/types';
import { find } from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineActionHandler } from '../../../types';
import {
    GroupEngineEvents,
    PartyInvitation,
    PlayerAcceptedInviteEvent,
    PlayerCharacterWasInvitedToAPartyEvent,
    PlayerDeclinedInvitationEvent
} from '../Events';
import { MAX_PARTY_SIZE } from './PartyService';

export class PartyInvitationService extends EventParser {
    // Invited character => PartyInvitation
    private invitations: Record<string, PartyInvitation> = {};

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [GroupClientActions.InviteToParty]: this.handlePlayerTriesToInviteChracterToParty,
            [GroupClientActions.DeclineInvite]: this.handlePlayerTriesToDeclineInvite,
            [GroupClientActions.AcceptInvite]: this.handlePlayerTriesToAcceptInvite,
        };
    }

    handlePlayerTriesToInviteChracterToParty: EngineActionHandler<InviteToParty> = ({ event, services }) => {
        const character = services.characterService.getAllCharacters()[event.characterId];

        if (event.characterId === event.requestingCharacterId) {
            this.sendErrorMessage(event.requestingCharacterId, 'You cannot add yourself to the group.');
            return;
        }

        if (!character) {
            this.sendErrorMessage(event.requestingCharacterId, 'This player does not exist.');
            return;
        }

        if (services.partyService.getCharacterParty(event.characterId)) {
            this.sendErrorMessage(event.requestingCharacterId, 'This player already has a group.');
            return;
        }

        if (this.invitations[event.characterId] || find(this.invitations, invitation => invitation.inviterId === event.characterId)) {
            this.sendErrorMessage(event.requestingCharacterId, 'This player is busy.');
            return;
        }

        const inviterParty = services.partyService.getCharacterParty(event.requestingCharacterId);

        if (inviterParty && inviterParty.leader !== event.requestingCharacterId) {
            this.sendErrorMessage(event.requestingCharacterId, 'You are not a leader.');
            return;
        }

        if (inviterParty && Object.keys(inviterParty.membersIds).length === MAX_PARTY_SIZE) {
            this.sendErrorMessage(event.requestingCharacterId, 'Your group is full.');
            return;
        }

        this.invitations[event.characterId] = {
            partyId: inviterParty?.id,
            inviterId: event.requestingCharacterId,
        };

        this.engineEventCrator.asyncCeateEvent<PlayerCharacterWasInvitedToAPartyEvent>({
            type: GroupEngineEvents.PlayerCharacterWasInvitedToAParty,
            characterId: event.characterId,
            inviterId: event.requestingCharacterId
        });
    };

    handlePlayerTriesToDeclineInvite: EngineActionHandler<DeclineInvite> = ({ event, services }) => {
        delete this.invitations[event.requestingCharacterId];

        this.engineEventCrator.asyncCeateEvent<PlayerDeclinedInvitationEvent>({
            type: GroupEngineEvents.PlayerDeclinedInvitation,
            characterId: event.requestingCharacterId,
        });
    };

    handlePlayerTriesToAcceptInvite: EngineActionHandler<AcceptInvite> = ({ event, services }) => {
        if (!this.invitations[event.requestingCharacterId]) {
            this.sendErrorMessage(event.requestingCharacterId, 'You do not have pending invitation.');
            return;
        }


        const invitation = this.invitations[event.requestingCharacterId];
        const inviterParty = services.partyService.getCharacterParty(invitation.inviterId);
        delete this.invitations[event.requestingCharacterId];

        let partyId = invitation.partyId;
        if (!partyId && inviterParty) {
            partyId = inviterParty.id
        }

        this.engineEventCrator.asyncCeateEvent<PlayerAcceptedInviteEvent>({
            type: GroupEngineEvents.PlayerAcceptedInvite,
            inviterId: invitation.inviterId,
            partyId: partyId,
            characterId: event.requestingCharacterId,
        });
    };
}

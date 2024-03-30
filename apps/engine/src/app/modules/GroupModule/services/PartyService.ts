import { GroupClientActions, LeaveParty, Party, PromoteToLeader, UninviteFromParty } from '@bananos/types';
import { find } from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineActionHandler, EngineEventHandler } from '../../../types';
import {
    GroupEngineEvents,
    PartyCreatedEvent,
    PartyLeaderChangedEvent,
    PartyRemovedEvent,
    PlayerAcceptedInviteEvent,
    PlayerJoinedThePartyEvent,
    PlayerLeftThePartyEvent
} from '../Events';

export const MAX_PARTY_SIZE = 40;

export class PartyService extends EventParser {
    private parties: Record<string, Party> = {};
    private increment = 0;

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [GroupEngineEvents.PlayerAcceptedInvite]: this.handlePlayerAcceptedInvite,
            [GroupClientActions.PromoteToLeader]: this.handlePlayerTriesToPassLeader,
            [GroupClientActions.LeaveParty]: this.handlePlayerTriesToLeaveParty,
            [GroupClientActions.UninviteFromParty]: this.handlePlayerTriesToUninviteFromParty
        };
    }

    handlePlayerAcceptedInvite: EngineEventHandler<PlayerAcceptedInviteEvent> = ({ event, services }) => {
        let partyId = event.partyId;

        if (partyId && this.parties[partyId]) {
            this.parties[partyId].membersIds[event.characterId] = true;
        } else {
            this.increment++;
            partyId = this.increment.toString();

            this.parties[partyId] = {
                id: partyId,
                leader: event.inviterId,
                membersIds: {
                    [event.inviterId]: true,
                    [event.characterId]: true
                }
            };

            this.engineEventCrator.asyncCeateEvent<PartyCreatedEvent>({
                type: GroupEngineEvents.PartyCreated,
                party: this.parties[partyId]
            });

            this.engineEventCrator.asyncCeateEvent<PlayerJoinedThePartyEvent>({
                type: GroupEngineEvents.PlayerJoinedTheParty,
                characterId: event.inviterId,
                partyId
            });
        }

        this.engineEventCrator.asyncCeateEvent<PlayerJoinedThePartyEvent>({
            type: GroupEngineEvents.PlayerJoinedTheParty,
            characterId: event.characterId,
            partyId
        });
    };

    handlePlayerTriesToPassLeader: EngineActionHandler<PromoteToLeader> = ({ event, services }) => {
        const party = this.getCharacterParty(event.requestingCharacterId);

        if (!party) {
            this.sendErrorMessage(event.requestingCharacterId, 'You are not in the group.');
            return;
        }

        if (party.leader !== event.requestingCharacterId) {
            this.sendErrorMessage(event.requestingCharacterId, 'You are not a leader.');
            return;
        }

        if (!party.membersIds[event.characterId]) {
            this.sendErrorMessage(event.requestingCharacterId, 'This player is not a member of your group.');
            return;
        }


        if (party.leader === event.characterId) {
            this.sendErrorMessage(event.requestingCharacterId, 'You are already a leader.');
            return;
        }

        this.engineEventCrator.asyncCeateEvent<PartyLeaderChangedEvent>({
            type: GroupEngineEvents.PartyLeaderChanged,
            newCharacterLeaderId: event.characterId,
            partyId: party.id
        });
    }

    handlePlayerTriesToLeaveParty: EngineActionHandler<LeaveParty> = ({ event, services }) => {
        const party = this.getCharacterParty(event.requestingCharacterId);

        if (!party) {
            this.sendErrorMessage(event.requestingCharacterId, 'You are not in the group.');
            return;
        }

        this.removePlayerFromParty(party.id, event.requestingCharacterId);
    }

    handlePlayerTriesToUninviteFromParty: EngineActionHandler<UninviteFromParty> = ({ event, services }) => {
        const party = this.getCharacterParty(event.requestingCharacterId);

        if (!party) {
            this.sendErrorMessage(event.requestingCharacterId, 'You are not in the group.');
            return;
        }

        if (party.leader !== event.requestingCharacterId) {
            this.sendErrorMessage(event.requestingCharacterId, 'You are not a leader.');
            return;
        }

        if (!party.membersIds[event.characterId]) {
            this.sendErrorMessage(event.requestingCharacterId, 'This player is not a member of your group.');
            return;
        }

        this.removePlayerFromParty(party.id, event.requestingCharacterId);
    }

    removePlayerFromParty = (partyId: string, characterId: string) => {
        const party = this.parties[partyId];

        if (Object.keys(party.membersIds).length == 2) {
            delete this.parties[party.id];

            this.engineEventCrator.asyncCeateEvent<PartyRemovedEvent>({
                type: GroupEngineEvents.PartyRemoved,
                party: party
            });
            return;
        }

        delete this.parties[party.id].membersIds[characterId];

        this.engineEventCrator.asyncCeateEvent<PlayerLeftThePartyEvent>({
            type: GroupEngineEvents.PlayerLeftTheParty,
            characterId: characterId,
            partyId: party.id
        });

        if (party.leader === characterId) {
            this.parties[party.id].leader = Object.keys(party.membersIds)[0];

            this.engineEventCrator.asyncCeateEvent<PartyLeaderChangedEvent>({
                type: GroupEngineEvents.PartyLeaderChanged,
                newCharacterLeaderId: this.parties[party.id].leader,
                partyId: party.id
            });
        }
    }

    getAllParties = () => this.parties;

    getCharacterParty = (characterId: string) => find(this.parties, party => party.membersIds[characterId])
}

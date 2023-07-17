import { Party } from '@bananos/types';
import { find } from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import {
    GroupEngineEvents,
    PartyCreatedEvent,
    PartyLeaderChangedEvent,
    PlayerAcceptedInviteEvent,
    PlayerJoinedThePartyEvent,
    PlayerTriesToPassLeaderEvent
} from '../Events';

export class PartyService extends EventParser {
    private parties: Record<string, Party> = {};
    private increment = 0;

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [GroupEngineEvents.PlayerAcceptedInvite]: this.handlePlayerAcceptedInvite,
            [GroupEngineEvents.PlayerTriesToPassLeader]: this.handlePlayerTriesToPassLeader
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

    handlePlayerTriesToPassLeader: EngineEventHandler<PlayerTriesToPassLeaderEvent> = ({ event, services }) => {
        const party = this.getCharacterParty(event.requestingCharacterId);

        if (!party) {
            this.sendErrorMessage(event.requestingCharacterId, 'You are not in the group.');
            return;
        }

        if (!party.membersIds[event.characterId]) {
            this.sendErrorMessage(event.requestingCharacterId, 'This player is not a member of your group.');
            return;
        }

        if (party.leader !== event.requestingCharacterId) {
            this.sendErrorMessage(event.requestingCharacterId, 'You are not a leader.');
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

    getAllParties = () => this.parties;

    getCharacterParty = (characterId: string) => find(this.parties, party => party.membersIds[characterId])
}

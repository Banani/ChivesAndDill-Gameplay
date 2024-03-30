import { Party } from '@bananos/types';
import { EngineEvent, EngineEventHandler } from '../../types';

export interface PartyInvitation {
    partyId?: string;
    inviterId: string;
}

export enum GroupEngineEvents {
    PlayerCharacterWasInvitedToAParty = "PlayerCharacterWasInvitedToAParty",
    PlayerDeclinedInvitation = "PlayerDeclinedInvitation",
    PlayerAcceptedInvite = "PlayerAcceptedInvite",
    PartyCreated = "PartyCreated",
    PartyRemoved = "PartyRemoved",
    PlayerJoinedTheParty = "PlayerJoinedTheParty",
    PlayerLeftTheParty = "PlayerLeftTheParty",
    PartyLeaderChanged = "PartyLeaderChanged",
}

export interface PlayerCharacterWasInvitedToAPartyEvent extends EngineEvent {
    type: GroupEngineEvents.PlayerCharacterWasInvitedToAParty;
    characterId: string;
    inviterId: string;
}

export interface PlayerDeclinedInvitationEvent extends EngineEvent {
    type: GroupEngineEvents.PlayerDeclinedInvitation;
    characterId: string;
}

export interface PlayerAcceptedInviteEvent extends EngineEvent {
    type: GroupEngineEvents.PlayerAcceptedInvite,
    inviterId: string,
    partyId: string,
    characterId: string,
}

export interface PartyCreatedEvent extends EngineEvent {
    type: GroupEngineEvents.PartyCreated,
    party: Party;
}

export interface PartyRemovedEvent extends EngineEvent {
    type: GroupEngineEvents.PartyRemoved,
    party: Party;
}

export interface PlayerJoinedThePartyEvent extends EngineEvent {
    type: GroupEngineEvents.PlayerJoinedTheParty,
    characterId: string,
    partyId: string
}

export interface PlayerLeftThePartyEvent extends EngineEvent {
    type: GroupEngineEvents.PlayerLeftTheParty,
    characterId: string,
    partyId: string
}

export interface PartyLeaderChangedEvent extends EngineEvent {
    type: GroupEngineEvents.PartyLeaderChanged,
    partyId: string,
    newCharacterLeaderId: string;
}

export interface GroupEngineEventsMap {
    [GroupEngineEvents.PlayerCharacterWasInvitedToAParty]: EngineEventHandler<PlayerCharacterWasInvitedToAPartyEvent>;
    [GroupEngineEvents.PlayerDeclinedInvitation]: EngineEventHandler<PlayerDeclinedInvitationEvent>;
    [GroupEngineEvents.PlayerAcceptedInvite]: EngineEventHandler<PlayerAcceptedInviteEvent>;
    [GroupEngineEvents.PartyCreated]: EngineEventHandler<PartyCreatedEvent>;
    [GroupEngineEvents.PartyRemoved]: EngineEventHandler<PartyRemovedEvent>;
    [GroupEngineEvents.PlayerJoinedTheParty]: EngineEventHandler<PlayerJoinedThePartyEvent>;
    [GroupEngineEvents.PlayerLeftTheParty]: EngineEventHandler<PlayerLeftThePartyEvent>;
    [GroupEngineEvents.PartyLeaderChanged]: EngineEventHandler<PartyLeaderChangedEvent>;
}

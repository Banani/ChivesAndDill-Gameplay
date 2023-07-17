import { Party } from '@bananos/types';
import { EngineEvent, EngineEventHandler } from '../../types';

export interface PartyInvitation {
    partyId?: string;
    inviterId: string;
}

export enum GroupEngineEvents {
    PlayerTriesToInviteChracterToParty = "PlayerTriesToInviteChracterToParty",
    PlayerCharacterWasInvitedToAParty = "PlayerCharacterWasInvitedToAParty",

    PlayerTriesToDeclineInvite = "PlayerTriesToDeclineInvite",
    PlayerDeclinedInvitation = "PlayerDeclinedInvitation",

    PlayerTriesToAcceptInvite = "PlayerTriesToAcceptInvite",
    PlayerAcceptedInvite = "PlayerAcceptedInvite",

    PartyCreated = "PartyCreated",
    PlayerJoinedTheParty = "PlayerJoinedTheParty",
    PlayerLeftTheParty = "PlayerLeftTheParty",
}

export interface PlayerTriesToInviteChracterToPartyEvent extends EngineEvent {
    type: GroupEngineEvents.PlayerTriesToInviteChracterToParty;
    characterId: string;
}

export interface PlayerCharacterWasInvitedToAPartyEvent extends EngineEvent {
    type: GroupEngineEvents.PlayerCharacterWasInvitedToAParty;
    characterId: string;
    inviterId: string;
}

export interface PlayerTriesToDeclineInviteEvent extends EngineEvent {
    type: GroupEngineEvents.PlayerTriesToDeclineInvite;
}

export interface PlayerDeclinedInvitationEvent extends EngineEvent {
    type: GroupEngineEvents.PlayerDeclinedInvitation;
    characterId: string;
}

export interface PlayerTriesToAcceptInviteEvent extends EngineEvent {
    type: GroupEngineEvents.PlayerTriesToAcceptInvite;
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

export interface GroupEngineEventsMap {
    [GroupEngineEvents.PlayerTriesToInviteChracterToParty]: EngineEventHandler<PlayerTriesToInviteChracterToPartyEvent>;
    [GroupEngineEvents.PlayerCharacterWasInvitedToAParty]: EngineEventHandler<PlayerCharacterWasInvitedToAPartyEvent>;
    [GroupEngineEvents.PlayerTriesToDeclineInvite]: EngineEventHandler<PlayerTriesToDeclineInviteEvent>;
    [GroupEngineEvents.PlayerDeclinedInvitation]: EngineEventHandler<PlayerDeclinedInvitationEvent>;
    [GroupEngineEvents.PlayerTriesToAcceptInvite]: EngineEventHandler<PlayerTriesToAcceptInviteEvent>;
    [GroupEngineEvents.PlayerAcceptedInvite]: EngineEventHandler<PlayerAcceptedInviteEvent>;
    [GroupEngineEvents.PartyCreated]: EngineEventHandler<PartyCreatedEvent>;
    [GroupEngineEvents.PlayerJoinedTheParty]: EngineEventHandler<PlayerJoinedThePartyEvent>;
    [GroupEngineEvents.PlayerLeftTheParty]: EngineEventHandler<PlayerLeftThePartyEvent>;
}

import { EngineEvent, EngineEventHandler } from '../../types';
import { CharacterRespawn } from '../../types/CharacterRespawn';
import { NpcTemplateDb } from './db';

export enum NpcEngineEvents {
    CreateNewNpc = 'CreateNewNpc',

    ConversationWithNpcStarted = 'ConversationWithNpcStarted',
    ConversationWithNpcEnded = 'ConversationWithNpcEnded',

    PlayerTriesToTakeQuestFromNpc = 'PlayerTriesToTakeQuestFromNpc',
    PlayerTriesToFinalizeQuestWithNpc = 'PlayerTriesToFinalizeQuestWithNpc',

    NpcTemplateFetchedFromDb = "NpcTemplateFetchedFromDb",
    NpcRespawnsUpdated = "NpcRespawnsUpdated"
}

export interface CreateNewNpcEvent extends EngineEvent {
    type: NpcEngineEvents.CreateNewNpc;
    npcDefinition: CharacterRespawn;
}

export interface ConversationWithNpcStartedEvent extends EngineEvent {
    type: NpcEngineEvents.ConversationWithNpcStarted;
    characterId: string;
    npcId: string;
}

export interface ConversationWithNpcEndedEvent extends EngineEvent {
    type: NpcEngineEvents.ConversationWithNpcEnded;
    characterId: string;
}

export interface PlayerTriesToTakeQuestFromNpcEvent extends EngineEvent {
    type: NpcEngineEvents.PlayerTriesToTakeQuestFromNpc;
    npcId: string;
    questId: string;
}

export interface PlayerTriesToFinalizeQuestWithNpcEvent extends EngineEvent {
    type: NpcEngineEvents.PlayerTriesToFinalizeQuestWithNpc;
    npcId: string;
    questId: string;
}

export interface NpcRespawnsUpdatedEvent extends EngineEvent {
    type: NpcEngineEvents.NpcRespawnsUpdated;
    respawnIds: string[];
}

export interface NpcTemplateFetchedFromDbEvent extends EngineEvent {
    type: NpcEngineEvents.NpcTemplateFetchedFromDb;
    npcTemplateDbRecords: Record<string, NpcTemplateDb>;
}

export interface NpcEngineEventsMap {
    [NpcEngineEvents.CreateNewNpc]: EngineEventHandler<CreateNewNpcEvent>;

    [NpcEngineEvents.ConversationWithNpcStarted]: EngineEventHandler<ConversationWithNpcStartedEvent>;
    [NpcEngineEvents.ConversationWithNpcEnded]: EngineEventHandler<ConversationWithNpcEndedEvent>;

    [NpcEngineEvents.PlayerTriesToTakeQuestFromNpc]: EngineEventHandler<PlayerTriesToTakeQuestFromNpcEvent>;
    [NpcEngineEvents.PlayerTriesToFinalizeQuestWithNpc]: EngineEventHandler<PlayerTriesToFinalizeQuestWithNpcEvent>;

    [NpcEngineEvents.NpcTemplateFetchedFromDb]: EngineEventHandler<NpcTemplateFetchedFromDbEvent>;
    [NpcEngineEvents.NpcRespawnsUpdated]: EngineEventHandler<NpcRespawnsUpdatedEvent>;
}

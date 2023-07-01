import { ItemLocationInBag } from '@bananos/types';
import { EngineEvent, EngineEventHandler } from '../../types';
import { CharacterRespawn } from '../../types/CharacterRespawn';
import { NpcTemplateDb } from './db';
import { Npc } from './types';

export enum NpcEngineEvents {
    CreateNewNpc = 'CreateNewNpc',
    NewNpcCreated = 'NewNpcCreated',

    PlayerTriesToStartConversation = 'PlayerTriesToStartConversation',
    ConversationWithNpcStarted = 'ConversationWithNpcStarted',

    PlayerTriesToFinishConversation = 'PlayerTriesToFinishConversation',
    ConversationWithNpcEnded = 'ConversationWithNpcEnded',

    PlayerTriesToBuyItemFromNpc = 'PlayerTriesToBuyItemFromNpc',
    PlayerTriesToSellItemToNpc = 'PlayerTriesToSellItemToNpc',

    PlayerTriesToTakeQuestFromNpc = 'PlayerTriesToTakeQuestFromNpc',
    PlayerTriesToFinalizeQuestWithNpc = 'PlayerTriesToFinalizeQuestWithNpc',

    NpcTemplateFetchedFromDb = "NpcTemplateFetchedFromDb",
    NpcRespawnsUpdated = "NpcRespawnsUpdated"
}

export interface CreateNewNpcEvent extends EngineEvent {
    type: NpcEngineEvents.CreateNewNpc;
    npcDefinition: CharacterRespawn;
}

export interface NewNpcCreatedEvent extends EngineEvent {
    type: NpcEngineEvents.NewNpcCreated;
    npc: Npc;
}

export interface PlayerTriesToStartConversationEvent extends EngineEvent {
    type: NpcEngineEvents.PlayerTriesToStartConversation;
    npcId: string;
}

export interface ConversationWithNpcStartedEvent extends EngineEvent {
    type: NpcEngineEvents.ConversationWithNpcStarted;
    characterId: string;
    npcId: string;
}

export interface PlayerTriesToFinishConversationEvent extends EngineEvent {
    type: NpcEngineEvents.PlayerTriesToFinishConversation;
}

export interface ConversationWithNpcEndedEvent extends EngineEvent {
    type: NpcEngineEvents.ConversationWithNpcEnded;
    characterId: string;
}

export interface PlayerTriesToBuyItemFromNpcEvent extends EngineEvent {
    type: NpcEngineEvents.PlayerTriesToBuyItemFromNpc;
    npcId: string;
    itemTemplateId: string;
    amount?: number;
    desiredLocation?: ItemLocationInBag;
}

export interface PlayerTriesToSellItemToNpcEvent extends EngineEvent {
    type: NpcEngineEvents.PlayerTriesToSellItemToNpc;
    npcId: string;
    itemId: string;
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
    [NpcEngineEvents.NewNpcCreated]: EngineEventHandler<NewNpcCreatedEvent>;

    [NpcEngineEvents.PlayerTriesToStartConversation]: EngineEventHandler<PlayerTriesToStartConversationEvent>;
    [NpcEngineEvents.ConversationWithNpcStarted]: EngineEventHandler<ConversationWithNpcStartedEvent>;

    [NpcEngineEvents.PlayerTriesToFinishConversation]: EngineEventHandler<PlayerTriesToFinishConversationEvent>;
    [NpcEngineEvents.ConversationWithNpcEnded]: EngineEventHandler<ConversationWithNpcEndedEvent>;

    [NpcEngineEvents.PlayerTriesToBuyItemFromNpc]: EngineEventHandler<PlayerTriesToBuyItemFromNpcEvent>;
    [NpcEngineEvents.PlayerTriesToSellItemToNpc]: EngineEventHandler<PlayerTriesToSellItemToNpcEvent>;

    [NpcEngineEvents.PlayerTriesToTakeQuestFromNpc]: EngineEventHandler<PlayerTriesToTakeQuestFromNpcEvent>;
    [NpcEngineEvents.PlayerTriesToFinalizeQuestWithNpc]: EngineEventHandler<PlayerTriesToFinalizeQuestWithNpcEvent>;

    [NpcEngineEvents.NpcTemplateFetchedFromDb]: EngineEventHandler<NpcTemplateFetchedFromDbEvent>;
    [NpcEngineEvents.NpcRespawnsUpdated]: EngineEventHandler<NpcRespawnsUpdatedEvent>;
}

import { EngineEvent, EngineEventHandler } from '../../types';
import { CharacterRespawn } from '../../types/CharacterRespawn';
import { NpcTemplate } from './NpcTemplate';
import { Npc } from './types';

export enum NpcEngineEvents {
   CreateNewNpc = 'CreateNewNpc',
   NewNpcCreated = 'NewNpcCreated',

   PlayerTriesToStartConversation = 'PlayerTriesToStartConversation',
   ConversationWithNpcStarted = 'ConversationWithNpcStarted',

   PlayerTriesToFinishConversation = 'PlayerTriesToFinishConversation',
   ConversationWithNpcEnded = 'ConversationWithNpcEnded',
}

export interface CreateNewNpcEvent extends EngineEvent {
   type: NpcEngineEvents.CreateNewNpc;
   npcDefinition: CharacterRespawn<NpcTemplate>;
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

export interface NpcEngineEventsMap {
   [NpcEngineEvents.CreateNewNpc]: EngineEventHandler<CreateNewNpcEvent>;
   [NpcEngineEvents.NewNpcCreated]: EngineEventHandler<NewNpcCreatedEvent>;

   [NpcEngineEvents.PlayerTriesToStartConversation]: EngineEventHandler<PlayerTriesToStartConversationEvent>;
   [NpcEngineEvents.ConversationWithNpcStarted]: EngineEventHandler<ConversationWithNpcStartedEvent>;

   [NpcEngineEvents.PlayerTriesToFinishConversation]: EngineEventHandler<PlayerTriesToFinishConversationEvent>;
   [NpcEngineEvents.ConversationWithNpcEnded]: EngineEventHandler<ConversationWithNpcEndedEvent>;
}

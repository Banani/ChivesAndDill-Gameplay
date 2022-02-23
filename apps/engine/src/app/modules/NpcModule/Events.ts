import { EngineEvent, EngineEventHandler } from '../../types';
import { CharacterRespawn } from '../../types/CharacterRespawn';
import { NpcTemplate } from './NpcTemplate';
import { Npc } from './types';

export enum NpcEngineEvents {
   CreateNewNpc = 'CreateNewNpc',
   NewNpcCreated = 'NewNpcCreated',
}

export interface CreateNewNpcEvent extends EngineEvent {
   type: NpcEngineEvents.CreateNewNpc;
   npcDefinition: CharacterRespawn<NpcTemplate>;
}

export interface NewNpcCreatedEvent extends EngineEvent {
   type: NpcEngineEvents.NewNpcCreated;
   npc: Npc;
}

export interface NpcEngineEventsMap {
   [NpcEngineEvents.CreateNewNpc]: EngineEventHandler<CreateNewNpcEvent>;
   [NpcEngineEvents.NewNpcCreated]: EngineEventHandler<NewNpcCreatedEvent>;
}

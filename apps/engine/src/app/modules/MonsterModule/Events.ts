import { EngineEvent, EngineEventHandler } from '../../types';
import { MonsterRespawn } from './MonsterRespawns';
import { Monster } from './types';

export enum MonsterEngineEvents {
   CreateNewMonster = 'CreateNewMonster',
   NewMonsterCreated = 'NewMonsterCreated',
   RespawnMonster = 'RespawnMonster',
}

export interface CreateNewMonsterEvent extends EngineEvent {
   monsterRespawn: MonsterRespawn;
}

export interface NewMonsterCreatedEvent extends EngineEvent {
   monster: Monster;
}

export interface RespawnMonsterEvent extends EngineEvent {
   respawnId: string;
}

export interface MonsterEngineEventsMap {
   [MonsterEngineEvents.CreateNewMonster]: EngineEventHandler<CreateNewMonsterEvent>;
   [MonsterEngineEvents.NewMonsterCreated]: EngineEventHandler<NewMonsterCreatedEvent>;
   [MonsterEngineEvents.RespawnMonster]: EngineEventHandler<RespawnMonsterEvent>;
}

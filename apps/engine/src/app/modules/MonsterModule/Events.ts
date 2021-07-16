import { EngineEvent, EngineEventHandler } from '../../types';
import { MonsterRespawn } from './MonsterRespawns';
import { Monster } from './types';

export enum MonsterEngineEvents {
   CreateNewMonster = 'CreateNewMonster',
   NewMonsterCreated = 'NewMonsterCreated',
   RespawnMonster = 'RespawnMonster',
   MonsterTargetChanged = 'MonsterTargetChanged',
   MonsterLostTarget = 'MonsterLostTarget',
   MonsterDied = 'MonsterDied',
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

export interface MonsterTargetChangedEvent extends EngineEvent {
   newTargetId: string;
   monster: Monster;
}

export interface MonsterLostTargetEvent extends EngineEvent {
   targetId: string;
   monsterId: string;
}

export interface MonsterDiedEvent extends EngineEvent {
   monster: Monster;
   killerId: string;
}

export interface MonsterEngineEventsMap {
   [MonsterEngineEvents.CreateNewMonster]: EngineEventHandler<CreateNewMonsterEvent>;
   [MonsterEngineEvents.NewMonsterCreated]: EngineEventHandler<NewMonsterCreatedEvent>;
   [MonsterEngineEvents.RespawnMonster]: EngineEventHandler<RespawnMonsterEvent>;
   [MonsterEngineEvents.MonsterTargetChanged]: EngineEventHandler<MonsterTargetChangedEvent>;
   [MonsterEngineEvents.MonsterLostTarget]: EngineEventHandler<MonsterLostTargetEvent>;
   [MonsterEngineEvents.MonsterDied]: EngineEventHandler<MonsterDiedEvent>;
}

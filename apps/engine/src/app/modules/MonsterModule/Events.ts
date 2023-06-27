import { EngineEvent, EngineEventHandler } from '../../types';
import { CharacterRespawn } from '../../types/CharacterRespawn';
import { Spell } from '../SpellModule/types/SpellTypes';
import { MonsterTemplate } from './MonsterTemplates';
import { Monster } from './types';

export enum MonsterEngineEvents {
    CreateNewMonster = 'CreateNewMonster',
    NewMonsterCreated = 'NewMonsterCreated',
    RespawnMonster = 'RespawnMonster',
    MonsterTargetChanged = 'MonsterTargetChanged',
    MonsterLostTarget = 'MonsterLostTarget',
    MonsterLostAggro = 'MonsterLostAggro',
    MonsterDied = 'MonsterDied',

    // Happens not only when the monster is starting fight. 
    // But also when another player joins the fight. 
    // Then this monster will be pulled again by another player.
    MonsterPulled = 'MonsterPulled',
    ScheduleMonsterAttack = 'ScheduleMonsterAttack',
    MonsterNoticedPlayerCharacter = 'MonsterNoticedPlayerCharacter',
    MonsterLostPlayerCharacter = 'MonsterLostPlayerCharacter',

    CharacterCombatStarted = 'CharacterCombatStarted',
    CharacterCombatFinished = 'CharacterCombatFinished'
}

export interface CreateNewMonsterEvent extends EngineEvent {
    monsterRespawn: CharacterRespawn<MonsterTemplate>;
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

export interface MonsterPulledEvent extends EngineEvent {
    monster: Monster;
    targetId: string;
}

export interface ScheduleMonsterAttackEvent extends EngineEvent {
    spell: Spell;
    monsterId: string;
    targetId: string;
}

export interface MonsterLostAggroEvent extends EngineEvent {
    type: MonsterEngineEvents.MonsterLostAggro;
    monsterId: string;
}

export interface MonsterNoticedPlayerCharacterEvent extends EngineEvent {
    type: MonsterEngineEvents.MonsterNoticedPlayerCharacter;
    playerCharacterId: string;
    monsterCharacterId: string;
}

export interface MonsterLostPlayerCharacterEvent extends EngineEvent {
    type: MonsterEngineEvents.MonsterLostPlayerCharacter;
    playerCharacterId: string;
    monsterCharacterId: string;
}

export interface CharacterCombatStartedEvent extends EngineEvent {
    type: MonsterEngineEvents.CharacterCombatStarted;
    playerCharacterId: string;
}

export interface CharacterCombatFinishedEvent extends EngineEvent {
    type: MonsterEngineEvents.CharacterCombatFinished;
    playerCharacterId: string;
}

export interface MonsterEngineEventsMap {
    [MonsterEngineEvents.CreateNewMonster]: EngineEventHandler<CreateNewMonsterEvent>;
    [MonsterEngineEvents.NewMonsterCreated]: EngineEventHandler<NewMonsterCreatedEvent>;
    [MonsterEngineEvents.RespawnMonster]: EngineEventHandler<RespawnMonsterEvent>;
    [MonsterEngineEvents.MonsterTargetChanged]: EngineEventHandler<MonsterTargetChangedEvent>;
    [MonsterEngineEvents.MonsterLostTarget]: EngineEventHandler<MonsterLostTargetEvent>;
    [MonsterEngineEvents.MonsterDied]: EngineEventHandler<MonsterDiedEvent>;
    [MonsterEngineEvents.MonsterPulled]: EngineEventHandler<MonsterPulledEvent>;
    [MonsterEngineEvents.ScheduleMonsterAttack]: EngineEventHandler<ScheduleMonsterAttackEvent>;
    [MonsterEngineEvents.MonsterLostAggro]: EngineEventHandler<MonsterLostAggroEvent>;
    [MonsterEngineEvents.MonsterNoticedPlayerCharacter]: EngineEventHandler<MonsterNoticedPlayerCharacterEvent>;
    [MonsterEngineEvents.MonsterLostPlayerCharacter]: EngineEventHandler<MonsterLostPlayerCharacterEvent>;
    [MonsterEngineEvents.CharacterCombatStarted]: EngineEventHandler<CharacterCombatStartedEvent>;
    [MonsterEngineEvents.CharacterCombatFinished]: EngineEventHandler<CharacterCombatFinishedEvent>;
}

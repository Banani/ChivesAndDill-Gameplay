import { AreaEffect, ChannelSpell, GuidedProjectileSpell, GuidedProjectileSubSpell, Location, PowerStackType, ProjectileSpell, ProjectileSubSpell, Spell, SpellEffect, SubSpell, TimeEffect, TimeEffectType } from '@bananos/types';
import { Character, EngineEvent, EngineEventHandler } from '../../types';
import { Vector } from '../../types/Vector';
import { Monster } from '../MonsterModule/types';

export enum SpellEngineEvents {
    PlayerTriesToCastASpell = 'PlayerTriesToCastASpell',
    PlayerCastSpell = 'PlayerCastSpell',
    PlayerCastSubSpell = 'PlayerCastSubSpell',
    PlayerCastedSpell = 'PlayerCastedSpell',
    ApplyTargetSpellEffect = 'ApplyTargetSpellEffect',
    ApplyLocationSpellEffect = 'ApplyLocationSpellEffect',
    RemoveAreaSpellEffect = 'RemoveAreaSpellEffect',
    SpellChannelingStarted = 'SpellChannelingStarted',
    SpellChannelingFinished = 'SpellChannelingFinished',
    SpellChannelingInterrupted = 'SpellChannelingInterrupted',
    RemoveTickOverTimeEffect = 'TickOverTimeFinished',
    TimeEffectRemoved = 'TimeEffectRemoved',
    TimeEffectCreated = 'TimeEffectCreated',
    ProjectileCreated = 'ProjectileCreated',
    ProjectileMoved = 'ProjectileMoved',
    RemoveProjectile = 'RemoveProjectile',
    ProjectileRemoved = 'ProjectileRemoved',
    SpellReachedTarget = 'SpellReachedTarget',
    SpellLanded = 'SpellLanded',
    AreaSpellEffectCreated = 'AreaSpellEffectCreated',
    AreaSpellEffectRemoved = 'AreaSpellEffectRemoved',
    SubSpellCasted = 'SubSpellCasted',
    CharacterGainPowerStack = 'CharacterGainPowerStack',
    CharacterLosePowerStack = 'CharacterLosePowerStack',
    TakeAbsorbShieldValue = 'TakeAbsorbShieldValue',
    AbsorbShieldCreated = 'AbsorbShieldCreated',
    AbsorbShieldFinished = 'AbsorbShieldFinished',
    AbsorbShieldChanged = 'AbsorbShieldChanged',
    DamageAbsorbed = 'DamageAbsorbed',

    SpellDefinitionUpdated = "SpellDefinitionUpdated"
}

export interface SpellReachedTargetEvent extends EngineEvent {
    type: SpellEngineEvents.SpellReachedTarget;
    spell: Spell | SubSpell;
    caster: Character;
    target: Character;
}

export interface SpellLandedEvent extends EngineEvent {
    type: SpellEngineEvents.SpellLanded;
    spell: Spell | SubSpell;
    caster: Character;
    location: Location;
    angle?: number;
}

export interface AreaSpellEffectCreatedEvent extends EngineEvent {
    type: SpellEngineEvents.AreaSpellEffectCreated;
    location: Location;
    areaSpellEffectId: string;
    effect: AreaEffect;
}

export interface AreaSpellEffectRemovedEvent extends EngineEvent {
    type: SpellEngineEvents.AreaSpellEffectRemoved;
    areaSpellEffectId: string;
}

export interface SubSpellCastedEvent extends EngineEvent {
    type: SpellEngineEvents.SubSpellCasted;
    casterId: string;
    spell: SubSpell;
}

export interface CharacterGainPowerStackEvent extends EngineEvent {
    type: SpellEngineEvents.CharacterGainPowerStack;
    characterId: string;
    powerStackType: PowerStackType;
    currentAmount: number;
    amount: number;
}

export interface CharacterLosePowerStackEvent extends EngineEvent {
    type: SpellEngineEvents.CharacterLosePowerStack;
    characterId: string;
    powerStackType: PowerStackType;
    currentAmount: number;
    amount: number;
}

export interface TakeAbsorbShieldValueEvent extends EngineEvent {
    type: SpellEngineEvents.TakeAbsorbShieldValue;
    targetId: string;
    amount: number;
}

export interface DamageAbsorbedEvent extends EngineEvent {
    type: SpellEngineEvents.DamageAbsorbed;
    attackerId: string;
    targetId: string;
}

export interface AbsorbShieldCreatedEvent extends EngineEvent {
    type: SpellEngineEvents.AbsorbShieldCreated;
    ownerId: string;
    absorbId: string;
    newValue: number;
    timeEffectType: TimeEffectType;
    period: number;
    iconImage: string;
    creationTime: number;
}

export interface AbsorbShieldFinishedEvent extends EngineEvent {
    type: SpellEngineEvents.AbsorbShieldFinished;
    absorbId: string;
}

export interface AbsorbShieldChangedEvent extends EngineEvent {
    type: SpellEngineEvents.AbsorbShieldChanged;
    absorbId: string;
    value: number;
}

export interface PlayerTriesToCastASpellEvent extends EngineEvent {
    type: SpellEngineEvents.PlayerTriesToCastASpell;
    spellData: {
        characterId: string;
        spellId: string;
        directionLocation: Vector;
        targetId: string | null;
    };
}

export interface PlayerCastSubSpellEvent extends EngineEvent {
    type: SpellEngineEvents.PlayerCastSubSpell;
    casterId: string | null;
    spell: SubSpell;
    directionLocation: Vector;
    targetId: string | null;
}

export interface RemoveAreaSpellEffectEvent extends EngineEvent {
    type: SpellEngineEvents.RemoveAreaSpellEffect;
    areaId: string;
}

export interface SpellChannelingStartedEvent extends EngineEvent {
    type: SpellEngineEvents.SpellChannelingStarted;
    casterId: string;
    channelingStartedTime: number;
    channelId: string;
    spell: ChannelSpell;
}

export interface SpellChannelingFinishedEvent extends EngineEvent {
    type: SpellEngineEvents.SpellChannelingFinished;
    channelId: string;
}

export interface SpellChannelingInterruptedEvent extends EngineEvent {
    type: SpellEngineEvents.SpellChannelingInterrupted;
    channelId: string;
}

export interface RemoveTickOverTimeEffectEvent extends EngineEvent {
    type: SpellEngineEvents.RemoveTickOverTimeEffect;
    tickOverTimeId: string;
}

export interface TimeEffectRemovedEvent extends EngineEvent {
    type: SpellEngineEvents.TimeEffectRemoved;
    tickOverTimeId: string;
}

export interface TimeEffectCreatedEvent extends EngineEvent {
    type: SpellEngineEvents.TimeEffectCreated;
    timeEffect: TimeEffect;
}

export interface PlayerCastedSpellEvent extends EngineEvent {
    type: SpellEngineEvents.PlayerCastedSpell;
    casterId: string | null;
    spell: Spell;
}

export interface ProjectileCreatedEvent extends EngineEvent {
    type: SpellEngineEvents.ProjectileCreated;
    projectileId: string;
    currentLocation: Location;
    spell: ProjectileSubSpell | ProjectileSpell | GuidedProjectileSpell | GuidedProjectileSubSpell;
}

export interface ProjectileMovedEvent extends EngineEvent {
    type: SpellEngineEvents.ProjectileMoved;
    angle: number;
    newLocation: Location;
    projectileId: string;
}

export interface Projectile {
    characterId: string;
    spell: ProjectileSubSpell | ProjectileSpell;
    directionLocation: Location;
    startLocation: Location;
    currentLocation: Location;
    xMultiplayer: number;
    yMultiplayer: number;
    angle: number;
}

export interface ProjectileRemovedEvent extends EngineEvent {
    type: SpellEngineEvents.ProjectileRemoved;
    projectileId: string;
}

export interface RemoveProjectileEvent extends EngineEvent {
    type: SpellEngineEvents.RemoveProjectile;
    projectileId: string;
}

export interface PlayerCastSpellEvent extends EngineEvent {
    type: SpellEngineEvents.PlayerCastSpell;
    casterId: string | null;
    spell: Spell;
    directionLocation: Vector;
    targetId: string | null;
}

export interface ApplyTargetSpellEffectEvent extends EngineEvent {
    type: SpellEngineEvents.ApplyTargetSpellEffect;
    caster: Monster | Character;
    target: Monster | Character;
    effect: SpellEffect;
}

export interface ApplyLocationSpellEffectEvent extends EngineEvent {
    type: SpellEngineEvents.ApplyLocationSpellEffect;
    caster: Monster | Character;
    effect: SpellEffect;
    location: Location;
}

export interface SpellDefinitionUpdatedEvent extends EngineEvent {
    type: SpellEngineEvents.SpellDefinitionUpdated;
    spellId: string;
}

export interface FightingEngineEventsMap {
    [SpellEngineEvents.PlayerTriesToCastASpell]: EngineEventHandler<PlayerTriesToCastASpellEvent>;
    [SpellEngineEvents.PlayerCastSpell]: EngineEventHandler<PlayerCastSpellEvent>;
    [SpellEngineEvents.PlayerCastedSpell]: EngineEventHandler<PlayerCastedSpellEvent>;
    [SpellEngineEvents.PlayerCastSubSpell]: EngineEventHandler<PlayerCastSubSpellEvent>;
    [SpellEngineEvents.SubSpellCasted]: EngineEventHandler<SubSpellCastedEvent>;
    [SpellEngineEvents.SpellReachedTarget]: EngineEventHandler<SpellReachedTargetEvent>;
    [SpellEngineEvents.SpellLanded]: EngineEventHandler<SpellLandedEvent>;

    [SpellEngineEvents.ProjectileCreated]: EngineEventHandler<ProjectileCreatedEvent>;
    [SpellEngineEvents.ProjectileMoved]: EngineEventHandler<ProjectileMovedEvent>;
    [SpellEngineEvents.RemoveProjectile]: EngineEventHandler<RemoveProjectileEvent>;
    [SpellEngineEvents.ProjectileRemoved]: EngineEventHandler<ProjectileRemovedEvent>;

    [SpellEngineEvents.SpellChannelingStarted]: EngineEventHandler<SpellChannelingStartedEvent>;
    [SpellEngineEvents.SpellChannelingFinished]: EngineEventHandler<SpellChannelingFinishedEvent>;
    [SpellEngineEvents.SpellChannelingInterrupted]: EngineEventHandler<SpellChannelingInterruptedEvent>;

    [SpellEngineEvents.ApplyTargetSpellEffect]: EngineEventHandler<ApplyTargetSpellEffectEvent>;
    [SpellEngineEvents.ApplyLocationSpellEffect]: EngineEventHandler<ApplyLocationSpellEffectEvent>;
    [SpellEngineEvents.RemoveAreaSpellEffect]: EngineEventHandler<RemoveAreaSpellEffectEvent>;
    [SpellEngineEvents.RemoveTickOverTimeEffect]: EngineEventHandler<RemoveTickOverTimeEffectEvent>;
    [SpellEngineEvents.TimeEffectCreated]: EngineEventHandler<TimeEffectCreatedEvent>;
    [SpellEngineEvents.TimeEffectRemoved]: EngineEventHandler<TimeEffectRemovedEvent>;
    [SpellEngineEvents.AreaSpellEffectCreated]: EngineEventHandler<AreaSpellEffectCreatedEvent>;
    [SpellEngineEvents.AreaSpellEffectRemoved]: EngineEventHandler<AreaSpellEffectRemovedEvent>;
    [SpellEngineEvents.CharacterGainPowerStack]: EngineEventHandler<CharacterGainPowerStackEvent>;
    [SpellEngineEvents.CharacterLosePowerStack]: EngineEventHandler<CharacterLosePowerStackEvent>;
    [SpellEngineEvents.TakeAbsorbShieldValue]: EngineEventHandler<TakeAbsorbShieldValueEvent>;
    [SpellEngineEvents.DamageAbsorbed]: EngineEventHandler<DamageAbsorbedEvent>;
    [SpellEngineEvents.AbsorbShieldCreated]: EngineEventHandler<AbsorbShieldCreatedEvent>;
    [SpellEngineEvents.AbsorbShieldFinished]: EngineEventHandler<AbsorbShieldFinishedEvent>;
    [SpellEngineEvents.AbsorbShieldChanged]: EngineEventHandler<AbsorbShieldChangedEvent>;

    [SpellEngineEvents.SpellDefinitionUpdated]: EngineEventHandler<SpellDefinitionUpdatedEvent>;
}

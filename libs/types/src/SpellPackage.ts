// TODO: JUST COPPIED 


import type { Attribute, Location, TimeEffectType } from '@bananos/types';
import { PowerStackType } from '@bananos/types';

export enum SpellType {
    Projectile = 'Projectile',
    GuidedProjectile = 'GuidedProjectile',
    DirectInstant = 'DirectInstant',
    AngleBlast = 'AngleBlast',
    Area = 'Area',
    Channel = 'Channel',
    Teleportation = 'Teleportation',
}

export enum AreaType {
    Circle = 'Circle',
}

export enum SpellEffectType {
    Damage = 'Damage',
    Heal = 'Heal',
    Area = 'Area',
    GenerateSpellPower = 'GenerateSpellPower',
    TickEffectOverTime = 'TickEffectOverTime',
    GainPowerStack = 'GetPowerStack',
    LosePowerStack = 'LosePowerStack',
    AbsorbShield = 'AbsorbShield',
}

export const PowerStackLimit: Record<PowerStackType, number> = {
    [PowerStackType.HolyPower]: 3,
};

interface BaseSpell {
    id: string;
    range: number;
    cooldown: number;
    image: string;
    description?: string;
    spellPowerCost: number;
    requiredPowerStacks?: PowerStackRequirement[];
    casterImpact: boolean;
    monstersImpact: boolean;
    playersImpact: boolean;
}

interface PowerStackRequirement {
    type: PowerStackType;
    amount: number;
}

interface BaseSubSpell {
    name: string;
}

interface EffectHolders {
    spellEffectsOnTarget?: Record<string, AllEffects>;
    spellEffectsOnDirectionLocation?: AllEffects[];
    spellEffectsOnCasterOnSpellHit?: AllEffects[];
}

export interface ProjectileSubSpell extends EffectHolders, BaseSubSpell {
    type: SpellType.Projectile;
    speed: number;
    range: number;
    passThrough: boolean;
}

export interface GuidedProjectileSubSpell extends EffectHolders, BaseSubSpell {
    type: SpellType.GuidedProjectile;
    speed: number;
}

export interface DirectInstantSubSpell extends EffectHolders, BaseSubSpell {
    type: SpellType.DirectInstant;
}

export interface AngleBlastSpellSubSpell extends EffectHolders, BaseSubSpell {
    type: SpellType.AngleBlast;
    range: number;
    angle: number;
}

export interface AreaSubSpell extends EffectHolders, BaseSubSpell {
    type: SpellType.Area;
    areaType: AreaType;
    radius: number;
}

export interface ChannelSubSpell extends EffectHolders, BaseSubSpell {
    type: SpellType.Channel;
    channelSpells: SubSpell[];
    channelFrequency: number;
    channelTime: number;
    canByCastedInMovement: boolean;
}

export type SubSpell = ProjectileSubSpell | GuidedProjectileSubSpell | DirectInstantSubSpell | AngleBlastSpellSubSpell | AreaSubSpell;

export type ProjectileSpell = ProjectileSubSpell & BaseSpell;
export type GuidedProjectileSpell = GuidedProjectileSubSpell & BaseSpell;
export type DirectInstantSpell = DirectInstantSubSpell & BaseSpell;
export type AngleBlastSpell = AngleBlastSpellSubSpell & BaseSpell;
export type AreaSpell = AreaSubSpell & BaseSpell;
export type ChannelSpell = BaseSpell & BaseSubSpell & EffectHolders & ChannelSubSpell;
export type TeleportationSpell = BaseSpell & BaseSubSpell & EffectHolders & { type: SpellType.Teleportation; range: number };

export type Spell = ProjectileSpell | GuidedProjectileSpell | DirectInstantSpell | AngleBlastSpell | AreaSpell | ChannelSpell | TeleportationSpell;

export interface SpellEffect {
    type: SpellEffectType;
    spellId: string;
}

export interface DamageEffect extends SpellEffect {
    type: SpellEffectType.Damage;
    amount: number;
    attribute: Attribute;
}

export interface HealEffect extends SpellEffect {
    type: SpellEffectType.Heal;
    amount: number;
}

export interface AreaEffect extends SpellEffect {
    type: SpellEffectType.Area;
    name: string;
    areaType: AreaType;
    period: number;
    radius: number;
    activationFrequency: number;
    spellEffects: Record<string, AllEffects>;
}

export interface GenerateSpellPowerEffect extends SpellEffect {
    type: SpellEffectType.GenerateSpellPower;
    amount: number;
}

export interface TickOverTimeEffect extends SpellEffect {
    type: SpellEffectType.TickEffectOverTime;
    name: string;
    description: string;
    timeEffectType: TimeEffectType;
    period: number;
    iconImage: string;
    activationFrequency: number;
    spellEffects: Record<string, AllEffects>;
    spellId: string;
}

export interface GainPowerStackEffect extends SpellEffect {
    type: SpellEffectType.GainPowerStack;
    powerStackType: PowerStackType;
    amount: number;
}

export interface LosePowerStackEffect extends SpellEffect {
    type: SpellEffectType.LosePowerStack;
    powerStackType: PowerStackType;
    amount: number;
}

export interface AbsorbShieldEffect extends SpellEffect {
    type: SpellEffectType.AbsorbShield;
    id: string;
    name: string,
    shieldValue: number;
    period: number;
    stack?: number;
    timeEffectType: TimeEffectType;
    iconImage: string;
}

type AllEffects =
    | DamageEffect
    | HealEffect
    | AreaEffect
    | GenerateSpellPowerEffect
    | TickOverTimeEffect
    | GainPowerStackEffect
    | LosePowerStackEffect
    | AbsorbShieldEffect;

export interface SpellDefinition {
    id: string;
    cooldown: number;
    image: string;
    range: number;
    description?: string;
    spellPowerCost: number;
    requiredPowerStacks?: PowerStackRequirement[];
}

export enum SpellClientMessages {
    RequestSpellDefinitions = 'RequestSpellDefinitions',
    CastSpell = 'CastSpell',
}

export interface RequestSpellDefinitions {
    type: SpellClientMessages.RequestSpellDefinitions;
    spellIds: string[];
}

export interface CastSpell {
    type: SpellClientMessages.CastSpell;
    directionLocation: Location;
    spellId: string;
}

export type EngineSpellMessages = RequestSpellDefinitions | CastSpell;
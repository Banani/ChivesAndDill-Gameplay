import { PowerStackType } from '../../SpellType';
import { AreaEffect, Character, EngineEvent, EngineEventHandler, SubSpell } from '../../types';
import { Spell, Location } from '../../types';

export enum FightingEngineEvents {
   SpellReachedTarget = 'SpellReachedTarget',
   SpellLanded = 'SpellLanded',
   AreaSpellEffectCreated = 'AreaSpellEffectCreated',
   AreaSpellEffectRemoved = 'AreaSpellEffectRemoved',
   SubSpellCasted = 'SubSpellCasted',
   CharacterGainPowerStack = 'CharacterGainPowerStack',
   CharacterLosePowerStack = 'CharacterLosePowerStack',
   TakeAbsorbShieldValue = 'TakeAbsorbShieldValue',
   AbsorbShieldValueChanged = 'AbsorbShieldValueChanged',
   DamageAbsorbed = 'DamageAbsorbed',
}

export interface SpellReachedTargetEvent extends EngineEvent {
   spell: Spell | SubSpell;
   caster: Character;
   target: Character;
}

export interface SpellLandedEvent extends EngineEvent {
   spell: Spell | SubSpell;
   caster: Character;
   location: Location;
   angle?: number;
}

export interface AreaSpellEffectCreatedEvent extends EngineEvent {
   location: Location;
   areaSpellEffectId: string;
   effect: AreaEffect;
}

export interface AreaSpellEffectRemovedEvent extends EngineEvent {
   areaSpellEffectId: string;
}

export interface SubSpellCastedEvent extends EngineEvent {
   type: FightingEngineEvents.SubSpellCasted;
   casterId: string;
   spell: SubSpell;
}

export interface CharacterGainPowerStackEvent extends EngineEvent {
   type: FightingEngineEvents.CharacterGainPowerStack;
   characterId: string;
   powerStackType: PowerStackType;
   currentAmount: number;
   amount: number;
}

export interface CharacterLosePowerStackEvent extends EngineEvent {
   type: FightingEngineEvents.CharacterLosePowerStack;
   characterId: string;
   powerStackType: PowerStackType;
   currentAmount: number;
   amount: number;
}

export interface TakeAbsorbShieldValueEvent extends EngineEvent {
   type: FightingEngineEvents.TakeAbsorbShieldValue;
   targetId: string;
   amount: number;
}

export interface DamageAbsorbedEvent extends EngineEvent {
   type: FightingEngineEvents.DamageAbsorbed;
   attackerId: string;
   targetId: string;
}

export interface AbsorbShieldValueChangedEvent extends EngineEvent {
   type: FightingEngineEvents.AbsorbShieldValueChanged;
   ownerId: string;
   newValue: number;
}

export interface FightingEngineEventsMap {
   [FightingEngineEvents.SpellReachedTarget]: EngineEventHandler<SpellReachedTargetEvent>;
   [FightingEngineEvents.SpellLanded]: EngineEventHandler<SpellLandedEvent>;
   [FightingEngineEvents.AreaSpellEffectCreated]: EngineEventHandler<AreaSpellEffectCreatedEvent>;
   [FightingEngineEvents.AreaSpellEffectRemoved]: EngineEventHandler<AreaSpellEffectRemovedEvent>;
   [FightingEngineEvents.SubSpellCasted]: EngineEventHandler<SubSpellCastedEvent>;
   [FightingEngineEvents.CharacterGainPowerStack]: EngineEventHandler<CharacterGainPowerStackEvent>;
   [FightingEngineEvents.CharacterLosePowerStack]: EngineEventHandler<CharacterLosePowerStackEvent>;
   [FightingEngineEvents.TakeAbsorbShieldValue]: EngineEventHandler<TakeAbsorbShieldValueEvent>;
   [FightingEngineEvents.DamageAbsorbed]: EngineEventHandler<DamageAbsorbedEvent>;
   [FightingEngineEvents.AbsorbShieldValueChanged]: EngineEventHandler<AbsorbShieldValueChangedEvent>;
}

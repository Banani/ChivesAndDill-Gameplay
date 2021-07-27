import { AreaEffect, Character, EngineEvent, EngineEventHandler, SubSpell } from '../../types';
import { Spell, Location } from '../../types';

export enum FightingEngineEvents {
   SpellReachedTarget = 'SpellReachedTarget',
   SpellLanded = 'SpellLanded',
   AreaSpellEffectCreated = 'AreaSpellEffectCreated',
   AreaSpellEffectRemoved = 'AreaSpellEffectRemoved',
   SubSpellCasted = 'SubSpellCasted',
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

export interface FightingEngineEventsMap {
   [FightingEngineEvents.SpellReachedTarget]: EngineEventHandler<SpellReachedTargetEvent>;
   [FightingEngineEvents.SpellLanded]: EngineEventHandler<SpellLandedEvent>;
   [FightingEngineEvents.AreaSpellEffectCreated]: EngineEventHandler<AreaSpellEffectCreatedEvent>;
   [FightingEngineEvents.AreaSpellEffectRemoved]: EngineEventHandler<AreaSpellEffectRemovedEvent>;
   [FightingEngineEvents.SubSpellCasted]: EngineEventHandler<SubSpellCastedEvent>;
}

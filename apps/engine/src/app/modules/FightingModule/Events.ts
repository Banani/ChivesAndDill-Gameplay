import { Character, EngineEvent, EngineEventHandler } from '../../types';
import { Spell, Location } from '../../types';

export enum FightingEngineEvents {
   SpellReachedTarget = 'SpellReachedTarget',
   SpellLanded = 'SpellLanded',
}

export interface SpellReachedTargetEvent extends EngineEvent {
   spell: Spell;
   caster: Character;
   target: Character;
}

export interface SpellLandedEvent extends EngineEvent {
   spell: Spell;
   caster: Character;
   location: Location;
}

export interface FightingEngineEventsMap {
   [FightingEngineEvents.SpellReachedTarget]: EngineEventHandler<SpellReachedTargetEvent>;
   [FightingEngineEvents.SpellLanded]: EngineEventHandler<SpellLandedEvent>;
}

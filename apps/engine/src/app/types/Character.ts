import type { CharacterDirection, Location } from '@bananos/types';
import type { Spell } from '../modules/SpellModule/types/SpellTypes';

export interface Character {
   type: CharacterType;
   id: string;
   name: string;
   location: Location;
   sprites: string; // Should be an object
   size: number; // Should be in that object
   avatar: string;
   direction: CharacterDirection;
   speed: number;
   isDead: boolean;
   isInMove: boolean;
   healthPointsRegen: number;
   spellPowerRegen: number;
   spells: Record<string, Spell>;
}

export enum CharacterType {
   Player = 'Player',
   Monster = 'Monster',
   Npc = 'Npc',
}

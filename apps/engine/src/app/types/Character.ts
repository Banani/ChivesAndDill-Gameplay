import { CharacterDirection } from '@bananos/types';
import { Spell } from '../modules/SpellModule/types/spellTypes';
import { Location } from './Location';

export interface Character {
   type: CharacterType;
   id: string;
   name: string;
   location: Location;
   sprites: string; // Should be an object
   size: number; // Should be in that object
   direction: CharacterDirection;
   speed: number;
   isInMove: boolean;
   currentHp: number;
   maxHp: number;
   currentSpellPower: number;
   maxSpellPower: number;
   healthPointsRegen: number;
   spellPowerRegen: number;
   spells: Record<string, Spell>;
}

export enum CharacterType {
   Player = 'Player',
   Monster = 'Monster',
}

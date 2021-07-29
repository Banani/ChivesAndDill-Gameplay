import { Character, CharacterType } from '../../types';

export interface Monster extends Character {
   type: CharacterType.Monster;
   division?: string;
   respawnId: string;
   sightRange: number;
   escapeRange: number;
   attackFrequency: number;
}

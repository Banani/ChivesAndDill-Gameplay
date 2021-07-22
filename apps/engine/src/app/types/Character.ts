import { CharacterDirection } from '@bananos/types';
import { Location } from './Location';

export interface Character {
   id: string;
   name: string;
   location: Location;
   sprites: string; // Should be an object
   size: number; // Should be in that object
   direction: CharacterDirection;
   division?: string;
   isInMove: boolean;
   currentHp: number;
   maxHp: number;
   currentSpellPower: number;
   maxSpellPower: number;
   isDead?: boolean;
   socketId?: string;
}

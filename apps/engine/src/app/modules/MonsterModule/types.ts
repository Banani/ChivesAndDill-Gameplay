import { CharacterDirection } from '@bananos/types';
import { Location } from '../../types';
import { Spell } from '../../types/Spell';

export interface Monster {
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
   respawnId: string;
   sightRange: number;
   escapeRange: number;
   spells: Record<string, Spell>;
   attackFrequency: number;
}

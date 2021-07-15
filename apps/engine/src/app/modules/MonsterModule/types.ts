import { CharacterDirection } from '@bananos/types';
import { Location } from '../../types';

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
}

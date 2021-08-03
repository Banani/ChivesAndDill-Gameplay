import { Character, CharacterType } from './Character';
import { Classes } from './Classes';

export interface Player extends Character {
   type: CharacterType.Player;
   socketId?: string;
   isDead?: boolean;
   class: Classes;
}

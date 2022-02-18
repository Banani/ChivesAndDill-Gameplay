import { Character, CharacterType } from './Character';
import { Classes } from './Classes';

export interface PlayerCharacter extends Character {
   type: CharacterType.Player;
   ownerId: string;
   class: Classes;
}

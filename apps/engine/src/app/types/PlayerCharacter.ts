import { Character, CharacterType } from './Character';

export interface PlayerCharacter extends Character {
    type: CharacterType.Player;
    ownerId: string;
    characterClassId: string;
}

import { Character, CharacterType } from '@bananos/types';

export interface PlayerCharacter extends Character {
    type: CharacterType.Player;
    ownerId: string;
    characterClassId: string;
}

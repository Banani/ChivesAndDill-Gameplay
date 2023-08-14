import { Character, CharacterType } from '@bananos/types';

export interface Monster extends Character {
    type: CharacterType.Monster;
    respawnId: string;
    templateId: string;
    attackFrequency: number;
}

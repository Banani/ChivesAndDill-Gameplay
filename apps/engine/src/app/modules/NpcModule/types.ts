import { Character, CharacterType } from '@bananos/types';

export interface Npc extends Character {
    type: CharacterType.Npc;
    templateId: string;
    respawnId: string;
}

import { Character, CharacterType } from '../../types';

export interface Npc extends Character {
   type: CharacterType.Npc;
   templateId: string;
}

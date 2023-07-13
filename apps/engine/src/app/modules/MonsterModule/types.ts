import type { Character, CharacterType } from '../../types';

export interface Monster extends Character {
    type: CharacterType.Monster;
    division?: string;
    respawnId: string;
    characterTemplateId: string;
    sightRange: number;
    desiredRange: number;
    escapeRange: number;
    attackFrequency: number;
}

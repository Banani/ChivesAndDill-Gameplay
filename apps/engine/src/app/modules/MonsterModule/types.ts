import type { Character, CharacterType } from '../../types';

export interface Monster extends Character {
    type: CharacterType.Monster;
    division?: string;
    respawnId: string;
    templateId: string;
    sightRange: number;
    desiredRange: number;
    escapeRange: number;
    attackFrequency: number;
}

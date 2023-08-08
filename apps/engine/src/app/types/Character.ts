import type { CharacterDirection, Location } from '@bananos/types';

export interface Character {
    type: CharacterType;
    id: string;
    name: string;
    location: Location;
    sprites: string; // Should be an object
    size: number; // Should be in that object
    avatar: string;
    direction: CharacterDirection;
    movementSpeed: number;
    isDead: boolean;
    isInMove: boolean;
    healthPointsRegeneration: number;
    spellPowerRegeneration: number;
}

export enum CharacterType {
    Player = 'Player',
    Monster = 'Monster',
    Npc = 'Npc',
}

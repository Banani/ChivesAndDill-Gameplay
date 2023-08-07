import { CharacterDirection } from "./modules";

export interface Location {
    x: number;
    y: number;
}

export interface Player {
    currentHp: number;
    direction: CharacterDirection;
    id: string;
    isDead: boolean;
    isInMove: boolean;
    location: Location;
    maxHp: number;
    name: string;
    size: number;
    sprites: string;
    hpLost: number;
    spellEffect: string;
    currentSpellPower: number;
    maxSpellPower: number;
    class: string;
    avatar: string;
}

export interface SpriteSheet {
    spriteHeight: number;
    spriteWidth: number;
    image: string;
    movementDown: SpriteSheetCoordinates;
    movementRight: SpriteSheetCoordinates;
    movementUp: SpriteSheetCoordinates;
    movementLeft: SpriteSheetCoordinates;
    standingDown: SpriteSheetCoordinates;
    standingRight: SpriteSheetCoordinates;
    standingUp: SpriteSheetCoordinates;
    standingLeft: SpriteSheetCoordinates;
    dead: SpriteSheetCoordinates;
}

interface SpriteSheetCoordinates {
    yOffSet: number;
    xOffSet: number;
    spriteAmount: number;
}

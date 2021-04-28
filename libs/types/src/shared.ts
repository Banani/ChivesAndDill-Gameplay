export interface Location {
  x: number;
  y: number;
}

export enum CharacterDirection {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export interface Player {
  id: string;
  name: string;
  location: Location;
  direction: CharacterDirection;
  sprites: string;
  isInMove: boolean;
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
}

interface SpriteSheetCoordinates {
  yOffSet: number,
  xOffSet: number,
  spriteAmount: number,
}

export interface Spell {
  projectileId: string;
  name: string;
  angle: number;
  newLocation: Location;
}

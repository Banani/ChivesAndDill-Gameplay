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
   currentHp: number;
   direction: CharacterDirection;
   id: string;
   isDead: boolean;
   isInMove: boolean;
   location: Location;
   maxHp: number;
   name: string;
   size: number;
   socketId: string;
   sprites: string;
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

export interface Projectile {
   projectileId: string;
   name: string;
   angle: number;
   newLocation: Location;
}

export interface Spell {
   cooldown: number;
   damage: number;
   name: string;
   range: number;
   speed: number;
   type: string;
   image: string;
   description: string;
}

export interface Location {
    x: number;
    y: number;
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

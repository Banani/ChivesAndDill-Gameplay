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

export interface Quest {
   id: string;
   name: string;
   description: string;
   questStage: {
      description: string,
      id: string
      stageParts: Record<string, StagePart>
   }
}

interface StagePart {
   amount: number,
   id: string,
   questId: string,
   stageId: string,
   type: number,
   rule: {
      fieldName: string;
      comparison: KillingQuestStagePartComparison;
      value: string;
   }[];
   targetLocation: Location,
   description: string,
   currentProgress: number,
}

export enum KillingQuestStagePartComparison {
   equality = 'equality',
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

export interface Spell {
   projectileId: string;
   name: string;
   angle: number;
   newLocation: Location;
}

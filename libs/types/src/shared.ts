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
   sprites: string;
   hpLost: number;
   spellEffect: string;
   currentSpellPower: number;
   maxSpellPower: number;
   class: string;
   avatar: string;
}

export interface Quest {
   id: string;
   name: string;
   description: string;
   questStage: {
      description: string;
      id: string;
      stageParts: Record<string, StagePart>;
   };
}

interface StagePart {
   amount: number;
   id: string;
   questId: string;
   stageId: string;
   type: number;
   rule: {
      fieldName: string;
      comparison: KillingQuestStagePartComparison;
      value: string;
   }[];
   targetLocation: Location;
   description: string;
   currentProgress: number;
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

export interface Projectile {
   projectileId: string;
   spell: string;
   angle: number;
   newLocation: Location;
   currentLocation: Location;
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
   channelTime: number;
   spellPowerCost: number;
}

export interface ActiveSpellCast {
   casterid: number;
   castTime: number;
   spellCastTimeStamp: number;
}

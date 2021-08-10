import type { Location } from './common/Location';
import type { CharacterDirection } from './shared';

export interface EnginePackage {
   characterMovements: {
      data: Record<string, Partial<CharacterMovement>>;
      toDelete: string[];
   };
   projectileMovements: {
      data: Record<string, Partial<ProjectileMovement>>;
      toDelete: string[];
   };
}

export interface GlobalStore {
   characterMovements: Record<string, CharacterMovement>;
   projectileMovements: Record<string, ProjectileMovement>;
   spellChannels: Record<string, ChannelingTrack>;
   characterPowerPoints: Record<string, PowerPointsTrack>;
   timeEffects: Record<string, TimeEffect>;
   areaTimeEffects: Record<string, AreaTimeEffect>;
}

export interface CharacterMovement {
   location: Location;
   isInMove: boolean;
   direction: CharacterDirection;
}

export interface ProjectileMovement {
   location: Location;
   angle: number;
   spellName: string;
}

export interface ChannelingTrack {
   channelId: string;
   casterId: string;
   castingStartedTimestamp: number;
   timeToCast: number;
}

export interface PowerPointsTrack {
   currentHp: number;
   maxHp: number;
   currentSpellPower: number;
   maxSpellPower: number;
}

export enum TimeEffectType {
   BUFF,
   DEBUFF,
}

export interface TimeEffect {
   id: string;
   period: number;
   name: string;
   description: string;
   timeEffectType: TimeEffectType;
   iconImage: string;
   creationTime: number;
   targetId: string;
}

export interface AreaTimeEffect {
   id: string;
   name: string;
   location: Location;
   radius: number;
}

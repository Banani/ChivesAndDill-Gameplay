import type { Location } from './common/Location';
import type { CharacterDirection } from './shared';

export interface EnginePackage {
   characterMovements: PartialEnginePackage<CharacterMovement>;
   projectileMovements: PartialEnginePackage<ProjectileMovement>;
   spellChannels: PartialEnginePackage<ChannelingTrack>;
   characterPowerPoints: PartialEnginePackage<PowerPointsTrack>;
   timeEffects: PartialEnginePackage<TimeEffect>;
   areaTimeEffects: PartialEnginePackage<AreaTimeEffect>;
   spells: PartialEnginePackage<null>;
}

interface PartialEnginePackage<Data, Event = null> {
   data: Record<string, Data>;
   toDelete: string[];
   events: Record<string, Event>;
}

interface StoreModule<Data> {
   data: Record<string, Data>;
   events: Record<string, Event>;
}

export interface GlobalStore {
   characterMovements: StoreModule<CharacterMovement>;
   projectileMovements: StoreModule<ProjectileMovement>;
   spellChannels: StoreModule<ChannelingTrack>;
   characterPowerPoints: StoreModule<PowerPointsTrack>;
   timeEffects: StoreModule<TimeEffect>;
   areaTimeEffects: StoreModule<AreaTimeEffect>;
   spells: StoreModule<null>;
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

export enum EngineEventType {
   SpellLanded = 'SpellLanded',
}

export type EngineEvent = SpellLandedEvent;

export interface SpellLandedEvent {
   type: EngineEventType.SpellLanded;
   spellName: string;
   angle: number;
   castLocation: Location;
   directionLocation: Location;
}

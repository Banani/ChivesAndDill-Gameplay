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

interface PartialEnginePackage<Data> {
   data: Record<string, Data>;
   toDelete: string[];
   events: Record<string, EngineEvent>;
}

interface StoreModule<Data> {
   data: Record<string, Data>;
   events: Record<string, EngineEvent>;
}

export enum GlobalStoreModule {
   CHARACTER_MOVEMENTS = 'characterMovements',
   PROJECTILE_MOVEMENTS = 'projectileMovements',
   SPELL_CHANNELS = 'spellChannels',
   CHARACTER_POWER_POINTS = 'characterPowerPoints',
   TIME_EFFECTS = 'timeEffects',
   AREA_TIME_EFFECTS = 'areaTimeEffects',
   SPELLS = 'spells',
}

export interface GlobalStore {
   [GlobalStoreModule.CHARACTER_MOVEMENTS]: StoreModule<CharacterMovement>;
   [GlobalStoreModule.PROJECTILE_MOVEMENTS]: StoreModule<ProjectileMovement>;
   [GlobalStoreModule.SPELL_CHANNELS]: StoreModule<ChannelingTrack>;
   [GlobalStoreModule.CHARACTER_POWER_POINTS]: StoreModule<PowerPointsTrack>;
   [GlobalStoreModule.TIME_EFFECTS]: StoreModule<TimeEffect>;
   [GlobalStoreModule.AREA_TIME_EFFECTS]: StoreModule<AreaTimeEffect>;
   [GlobalStoreModule.SPELLS]: StoreModule<null>;
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
   spell: any;
   angle: number;
   castLocation: Location;
   directionLocation: Location;
}

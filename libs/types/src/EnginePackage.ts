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
   [GlobalStoreModule.POWER_STACKS]: PartialEnginePackage<Partial<Record<PowerStackType, number>>>;
   [GlobalStoreModule.ABSORB_SHIELDS]: PartialEnginePackage<AbsorbShieldTrack>;
   [GlobalStoreModule.CHARACTER]: PartialEnginePackage<any>; // TODO: PlayerCharacter
   [GlobalStoreModule.ACTIVE_CHARACTER]: PartialEnginePackage<string>;
   [GlobalStoreModule.AREAS]: PartialEnginePackage<number[][]>;
}

interface PartialEnginePackage<Data> {
   data: Record<string, Data>;
   toDelete: string[];
   events: EnginePackageEvent[];
}

interface StoreModule<Data> {
   data: Record<string, Data>;
   events: EnginePackageEvent[];
}

export enum GlobalStoreModule {
   CHARACTER = 'character',
   ACTIVE_CHARACTER = 'activeCharacter',
   CHARACTER_MOVEMENTS = 'characterMovements',
   PROJECTILE_MOVEMENTS = 'projectileMovements',
   SPELL_CHANNELS = 'spellChannels',
   CHARACTER_POWER_POINTS = 'characterPowerPoints',
   TIME_EFFECTS = 'timeEffects',
   AREA_TIME_EFFECTS = 'areaTimeEffects',
   SPELLS = 'spells',
   POWER_STACKS = 'powerStacks',
   ABSORB_SHIELDS = 'absorbShields',
   PLAYER = 'player',
   AREAS = 'areas',
}

export interface GlobalStore {
   [GlobalStoreModule.CHARACTER_MOVEMENTS]: StoreModule<CharacterMovement>;
   [GlobalStoreModule.PROJECTILE_MOVEMENTS]: StoreModule<ProjectileMovement>;
   [GlobalStoreModule.SPELL_CHANNELS]: StoreModule<ChannelingTrack>;
   [GlobalStoreModule.CHARACTER_POWER_POINTS]: StoreModule<PowerPointsTrack>;
   [GlobalStoreModule.TIME_EFFECTS]: StoreModule<TimeEffect>;
   [GlobalStoreModule.AREA_TIME_EFFECTS]: StoreModule<AreaTimeEffect>;
   [GlobalStoreModule.SPELLS]: StoreModule<null>;
   [GlobalStoreModule.POWER_STACKS]: StoreModule<Partial<Record<PowerStackType, number>>>;
   [GlobalStoreModule.ABSORB_SHIELDS]: StoreModule<AbsorbShieldTrack>;
   [GlobalStoreModule.PLAYER]: StoreModule<undefined>;

   [GlobalStoreModule.CHARACTER]: StoreModule<any>; // TODO: PlayerCharacter
   [GlobalStoreModule.ACTIVE_CHARACTER]: StoreModule<string>;
   [GlobalStoreModule.AREAS]: StoreModule<number[][]>;
}

export interface ActiveCharacterStorePart {
   activeCharacterId: string;
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
   BUFF = 'BUFF',
   DEBUFF = 'DEBUFF',
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
   PlayerCreated = 'PlayerCreated',
   SpellLanded = 'SpellLanded',
   CharacterGotHp = 'CharacterGotHp',
   CharacterLostHp = 'CharacterLostHp',
   DamageAbsorbed = 'DamageAbsorbed',
}

export interface PlayerCreatedEvent {
   type: EngineEventType.PlayerCreated;
}

export interface SpellLandedEvent {
   type: EngineEventType.SpellLanded;
   spell: any;
   angle: number;
   castLocation: Location;
   directionLocation: Location;
}

export interface CharacterGotHpEvent {
   type: EngineEventType.CharacterGotHp;
   characterId: string;
   source: HealthPointsSource;
   amount: number;
}

export interface CharacterLostHpEvent {
   type: EngineEventType.CharacterLostHp;
   characterId: string;
   amount: number;
}

export interface DamageAbsorbedEvent {
   type: EngineEventType.DamageAbsorbed;
   characterId: string;
}

export type EnginePackageEvent = SpellLandedEvent | CharacterGotHpEvent | CharacterLostHpEvent | DamageAbsorbedEvent | PlayerCreatedEvent;

export enum HealthPointsSource {
   Healing = 'Healing',
   Regeneration = 'Regeneration',
   CharacterReset = 'CharacterReset',
}

export interface PowerStackTrack {
   powerStackType: PowerStackType;
   amount: number;
}

export enum PowerStackType {
   HolyPower = 'HolyPower',
}

export interface AbsorbShieldTrack {
   id: string;
   name: string;
   ownerId: string;
   value: number;
   timeEffectType: TimeEffectType;
   period: number;
   iconImage: string;
   creationTime: number;
}

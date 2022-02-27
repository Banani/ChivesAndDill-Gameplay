import type { Location } from './common/Location';
import type { CharacterDirection } from './shared';

export enum GlobalStoreModule {
   CHARACTER = 'character',
   ACTIVE_CHARACTER = 'activeCharacter',
   AREA_TIME_EFFECTS = 'areaTimeEffects',
   CHARACTER_MOVEMENTS = 'characterMovements',
   PROJECTILE_MOVEMENTS = 'projectileMovements',
   SPELL_CHANNELS = 'spellChannels',
   CHARACTER_POWER_POINTS = 'characterPowerPoints',
   CHARACTER_EFFECT_NOTIFIER = 'characterEffectNotifier',
   TIME_EFFECTS = 'timeEffects',
   SPELLS = 'spells',
   POWER_STACKS = 'powerStacks',
   ABSORB_SHIELDS = 'absorbShields',
   PLAYER = 'player',
   PLAYER_MOVEMENT = 'playerMovement',
   AREAS = 'areas',
   MAP_SCHEMA = 'mapSchema',
   QUESTS = 'quests',
   EXPERIENCE = 'experience',
   CURRENCY = 'currency',
   ACTIVE_LOOT = 'activeLoot',
   CORPSE_DROP = 'corpseDrop',
   ERROR_MESSAGES = 'errorMessages',
}

interface PartialEnginePackage<Data> {
   data: Record<string, Data>;
   toDelete: string[];
   events: EnginePackageEvent[];
}

export interface EnginePackage {
   [GlobalStoreModule.CHARACTER_MOVEMENTS]: PartialEnginePackage<CharacterMovement>;
   [GlobalStoreModule.PROJECTILE_MOVEMENTS]: PartialEnginePackage<ProjectileMovement>;
   [GlobalStoreModule.SPELL_CHANNELS]: PartialEnginePackage<ChannelingTrack>;
   [GlobalStoreModule.CHARACTER_POWER_POINTS]: PartialEnginePackage<PowerPointsTrack>;
   [GlobalStoreModule.TIME_EFFECTS]: PartialEnginePackage<TimeEffect>;
   [GlobalStoreModule.AREA_TIME_EFFECTS]: PartialEnginePackage<AreaTimeEffect>;
   [GlobalStoreModule.SPELLS]: PartialEnginePackage<null>;
   [GlobalStoreModule.POWER_STACKS]: PartialEnginePackage<Partial<Record<PowerStackType, number>>>;
   [GlobalStoreModule.ABSORB_SHIELDS]: PartialEnginePackage<AbsorbShieldTrack>;
   [GlobalStoreModule.CHARACTER]: PartialEnginePackage<any>; // TODO: PlayerCharacter
   [GlobalStoreModule.ACTIVE_CHARACTER]: PartialEnginePackage<string>;
   [GlobalStoreModule.AREAS]: PartialEnginePackage<number[][]>;
   [GlobalStoreModule.MAP_SCHEMA]: PartialEnginePackage<MapSchema | MapDefinition>;
   [GlobalStoreModule.ACTIVE_LOOT]: PartialEnginePackage<ActiveLootTrack>;
   [GlobalStoreModule.ERROR_MESSAGES]: PartialEnginePackage<undefined>;
}

interface StoreModule<Data> {
   data: Record<string, Data>;
   events: EnginePackageEvent[];
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
   [GlobalStoreModule.MAP_SCHEMA]: StoreModule<MapSchema | MapDefinition>;
   [GlobalStoreModule.ACTIVE_LOOT]: StoreModule<ActiveLootTrack>;
   [GlobalStoreModule.ERROR_MESSAGES]: PartialEnginePackage<undefined>;
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

export interface ExperienceExternalTrack {
   experienceAmount: number;
   level: number;
   toNextLevel: number;
}

export enum DropItemType {
   CURRENCY,
}

export interface DropCurrency {
   type: DropItemType.CURRENCY;
   name: string;
}

export type DropItem = DropCurrency; // OR DropObject

export interface CorpseDroppedItemStack {
   amount: number;
   item: DropItem;
}

export type CorpseDropTrack = Record<string, CorpseDroppedItemStack>;

export interface ActiveLootTrack {
   corpseId: string;
   items: CorpseDropTrack;
}

export enum EngineEventType {
   PlayerCreated = 'PlayerCreated',
   SpellLanded = 'SpellLanded',
   SpellCasted = 'SpellCasted',
   CharacterGotHp = 'CharacterGotHp',
   CharacterLostHp = 'CharacterLostHp',
   DamageAbsorbed = 'DamageAbsorbed',
   LevelChanged = 'LevelChanged',
   ExperienceGain = 'ExperienceGain',
   ErrorMessage = 'ErrorMessage',
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

export interface SpellCastedEvent {
   type: EngineEventType.SpellCasted;
   spell: any;
   casterId: string;
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

export interface LevelChangedEvent {
   type: EngineEventType.LevelChanged;
   characterId: string;
   level: number;
}

export interface ExperienceGainEvent {
   type: EngineEventType.ExperienceGain;
   characterId: string;
   amount: number;
}

export interface MapSchema {
   [key: string]: {
      path: string;
      location: Location;
   };
}
export interface MapDefinition {
   [key: string]: string[];
}

export interface ErrorMessage {
   type: EngineEventType.ErrorMessage;
   message: string;
}

export type EnginePackageEvent =
   | SpellLandedEvent
   | SpellCastedEvent
   | CharacterGotHpEvent
   | CharacterLostHpEvent
   | DamageAbsorbedEvent
   | PlayerCreatedEvent
   | LevelChangedEvent
   | ExperienceGainEvent
   | ErrorMessage;

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

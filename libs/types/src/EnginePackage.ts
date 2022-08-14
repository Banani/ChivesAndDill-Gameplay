import { ActiveNpcConversation, BackpackItemsSpot, BackpackTrack, ChatMessage, EngineItemMessages, EngineNpcAction, ItemTemplate, NpcStock } from '.';
import { CharacterEvents } from './CharacterPackage';
import { ChatChannel, EngineChatAction } from './ChatPackage';
import type { Location } from './common/Location';
import { CommonClientActions, CommonClientMessages } from './engineEvents';
import { QuestSchema } from './QuestPackage';
import type { CharacterDirection } from './shared';

export enum GlobalStoreModule {
   CHARACTER = 'character',
   ACTIVE_CHARACTER = 'activeCharacter',
   AREA_TIME_EFFECTS = 'areaTimeEffects',
   CHARACTER_MOVEMENTS = 'characterMovements',
   PROJECTILE_MOVEMENTS = 'projectileMovements',
   SPELL_CHANNELS = 'spellChannels',
   CHARACTER_POWER_POINTS = 'characterPowerPoints',
   TIME_EFFECTS = 'timeEffects',
   SPELLS = 'spells',
   POWER_STACKS = 'powerStacks',
   ABSORB_SHIELDS = 'absorbShields',
   PLAYER = 'player',
   AREAS = 'areas',
   MAP_SCHEMA = 'mapSchema',
   EXPERIENCE = 'experience',
   CURRENCY = 'currency',
   ACTIVE_LOOT = 'activeLoot',
   CORPSE_DROP = 'corpseDrop',
   ERROR_MESSAGES = 'errorMessages',
   CHAT_CHANNEL = 'chatChannel',
   CHAT_MESSAGES = 'chatMessages',
   BACKPACK_SCHEMA = 'backpackSchema',
   BACKPACK_ITEMS = 'backpackItems',
   ITEMS = 'items',
   NPC_CONVERSATION = 'npcConversation',
   NPC_STOCK = 'npcStock',
   QUEST_DEFINITION = 'questDefinition',
   QUEST_PROGRESS = 'questProgress',
   NPC_QUESTS = 'npcQuests',
}

export interface PartialEnginePackage<Data> {
   data: Record<string, Data>;
   toDelete: {};
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
   [GlobalStoreModule.CHAT_CHANNEL]: PartialEnginePackage<ChatChannel>;
   [GlobalStoreModule.CHAT_MESSAGES]: PartialEnginePackage<ChatMessage>;
   [GlobalStoreModule.EXPERIENCE]: PartialEnginePackage<ExperienceExternalTrack>;
   [GlobalStoreModule.CURRENCY]: PartialEnginePackage<number>;
   [GlobalStoreModule.BACKPACK_SCHEMA]: PartialEnginePackage<BackpackTrack>;
   [GlobalStoreModule.BACKPACK_ITEMS]: PartialEnginePackage<BackpackItemsSpot>;
   [GlobalStoreModule.ITEMS]: PartialEnginePackage<ItemTemplate>;
   [GlobalStoreModule.NPC_CONVERSATION]: PartialEnginePackage<ActiveNpcConversation>;
   [GlobalStoreModule.NPC_STOCK]: PartialEnginePackage<NpcStock>;
   [GlobalStoreModule.QUEST_DEFINITION]: PartialEnginePackage<QuestSchema>;
   [GlobalStoreModule.NPC_QUESTS]: PartialEnginePackage<Record<string, boolean>>;
   [GlobalStoreModule.QUEST_PROGRESS]: PartialEnginePackage<any>;
   [GlobalStoreModule.CORPSE_DROP]: PartialEnginePackage<boolean>;
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
   [GlobalStoreModule.ERROR_MESSAGES]: StoreModule<undefined>;
   [GlobalStoreModule.CHAT_CHANNEL]: StoreModule<ChatChannel>;
   [GlobalStoreModule.CHAT_MESSAGES]: StoreModule<ChatMessage>;
   [GlobalStoreModule.EXPERIENCE]: StoreModule<ExperienceExternalTrack>;
   [GlobalStoreModule.CURRENCY]: StoreModule<number>;
   [GlobalStoreModule.BACKPACK_SCHEMA]: StoreModule<BackpackTrack>;
   [GlobalStoreModule.BACKPACK_ITEMS]: StoreModule<BackpackItemsSpot>;
   [GlobalStoreModule.ITEMS]: StoreModule<ItemTemplate>;
   [GlobalStoreModule.NPC_CONVERSATION]: StoreModule<ActiveNpcConversation>;
   [GlobalStoreModule.NPC_STOCK]: StoreModule<NpcStock>;
   [GlobalStoreModule.QUEST_DEFINITION]: StoreModule<QuestSchema>;
   [GlobalStoreModule.NPC_QUESTS]: StoreModule<Record<string, boolean>>;
   [GlobalStoreModule.QUEST_PROGRESS]: StoreModule<any>;
   [GlobalStoreModule.CORPSE_DROP]: StoreModule<boolean>;
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

export interface CorpseDroppedItemStack {
   amount: number;
   itemId: string;
}

export type CorpseDropTrack = {
   coins?: number;
   items?: Record<string, CorpseDroppedItemStack>;
};

export interface ActiveLootTrack {
   corpseId: string;
   corpseDropTrack: CorpseDropTrack;
}

export enum EngineEventType {
   PlayerCreated = 'PlayerCreated',
   SpellLanded = 'SpellLanded',
   SpellCasted = 'SpellCasted',
   CharacterGotHp = 'CharacterGotHp',
   CharacterLostHp = 'CharacterLostHp',
   DamageAbsorbed = 'DamageAbsorbed',
   LevelChanged = 'LevelChanged',
   ErrorMessage = 'ErrorMessage',

   CreateCharacter = 'CreateCharacter',
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

export type MapSchema = Record<
   string,
   {
      path: string;
      location: Location;
   }
>;

export interface MapDefinition {
   [key: string]: string[];
}

export interface ErrorMessage {
   type: EngineEventType.ErrorMessage;
   message: string;
}

export interface CreateCharacter {
   type: CommonClientMessages.CreateCharacter;
   name: string;
   class: any; // MOve classes
}

export interface PlayerStartMoveAction {
   type: CommonClientMessages.PlayerStartMove;
   y?: number;
   x?: number;
   source: string;
}

export interface PlayerStopMoveAction {
   type: CommonClientMessages.PlayerStopMove;
   source: string;
}

export type EnginePackageEvent =
   | SpellLandedEvent
   | SpellCastedEvent
   | CharacterGotHpEvent
   | CharacterLostHpEvent
   | DamageAbsorbedEvent
   | PlayerCreatedEvent
   | PlayerStartMoveAction
   | PlayerStopMoveAction
   | LevelChangedEvent
   | ErrorMessage
   | CreateCharacter
   | EngineChatAction
   | EngineItemMessages
   | CharacterEvents
   | EngineNpcAction
   | CommonClientActions;

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

import type {
    ActiveNpcConversation,
    BackpackItemsSpot,
    BackpackTrack,
    ChatMessage,
    EquipmentTrack,
    ItemTemplate,
    NpcStock,
    Party,
    SpellDefinition
} from '.';
import type {
    AbsorbShieldTrack,
    AreaTimeEffect,
    Attributes,
    ChannelingTrack,
    Character,
    CharacterClassPreview,
    CharacterClientActions,
    CharacterEvent,
    CharacterMovement,
    CorpseLoot,
    EngineCharacterAction,
    EngineGroupAction,
    EngineItemAction,
    EngineNpcAction,
    EnginePlayerAction,
    EngineSpellAction,
    ExperienceExternalTrack,
    GroupClientActions,
    ItemClientActions,
    MonsterCorpse,
    NpcClientActions,
    PlayerClientActions,
    PlayerEvent,
    PowerPointsTrack,
    PowerStackType,
    ProjectileMovement,
    SpellClientActions,
    SpellEvent,
    TimeEffect
} from './modules';
import type { ChatChannel, ChatChannelClientActions, EngineChatAction } from './modules/ChatPackage';
import { MapDefinition, MapSchema } from './modules/MapPackage';
import { ExternalQuestProgress, QuestSchema } from './modules/QuestPackage';

export enum GlobalStoreModule {
    CHARACTER = 'character',
    CHARACTER_CLASS = 'characterClass',
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
    MAP_SCHEMA = 'mapSchema',
    EXPERIENCE = 'experience',
    CURRENCY = 'currency',
    ACTIVE_LOOT = 'activeLoot',
    CORPSE_DROP = 'corpseDrop',
    ERROR_MESSAGES = 'errorMessages',
    CHAT_CHANNEL = 'chatChannel',
    CHAT_MESSAGES = 'chatMessages',
    EQUIPMENT = 'equipment',
    BACKPACK_SCHEMA = 'backpackSchema',
    BACKPACK_ITEMS = 'backpackItems',
    ITEMS = 'items',
    NPC_CONVERSATION = 'npcConversation',
    NPC_STOCK = 'npcStock',
    QUEST_DEFINITION = 'questDefinition',
    QUEST_PROGRESS = 'questProgress',
    NPC_QUESTS = 'npcQuests',
    ATTRIBUTES = 'attributes',
    COMBAT_STATE = 'combatState',
    AVAILABLE_SPELLS = 'availableSpells',
    SPELL_DEFINITION = 'spellDefinition',
    SPELL_CAST_TIME = 'spellCastTime',
    PARTY = 'party',
    PARTY_INVITATION = 'partyInvitation'
}

export interface PartialEnginePackage<Data> {
    data: Record<string, Data>;
    toDelete: {};
    events: ReceivedEnginePackageEvent[];
}

export interface EnginePackage {
    [GlobalStoreModule.CHARACTER_MOVEMENTS]: PartialEnginePackage<CharacterMovement>;
    [GlobalStoreModule.CHARACTER_CLASS]: PartialEnginePackage<CharacterClassPreview>;
    [GlobalStoreModule.PROJECTILE_MOVEMENTS]: PartialEnginePackage<ProjectileMovement>;
    [GlobalStoreModule.SPELL_CHANNELS]: PartialEnginePackage<ChannelingTrack>;
    [GlobalStoreModule.CHARACTER_POWER_POINTS]: PartialEnginePackage<PowerPointsTrack>;
    [GlobalStoreModule.TIME_EFFECTS]: PartialEnginePackage<TimeEffect>;
    [GlobalStoreModule.AREA_TIME_EFFECTS]: PartialEnginePackage<AreaTimeEffect>;
    [GlobalStoreModule.SPELLS]: PartialEnginePackage<null>;
    [GlobalStoreModule.POWER_STACKS]: PartialEnginePackage<Partial<Record<PowerStackType, number>>>;
    [GlobalStoreModule.ABSORB_SHIELDS]: PartialEnginePackage<AbsorbShieldTrack>;
    [GlobalStoreModule.CHARACTER]: PartialEnginePackage<Character>;
    [GlobalStoreModule.ACTIVE_CHARACTER]: PartialEnginePackage<string>;
    [GlobalStoreModule.MAP_SCHEMA]: PartialEnginePackage<MapSchema | MapDefinition>;
    [GlobalStoreModule.ACTIVE_LOOT]: PartialEnginePackage<CorpseLoot>;
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
    [GlobalStoreModule.QUEST_PROGRESS]: PartialEnginePackage<ExternalQuestProgress>;
    [GlobalStoreModule.CORPSE_DROP]: PartialEnginePackage<MonsterCorpse>;
    [GlobalStoreModule.EQUIPMENT]: PartialEnginePackage<EquipmentTrack>;
    [GlobalStoreModule.ATTRIBUTES]: PartialEnginePackage<Attributes>;
    [GlobalStoreModule.COMBAT_STATE]: PartialEnginePackage<boolean>;
    [GlobalStoreModule.AVAILABLE_SPELLS]: PartialEnginePackage<boolean>;
    [GlobalStoreModule.SPELL_DEFINITION]: PartialEnginePackage<SpellDefinition>;
    [GlobalStoreModule.SPELL_CAST_TIME]: PartialEnginePackage<number>;
    [GlobalStoreModule.PARTY]: PartialEnginePackage<Party>;
    [GlobalStoreModule.PARTY_INVITATION]: PartialEnginePackage<string>;
}

interface StoreModule<Data> {
    data: Record<string, Data>;
    events: EnginePackageEvent[];
    lastUpdateTime: number;
    recentData: Record<string, Data>;
    lastUpdateEventTime: number;
}

export interface GlobalStore {
    [GlobalStoreModule.CHARACTER_MOVEMENTS]: StoreModule<CharacterMovement>;
    [GlobalStoreModule.CHARACTER_CLASS]: StoreModule<CharacterClassPreview>;
    [GlobalStoreModule.PROJECTILE_MOVEMENTS]: StoreModule<ProjectileMovement>;
    [GlobalStoreModule.SPELL_CHANNELS]: StoreModule<ChannelingTrack>;
    [GlobalStoreModule.CHARACTER_POWER_POINTS]: StoreModule<PowerPointsTrack>;
    [GlobalStoreModule.TIME_EFFECTS]: StoreModule<TimeEffect>;
    [GlobalStoreModule.AREA_TIME_EFFECTS]: StoreModule<AreaTimeEffect>;
    [GlobalStoreModule.SPELLS]: StoreModule<null>;
    [GlobalStoreModule.POWER_STACKS]: StoreModule<Partial<Record<PowerStackType, number>>>;
    [GlobalStoreModule.ABSORB_SHIELDS]: StoreModule<AbsorbShieldTrack>;
    [GlobalStoreModule.PLAYER]: StoreModule<undefined>;
    [GlobalStoreModule.CHARACTER]: StoreModule<Character>;
    [GlobalStoreModule.ACTIVE_CHARACTER]: StoreModule<string>;
    [GlobalStoreModule.MAP_SCHEMA]: StoreModule<MapSchema | MapDefinition>;
    [GlobalStoreModule.ACTIVE_LOOT]: StoreModule<CorpseLoot>;
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
    [GlobalStoreModule.QUEST_PROGRESS]: StoreModule<ExternalQuestProgress>;
    [GlobalStoreModule.CORPSE_DROP]: StoreModule<MonsterCorpse>;
    [GlobalStoreModule.EQUIPMENT]: StoreModule<EquipmentTrack>;
    [GlobalStoreModule.ATTRIBUTES]: StoreModule<Attributes>;
    [GlobalStoreModule.COMBAT_STATE]: StoreModule<boolean>;
    [GlobalStoreModule.AVAILABLE_SPELLS]: StoreModule<boolean>;
    [GlobalStoreModule.SPELL_DEFINITION]: StoreModule<SpellDefinition>;
    [GlobalStoreModule.SPELL_CAST_TIME]: StoreModule<number>;
    [GlobalStoreModule.PARTY]: StoreModule<Party>;
    [GlobalStoreModule.PARTY_INVITATION]: StoreModule<string>;
}

export type EnginePackageEvent = CharacterEvent |
    SpellEvent |
    PlayerEvent;

export type ReceivedEnginePackageEvent = EnginePackageEvent & { id: string };

export type EngineClientAction = CharacterClientActions |
    ChatChannelClientActions |
    GroupClientActions |
    ItemClientActions |
    NpcClientActions |
    PlayerClientActions |
    SpellClientActions;

export type EngineAction = EngineCharacterAction |
    EngineChatAction |
    EngineGroupAction |
    EngineItemAction |
    EngineNpcAction |
    EnginePlayerAction |
    EngineSpellAction;


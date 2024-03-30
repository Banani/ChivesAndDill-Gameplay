import { Location } from '../shared';

export enum CharacterType {
    Player = 'Player',
    Monster = 'Monster',
    Npc = 'Npc',
}

export enum CharacterDirection {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

export interface Character {
    type: CharacterType;
    id: string;
    name: string;
    sprites: string; // Should be an object
    size: number; // Should be in that object
    avatar: string;
    location: Location;
    direction: CharacterDirection;
    movementSpeed: number;
    isDead: boolean;
    isInMove: boolean;
    healthPointsRegeneration: number;
    spellPowerRegeneration: number;
}

export interface CharacterMovement {
    location: Location;
    isInMove: boolean;
    direction: CharacterDirection;
}

export enum Attribute {
    Stamina = "stamina",
    Agility = "agility",
    Intelect = "intelect",
    Strength = "strength",
    Spirit = "spirit",
}

export interface Attributes {
    armor: number;
    stamina: number;
    agility: number;
    intelect: number;
    strength: number;
    spirit: number;
}

export interface QuotesEvents {
    standard?: QuoteHandler;
    onKilling?: QuoteHandler;
    onDying?: QuoteHandler;
    onPulling?: QuoteHandler;
}

export interface QuoteHandler {
    chance: number;
    quotes: string[];
}

export interface PowerPointsTrack {
    currentHp: number;
    maxHp: number;
    currentSpellPower: number;
    maxSpellPower: number;
}

export enum ExperienceGainSource {
    MonsterKill = 'MonsterKill',
    QuestCompleted = 'QuestCompleted',
}

export interface ExperienceGainFromKillingMonster {
    type: ExperienceGainSource.MonsterKill;
    monsterId: string;
}

export interface ExperienceGainFromQuest {
    type: ExperienceGainSource.QuestCompleted;
}

export interface ExperienceExternalTrack {
    experienceAmount: number;
    level: number;
    toNextLevel: number;
}

export type ExperienceGainDetails = ExperienceGainFromKillingMonster | ExperienceGainFromQuest;

export enum HealthPointsSource {
    Healing = 'Healing',
    Regeneration = 'Regeneration',
    CharacterReset = 'CharacterReset',
}

export interface MonsterCorpse {
    location: Location;
    monsterTemplateId: string;
}

export interface CorpseDropTrack {
    corpse: MonsterCorpse;
    loot: CorpseLoot;
}

export interface CorpseDroppedItemStack {
    amount: number;
    itemTemplateId: string;
}

export interface CorpseLoot {
    coins?: number;
    items?: Record<string, CorpseDroppedItemStack>;
}

export enum CharacterClientEvents {
    ExperienceGain = 'ExperienceGain',
    CharacterGotHp = 'CharacterGotHp',
    CharacterLostHp = 'CharacterLostHp',
    LevelChanged = 'LevelChanged',
    // TODO: TO DO SPELL MODULE
    DamageAbsorbed = 'DamageAbsorbed',
}

export interface ExperienceGainEvent {
    type: CharacterClientEvents.ExperienceGain;
    characterId: string;
    amount: number;
    experienceGainDetails: ExperienceGainDetails;
}

export interface CharacterGotHpEvent {
    type: CharacterClientEvents.CharacterGotHp;
    characterId: string;
    source: HealthPointsSource;
    amount: number;
    healerId: string;
    spellId: string;
}

export interface CharacterLostHpEvent {
    type: CharacterClientEvents.CharacterLostHp;
    characterId: string;
    amount: number;
    spellId: string;
    attackerId: string;
}

export interface DamageAbsorbedEvent {
    type: CharacterClientEvents.DamageAbsorbed;
    characterId: string;
}

export interface LevelChangedEvent {
    type: CharacterClientEvents.LevelChanged;
    characterId: string;
    level: number;
}

export type CharacterEvent = ExperienceGainEvent | CharacterGotHpEvent | CharacterLostHpEvent | DamageAbsorbedEvent | LevelChangedEvent;

export enum CharacterClientActions {
    PlayerStartMove = 'PlayerStartMove',
    PlayerStopMove = 'PlayerStopMove',
}

export interface PlayerMovement {
    y?: number;
    x?: number;
    source: string;
}

export interface PlayerStartMove {
    type: CharacterClientActions.PlayerStartMove;
    movement: PlayerMovement;
}

export interface PlayerStopMove {
    type: CharacterClientActions.PlayerStopMove;
    source: string;
}

export type EngineCharacterAction = PlayerStartMove | PlayerStopMove;

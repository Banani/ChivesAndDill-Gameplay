import { Location } from './shared';

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

export enum CharacterClientEvents {
    ExperienceGain = 'ExperienceGain',
}

export enum ExperienceGainSource {
    MonsterKill = 'MonsterKill',
    QuestCompleted = 'QuestCompleted',
}

export interface MonsterCorpse {
    location: Location;
    monsterTemplateId: string;
}

export interface ExperienceGainFromKillingMonster {
    type: ExperienceGainSource.MonsterKill;
    monsterId: string;
}

export interface ExperienceGainFromQuest {
    type: ExperienceGainSource.QuestCompleted;
}

export type ExperienceGainDetails = ExperienceGainFromKillingMonster | ExperienceGainFromQuest;

export interface ExperienceGainEvent {
    type: CharacterClientEvents.ExperienceGain;
    characterId: string;
    amount: number;
    experienceGainDetails: ExperienceGainDetails;
}

export type CharacterEvents = ExperienceGainEvent;

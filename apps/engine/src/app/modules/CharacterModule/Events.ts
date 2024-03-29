import { Attributes, ExperienceGainDetails, HealthPointsSource, MonsterCorpse, PowerPointsTrack } from '@bananos/types';
import { EngineEvent, EngineEventHandler } from '../../types';
import { CharacterUnion } from '../../types/CharacterUnion';
import { ExperienceTrack } from './types';

export enum CharacterEngineEvents {
    CreateCharacter = 'CreateCharacter',
    NewCharacterCreated = 'NewCharacterCreated',
    RemoveCharacter = 'RemoveCharacter',
    CharacterRemoved = 'CharacterRemoved',

    CharacterLostHp = 'CharacterLostHp',
    CharacterGotHp = 'CharacterGotHp',
    CharacterLostSpellPower = 'CharacterLostSpellPower',
    CharacterGotSpellPower = 'CharacterGotSpellPower',

    TakeCharacterHealthPoints = 'TakeCharacterHealthPoints',
    AddCharacterHealthPoints = 'AddCharacterHealthPoints',
    TakeCharacterSpellPower = 'TakeCharacterSpellPower',
    AddCharacterSpellPower = 'AddCharacterSpellPower',

    ResetCharacter = 'ResetCharacter',
    NewPowerTrackCreated = 'NewPowerTrackCreated',

    ExperienceTrackCreated = 'ExperienceTrackCreated',
    AddExperience = 'AddExperience',
    CharacterLevelChanged = 'CharacterLevelChanged',
    CharacterGainExperience = 'CharacterGainExperience',
    ExperienceTrackRemoved = 'ExperienceTrackRemoved',

    CorpseDropTrackCreated = 'CorpseDropTrackCreated',
    ItemWasPickedFromCorpse = 'ItemWasPickedFromCorpse',
    CoinsWerePickedFromCorpse = 'CoinsWerePickedFromCorpse',
    AllItemsWerePickedFromCorpse = 'AllItemsWerePickedFromCorpse',
    CorpseDropTrackRemoved = 'CorpseDropTrackRemoved',

    SendQuoteMessage = 'SendQuoteMessage',
    AttributesUpdated = 'AttributesUpdated',
}

export interface CreateCharacterEvent extends EngineEvent {
    type: CharacterEngineEvents.CreateCharacter;
    character: CharacterUnion;
}

export interface NewCharacterCreatedEvent extends EngineEvent {
    type: CharacterEngineEvents.NewCharacterCreated;
    character: CharacterUnion;
}

export interface RemoveCharacterEvent extends EngineEvent {
    type: CharacterEngineEvents.RemoveCharacter;
    character: CharacterUnion;
}

export interface CharacterRemovedEvent extends EngineEvent {
    type: CharacterEngineEvents.CharacterRemoved;
    character: CharacterUnion;
}

export interface CharacterLostHpEvent extends EngineEvent {
    characterId: string;
    amount: number;
    currentHp: number;
    spellId: string;
    attackerId: string;
}

export interface CharacterGotHpEvent extends EngineEvent {
    characterId: string;
    amount: number;
    currentHp: number;
    source: HealthPointsSource;
    spellId: string;
    healerId: string;
}

export interface CharacterLostSpellPowerEvent extends EngineEvent {
    characterId: string;
    amount: number;
    currentSpellPower: number;
}

export interface CharacterGotSpellPowerEvent extends EngineEvent {
    characterId: string;
    amount: number;
    currentSpellPower: number;
}

export interface TakeCharacterHealthPointsEvent extends EngineEvent {
    type: CharacterEngineEvents.TakeCharacterHealthPoints;
    attackerId: string | null;
    characterId: string;
    spellId: string;
    amount: number;
}

export interface AddCharacterHealthPointsEvent extends EngineEvent {
    casterId: string;
    characterId: string;
    amount: number;
    source: HealthPointsSource;
    spellId: string;
}

export interface TakeCharacterSpellPowerEvent extends EngineEvent {
    characterId: string;
    amount: number;
}

export interface AddCharacterSpellPowerEvent extends EngineEvent {
    characterId: string;
    amount: number;
}

export interface ResetCharacterEvent extends EngineEvent {
    type: CharacterEngineEvents.ResetCharacter;
    characterId: string;
}

export interface NewPowerTrackCreatedEvent extends EngineEvent {
    type: CharacterEngineEvents.NewPowerTrackCreated;
    characterId: string;
    powerPoints: PowerPointsTrack;
}

export interface ExperienceTrackCreatedEvent extends EngineEvent {
    type: CharacterEngineEvents.ExperienceTrackCreated;
    experienceTrack: ExperienceTrack;
    trackId: string;
}

export interface AddExperienceEvent extends EngineEvent {
    type: CharacterEngineEvents.AddExperience;
    amount: number;
    characterId: string;
    experienceGainDetails: ExperienceGainDetails;
}

export interface CharacterGainExperienceEvent extends EngineEvent {
    type: CharacterEngineEvents.CharacterGainExperience;
    characterId: string;
    amount: number;
    experienceTrack: ExperienceTrack;
    experienceGainDetails: ExperienceGainDetails;
}

export interface CharacterLevelChangedEvent extends EngineEvent {
    type: CharacterEngineEvents.CharacterLevelChanged;
    characterId: string;
    newLevel: number;
}

export interface ExperienceTrackRemovedEvent extends EngineEvent {
    type: CharacterEngineEvents.ExperienceTrackRemoved;
    trackId: string;
}

export interface CorpseDropTrackCreatedEvent extends EngineEvent {
    type: CharacterEngineEvents.CorpseDropTrackCreated;
    corpseId: string;
    characterCorpse: MonsterCorpse;
}

export interface ItemWasPickedFromCorpseEvent extends EngineEvent {
    type: CharacterEngineEvents.ItemWasPickedFromCorpse;
    corpseId: string;
    characterId: string;
    itemId: string;
}

export interface CoinsWerePickedFromCorpseEvent extends EngineEvent {
    type: CharacterEngineEvents.CoinsWerePickedFromCorpse;
    corpseId: string;
}

export interface AllItemsWerePickedFromCorpseEvent extends EngineEvent {
    type: CharacterEngineEvents.AllItemsWerePickedFromCorpse;
    corpseId: string;
}

export interface CorpseDropTrackRemovedEvent extends EngineEvent {
    type: CharacterEngineEvents.CorpseDropTrackRemoved;
    corpseId: string;
}

export interface SendQuoteMessageEvent extends EngineEvent {
    type: CharacterEngineEvents.SendQuoteMessage;
    characterId: string;
    message: string;
}

export interface AttributesUpdatedEvent extends EngineEvent {
    type: CharacterEngineEvents.AttributesUpdated;
    characterId: string;
    attributes: Attributes;
}

export interface CharacterEngineEventsMap {
    [CharacterEngineEvents.CreateCharacter]: EngineEventHandler<any>;
    [CharacterEngineEvents.NewCharacterCreated]: EngineEventHandler<NewCharacterCreatedEvent>;
    [CharacterEngineEvents.RemoveCharacter]: EngineEventHandler<RemoveCharacterEvent>;
    [CharacterEngineEvents.CharacterRemoved]: EngineEventHandler<CharacterRemovedEvent>;

    [CharacterEngineEvents.CharacterLostHp]: EngineEventHandler<CharacterLostHpEvent>;
    [CharacterEngineEvents.TakeCharacterHealthPoints]: EngineEventHandler<TakeCharacterHealthPointsEvent>;
    [CharacterEngineEvents.AddCharacterHealthPoints]: EngineEventHandler<AddCharacterHealthPointsEvent>;
    [CharacterEngineEvents.CharacterGotHp]: EngineEventHandler<CharacterGotHpEvent>;

    [CharacterEngineEvents.TakeCharacterSpellPower]: EngineEventHandler<TakeCharacterSpellPowerEvent>;
    [CharacterEngineEvents.AddCharacterSpellPower]: EngineEventHandler<AddCharacterSpellPowerEvent>;
    [CharacterEngineEvents.CharacterLostSpellPower]: EngineEventHandler<CharacterLostSpellPowerEvent>;
    [CharacterEngineEvents.CharacterGotSpellPower]: EngineEventHandler<CharacterGotSpellPowerEvent>;

    [CharacterEngineEvents.ResetCharacter]: EngineEventHandler<ResetCharacterEvent>;
    [CharacterEngineEvents.NewPowerTrackCreated]: EngineEventHandler<NewPowerTrackCreatedEvent>;

    [CharacterEngineEvents.ExperienceTrackCreated]: EngineEventHandler<ExperienceTrackCreatedEvent>;
    [CharacterEngineEvents.AddExperience]: EngineEventHandler<AddExperienceEvent>;
    [CharacterEngineEvents.CharacterGainExperience]: EngineEventHandler<CharacterGainExperienceEvent>;
    [CharacterEngineEvents.CharacterLevelChanged]: EngineEventHandler<CharacterLevelChangedEvent>;
    [CharacterEngineEvents.ExperienceTrackRemoved]: EngineEventHandler<ExperienceTrackRemovedEvent>;

    [CharacterEngineEvents.CorpseDropTrackCreated]: EngineEventHandler<CorpseDropTrackCreatedEvent>;
    [CharacterEngineEvents.ItemWasPickedFromCorpse]: EngineEventHandler<ItemWasPickedFromCorpseEvent>;
    [CharacterEngineEvents.CoinsWerePickedFromCorpse]: EngineEventHandler<CoinsWerePickedFromCorpseEvent>;
    [CharacterEngineEvents.AllItemsWerePickedFromCorpse]: EngineEventHandler<AllItemsWerePickedFromCorpseEvent>;
    [CharacterEngineEvents.CorpseDropTrackRemoved]: EngineEventHandler<CorpseDropTrackRemovedEvent>;

    [CharacterEngineEvents.SendQuoteMessage]: EngineEventHandler<SendQuoteMessageEvent>;

    [CharacterEngineEvents.AttributesUpdated]: EngineEventHandler<AttributesUpdatedEvent>;
}

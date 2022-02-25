import { HealthPointsSource, PowerPointsTrack } from '@bananos/types';
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
}

export interface CharacterGotHpEvent extends EngineEvent {
   characterId: string;
   amount: number;
   currentHp: number;
   source: HealthPointsSource;
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
   attackerId: string | null;
   characterId: string;
   amount: number;
}

export interface AddCharacterHealthPointsEvent extends EngineEvent {
   casterId: string;
   characterId: string;
   amount: number;
   source: HealthPointsSource;
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
}

export interface CharacterGainExperienceEvent extends EngineEvent {
   type: CharacterEngineEvents.CharacterGainExperience;
   characterId: string;
   amount: number;
   experienceTrack: ExperienceTrack;
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
}

import { HealthPointsSource } from '@bananos/types';
import { Character, EngineEvent, EngineEventHandler } from '../../types';
import { CharacterUnion } from '../../types/CharacterUnion';

export enum CharacterEngineEvents {
   CreateCharacter = 'CreateCharacter',
   NewCharacterCreated = 'NewCharacterCreated',

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
}

export interface CreateCharacterEvent extends EngineEvent {
   type: CharacterEngineEvents.CreateCharacter;
   character: CharacterUnion;
}

export interface NewCharacterCreatedEvent extends EngineEvent {
   type: CharacterEngineEvents.NewCharacterCreated;
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
}

export interface CharacterEngineEventsMap {
   [CharacterEngineEvents.CreateCharacter]: EngineEventHandler<any>;
   [CharacterEngineEvents.NewCharacterCreated]: EngineEventHandler<NewCharacterCreatedEvent>;

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
}

import { EngineEvent, EngineEventHandler } from '../../types';

export enum CharacterEngineEvents {
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

export interface CharacterLostHpEvent extends EngineEvent {
   characterId: string;
   amount: number;
   currentHp: number;
}

export interface CharacterGotHpEvent extends EngineEvent {
   characterId: string;
   amount: number;
   currentHp: number;
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

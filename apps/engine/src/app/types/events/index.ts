import { CharacterDirection } from '@bananos/types';
import { EngineEvents } from '../../EngineEvents';
import { MonsterEngineEvents } from '../../modules/MonsterModule/Events';
import { Monster } from '../../modules/MonsterModule/types';
import { QuestEngineEvents } from '../../modules/QuestModule/Events';
import { SpellEngineEvents } from '../../modules/SpellModule/Events';
import {
   ProjectileSubSpell,
   ProjectileSpell,
   GuidedProjectileSpell,
   GuidedProjectileSubSpell,
   SubSpell,
   SpellEffect,
   Spell,
} from '../../modules/SpellModule/types/spellTypes';
import { Character } from '../Character';
import { Location } from '@bananos/types';
import { Player } from '../Player';
import { Services } from '../Services';

export interface EngineEvent {
   type: EngineEvents | QuestEngineEvents | MonsterEngineEvents | SpellEngineEvents;
}

export interface NewPlayerCreatedEvent extends EngineEvent {
   payload: {
      newCharacter: Player;
   };
}

export interface CreateNewPlayerEvent extends EngineEvent {
   payload: {
      socketId: string;
   };
}

export interface PlayerDisconnectedEvent extends EngineEvent {
   payload: {
      playerId: string;
   };
}

export interface CharacterDiedEvent extends EngineEvent {
   character: Character;
   killerId: string;
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

export interface PlayerStartedMovementEvent extends EngineEvent {
   characterId: string;
}

export interface PlayerTriesToStartedMovementEvent extends EngineEvent {
   characterId: string;
   movement: PlayerMovement;
}

interface PlayerMovement {
   y?: number;
   x?: number;
   source: string;
}

export interface PlayerStopedAllMovementVectorsEvent extends EngineEvent {
   characterId: string;
}

export interface PlayerMovedEvent extends EngineEvent {
   characterId: string;
   newCharacterDirection: CharacterDirection;
   newLocation: Location;
}

export interface PlayerStopedMovementVectorEvent extends EngineEvent {
   characterId: string;
   movement: {
      source: string;
   };
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

export interface CreatePathEvent extends EngineEvent {
   type: EngineEvents.CreatePath;
   pathSeekerId: string;
   targetId: string;
}

export interface UpdatePathEvent extends EngineEvent {
   type: EngineEvents.UpdatePath;
   pathSeekerId: string;
   points: Location[];
}

export interface DeletePathEvent extends EngineEvent {
   type: EngineEvents.DeletePath;
   pathSeekerId: string;
}

export interface ScheduleActionEvent extends EngineEvent {
   type: EngineEvents.ScheduleAction;
   id: string;
   frequency: number;
   perdiod?: number;
}

export interface ScheduleActionTriggeredEvent extends EngineEvent {
   type: EngineEvents.ScheduleActionTriggered;
   id: string;
}
export interface ScheduleActionFinishedEvent extends EngineEvent {
   type: EngineEvents.ScheduleActionFinished;
   id: string;
}

export interface CancelScheduledActionEvent extends EngineEvent {
   type: EngineEvents.CancelScheduledAction;
   id: string;
}

export type EngineEventHandler<T> = ({ event, services }: { event: T; services: Services }) => void;

export interface EngineEventsMap {
   [EngineEvents.PlayerDisconnected]: EngineEventHandler<PlayerDisconnectedEvent>;
   [EngineEvents.CharacterDied]: EngineEventHandler<CharacterDiedEvent>;
   [EngineEvents.CharacterLostHp]: EngineEventHandler<CharacterLostHpEvent>;
   [EngineEvents.NewPlayerCreated]: EngineEventHandler<NewPlayerCreatedEvent>;
   [EngineEvents.CreateNewPlayer]: EngineEventHandler<CreateNewPlayerEvent>;
   [EngineEvents.PlayerStartedMovement]: EngineEventHandler<PlayerStartedMovementEvent>;
   [EngineEvents.PlayerTriesToStartedMovement]: EngineEventHandler<PlayerTriesToStartedMovementEvent>;
   [EngineEvents.PlayerStopedAllMovementVectors]: EngineEventHandler<PlayerStopedAllMovementVectorsEvent>;
   [EngineEvents.PlayerStopedMovementVector]: EngineEventHandler<PlayerStopedMovementVectorEvent>;
   [EngineEvents.PlayerMoved]: EngineEventHandler<PlayerMovedEvent>;
   [EngineEvents.TakeCharacterHealthPoints]: EngineEventHandler<TakeCharacterHealthPointsEvent>;
   [EngineEvents.AddCharacterHealthPoints]: EngineEventHandler<AddCharacterHealthPointsEvent>;
   [EngineEvents.CharacterGotHp]: EngineEventHandler<CharacterGotHpEvent>;
   [EngineEvents.TakeCharacterSpellPower]: EngineEventHandler<TakeCharacterSpellPowerEvent>;
   [EngineEvents.AddCharacterSpellPower]: EngineEventHandler<AddCharacterSpellPowerEvent>;
   [EngineEvents.CharacterLostSpellPower]: EngineEventHandler<CharacterLostSpellPowerEvent>;
   [EngineEvents.CharacterGotSpellPower]: EngineEventHandler<CharacterGotSpellPowerEvent>;

   [EngineEvents.CreatePath]: EngineEventHandler<CreatePathEvent>;
   [EngineEvents.UpdatePath]: EngineEventHandler<UpdatePathEvent>;
   [EngineEvents.DeletePath]: EngineEventHandler<DeletePathEvent>;
   [EngineEvents.ScheduleAction]: EngineEventHandler<ScheduleActionEvent>;
   [EngineEvents.ScheduleActionTriggered]: EngineEventHandler<ScheduleActionTriggeredEvent>;
   [EngineEvents.ScheduleActionFinished]: EngineEventHandler<ScheduleActionFinishedEvent>;
   [EngineEvents.CancelScheduledAction]: EngineEventHandler<CancelScheduledActionEvent>;
}

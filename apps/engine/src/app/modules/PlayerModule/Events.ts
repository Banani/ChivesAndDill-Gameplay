import { EngineEvent, EngineEventHandler } from '../../types';
import { Classes } from '../../types/Classes';
import { PlayerCharacter } from '../../types/PlayerCharacter';

export enum PlayerEngineEvents {
   CreateNewPlayer = 'CreateNewPlayer',
   NewPlayerCreated = 'NewPlayerCreated',
   PlayerDisconnected = 'PlayerDisconnected',
   CreatePlayerCharacter = 'CreatePlayerCharacter',
   PlayerCharacterCreated = 'PlayerCharacterCreated',
}

export interface CreateNewPlayerEvent extends EngineEvent {
   type: PlayerEngineEvents.CreateNewPlayer;
   socket: any;
}
export interface NewPlayerCreatedEvent extends EngineEvent {
   type: PlayerEngineEvents.NewPlayerCreated;
   socket: any;
   playerId: string;
}

export interface PlayerDisconnectedEvent extends EngineEvent {
   type: PlayerEngineEvents.PlayerDisconnected;
   playerId: string;
}

export interface CreatePlayerCharacterEvent extends EngineEvent {
   type: PlayerEngineEvents.CreatePlayerCharacter;
   playerOwnerId: string;
   name: string;
   class: Classes;
}

export interface PlayerCharacterCreatedEvent extends EngineEvent {
   type: PlayerEngineEvents.PlayerCharacterCreated;
   playerCharacter: PlayerCharacter;
}

export interface PlayerEngineEventsMap {
   [PlayerEngineEvents.CreateNewPlayer]: EngineEventHandler<CreateNewPlayerEvent>;
   [PlayerEngineEvents.NewPlayerCreated]: EngineEventHandler<NewPlayerCreatedEvent>;
   [PlayerEngineEvents.PlayerDisconnected]: EngineEventHandler<PlayerDisconnectedEvent>;
   [PlayerEngineEvents.CreatePlayerCharacter]: EngineEventHandler<CreatePlayerCharacterEvent>;
   [PlayerEngineEvents.PlayerCharacterCreated]: EngineEventHandler<PlayerCharacterCreatedEvent>;
}

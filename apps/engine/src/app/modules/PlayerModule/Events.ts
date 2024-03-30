import { CorpseDropTrack } from '@bananos/types';
import { EngineEvent, EngineEventHandler } from '../../types';
import { PlayerCharacter } from '../../types/PlayerCharacter';

export enum PlayerEngineEvents {
    CreateNewPlayer = 'CreateNewPlayer',
    NewPlayerCreated = 'NewPlayerCreated',
    PlayerDisconnected = 'PlayerDisconnected',
    PlayerCharacterCreated = 'PlayerCharacterCreated',

    LootOpened = 'LootOpened',
    LootClosed = 'LootClosed',

    SendErrorMessage = 'SendErrorMessage',

    CharacterClassUpdated = "CharacterClassUpdated"
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

export interface PlayerCharacterCreatedEvent extends EngineEvent {
    type: PlayerEngineEvents.PlayerCharacterCreated;
    playerCharacter: PlayerCharacter;
}

export interface LootOpenedEvent extends EngineEvent {
    type: PlayerEngineEvents.LootOpened;
    characterId: string;
    corpseDropTrack: CorpseDropTrack;
    corpseId: string;
}

export interface LootClosedEvent extends EngineEvent {
    type: PlayerEngineEvents.LootClosed;
    characterId: string;
    corpseId: string;
}

export interface SendErrorMessageEvent extends EngineEvent {
    type: PlayerEngineEvents.SendErrorMessage;
    characterId: string;
    message: string;
}

export interface CharacterClassUpdatedEvent extends EngineEvent {
    type: PlayerEngineEvents.CharacterClassUpdated;
    characterClassId: string;
}

export interface PlayerEngineEventsMap {
    [PlayerEngineEvents.CreateNewPlayer]: EngineEventHandler<CreateNewPlayerEvent>;
    [PlayerEngineEvents.NewPlayerCreated]: EngineEventHandler<NewPlayerCreatedEvent>;
    [PlayerEngineEvents.PlayerDisconnected]: EngineEventHandler<PlayerDisconnectedEvent>;
    [PlayerEngineEvents.PlayerCharacterCreated]: EngineEventHandler<PlayerCharacterCreatedEvent>;

    [PlayerEngineEvents.LootOpened]: EngineEventHandler<LootOpenedEvent>;
    [PlayerEngineEvents.LootClosed]: EngineEventHandler<LootClosedEvent>;

    [PlayerEngineEvents.SendErrorMessage]: EngineEventHandler<SendErrorMessageEvent>;

    [PlayerEngineEvents.CharacterClassUpdated]: EngineEventHandler<CharacterClassUpdatedEvent>;
}

import { CorpseDropTrack } from '@bananos/types';
import { EngineEvent, EngineEventHandler } from '../../types';
import { PlayerCharacter } from '../../types/PlayerCharacter';

export enum PlayerEngineEvents {
    CreateNewPlayer = 'CreateNewPlayer',
    NewPlayerCreated = 'NewPlayerCreated',
    PlayerDisconnected = 'PlayerDisconnected',
    CreatePlayerCharacter = 'CreatePlayerCharacter',
    PlayerCharacterCreated = 'PlayerCharacterCreated',

    PlayerTriesToOpenLoot = 'PlayerTriesToOpenLoot',
    LootOpened = 'LootOpened',
    PlayerTriesToPickItemFromCorpse = 'PlayerTriesToPickItemFromCorpse',
    PlayerTriesToPickCoinsFromCorpse = 'PlayerTriesToPickCoinsFromCorpse',
    CloseLoot = 'CloseLoot',
    LootClosed = 'LootClosed',

    SendErrorMessage = 'SendErrorMessage',
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
    characterClassId: string;
}

export interface PlayerCharacterCreatedEvent extends EngineEvent {
    type: PlayerEngineEvents.PlayerCharacterCreated;
    playerCharacter: PlayerCharacter;
}

export interface PlayerTriesToOpenLootEvent extends EngineEvent {
    type: PlayerEngineEvents.PlayerTriesToOpenLoot;
    characterId: string;
    corpseId: string;
}

export interface LootOpenedEvent extends EngineEvent {
    type: PlayerEngineEvents.LootOpened;
    characterId: string;
    corpseDropTrack: CorpseDropTrack;
    corpseId: string;
}

export interface PlayerTriesToPickItemFromCorpseEvent extends EngineEvent {
    type: PlayerEngineEvents.PlayerTriesToPickItemFromCorpse;
    corpseId: string;
    itemId: string;
}

export interface PlayerTriesToPickCoinsFromCorpseEvent extends EngineEvent {
    type: PlayerEngineEvents.PlayerTriesToPickCoinsFromCorpse;
    corpseId: string;
}

export interface CloseLootEvent extends EngineEvent {
    type: PlayerEngineEvents.CloseLoot;
    characterId: string;
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

export interface PlayerEngineEventsMap {
    [PlayerEngineEvents.CreateNewPlayer]: EngineEventHandler<CreateNewPlayerEvent>;
    [PlayerEngineEvents.NewPlayerCreated]: EngineEventHandler<NewPlayerCreatedEvent>;
    [PlayerEngineEvents.PlayerDisconnected]: EngineEventHandler<PlayerDisconnectedEvent>;
    [PlayerEngineEvents.CreatePlayerCharacter]: EngineEventHandler<CreatePlayerCharacterEvent>;
    [PlayerEngineEvents.PlayerCharacterCreated]: EngineEventHandler<PlayerCharacterCreatedEvent>;

    [PlayerEngineEvents.PlayerTriesToOpenLoot]: EngineEventHandler<PlayerTriesToOpenLootEvent>;
    [PlayerEngineEvents.LootOpened]: EngineEventHandler<LootOpenedEvent>;
    [PlayerEngineEvents.PlayerTriesToPickItemFromCorpse]: EngineEventHandler<PlayerTriesToPickItemFromCorpseEvent>;
    [PlayerEngineEvents.PlayerTriesToPickCoinsFromCorpse]: EngineEventHandler<PlayerTriesToPickCoinsFromCorpseEvent>;
    [PlayerEngineEvents.CloseLoot]: EngineEventHandler<CloseLootEvent>;
    [PlayerEngineEvents.LootClosed]: EngineEventHandler<LootClosedEvent>;

    [PlayerEngineEvents.SendErrorMessage]: EngineEventHandler<SendErrorMessageEvent>;
}

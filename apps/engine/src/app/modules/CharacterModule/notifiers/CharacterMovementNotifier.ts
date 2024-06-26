import { Character, CharacterMovement, GlobalStoreModule } from '@bananos/types';
import { mapValues } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { Notifier } from '../../../Notifier';
import type {
    EngineEventHandler,
    PlayerMovedEvent,
    PlayerStartedMovementEvent,
    PlayerStopedAllMovementVectorsEvent
} from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { CharacterEngineEvents, CharacterRemovedEvent, NewCharacterCreatedEvent } from '../Events';

export class CharacterMovementNotifier extends Notifier<CharacterMovement> {
    constructor() {
        super({ key: GlobalStoreModule.CHARACTER_MOVEMENTS });
        this.eventsToHandlersMap = {
            [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
            [CharacterEngineEvents.NewCharacterCreated]: this.handleNewCharacterCreated,
            [CharacterEngineEvents.CharacterRemoved]: this.handleCharacterRemoved,
            [EngineEvents.CharacterMoved]: this.handlePlayerMoved,
            [EngineEvents.PlayerStopedAllMovementVectors]: this.handlePlayerStopedAllMovementVectors,
            [EngineEvents.PlayerStartedMovement]: this.handlePlayerStartedMovement,
        };
    }

    handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
        this.multicastMultipleObjectsUpdate([
            {
                receiverId: event.playerCharacter.ownerId,
                objects: mapValues(services.characterService.getAllCharacters(), (character: Character) => ({
                    isInMove: character.isInMove,
                    location: character.location,
                    direction: character.direction,
                })),
            },
        ]);

        this.broadcastObjectsUpdate({
            objects: {
                [event.playerCharacter.id]: {
                    isInMove: event.playerCharacter.isInMove,
                    location: event.playerCharacter.location,
                    direction: event.playerCharacter.direction,
                },
            },
        });
    };

    handleNewCharacterCreated: EngineEventHandler<NewCharacterCreatedEvent> = ({ event, services }) => {
        this.broadcastObjectsUpdate({
            objects: {
                [event.character.id]: {
                    isInMove: event.character.isInMove,
                    location: event.character.location,
                    direction: event.character.direction
                },
            },
        });
    };

    handleCharacterRemoved: EngineEventHandler<CharacterRemovedEvent> = ({ event, services }) => {
        this.broadcastObjectsDeletion({
            objects: {
                [event.character.id]: null,
            },
        });
    };

    handlePlayerStartedMovement: EngineEventHandler<PlayerStartedMovementEvent> = ({ event, services }) => {
        this.broadcastObjectsUpdate({
            objects: {
                [event.characterId]: { isInMove: true },
            },
        });
    };

    handlePlayerMoved: EngineEventHandler<PlayerMovedEvent> = ({ event, services }) => {
        this.broadcastObjectsUpdate({
            objects: {
                [event.characterId]: { location: event.newLocation, direction: event.newCharacterDirection },
            },
        });
    };

    handlePlayerStopedAllMovementVectors: EngineEventHandler<PlayerStopedAllMovementVectorsEvent> = ({ event, services }) => {
        this.broadcastObjectsUpdate({
            objects: {
                [event.characterId]: { isInMove: false },
            },
        });
    };
}

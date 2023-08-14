import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import type { CharacterDiedEvent, EngineEventHandler, PlayerMovedEvent, PlayerStartedMovementEvent, PlayerStopedAllMovementVectorsEvent } from '../../../types';
import { CharacterUnion } from '../../../types/CharacterUnion';
import { CharacterEngineEvents, CharacterRemovedEvent, CreateCharacterEvent, NewCharacterCreatedEvent, RemoveCharacterEvent } from '../Events';

export class CharactersService extends EventParser {
    characters: Record<string, CharacterUnion> = {};
    increment = 0;

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [CharacterEngineEvents.RemoveCharacter]: this.handleRemoveCharacter,
            [CharacterEngineEvents.CreateCharacter]: this.handleCreateCharacter,
            [EngineEvents.PlayerStartedMovement]: this.handlePlayerStartedMovement,
            [EngineEvents.PlayerStopedAllMovementVectors]: this.handlePlayerStopedAllMovementVectors,
            [EngineEvents.CharacterMoved]: this.handlePlayerMoved,
            [EngineEvents.CharacterDied]: this.handleCharacterDied,
        };
    }

    handleRemoveCharacter: EngineEventHandler<RemoveCharacterEvent> = ({ event }) => {
        const characterToRemove = this.characters[event.character.id];
        delete this.characters[event.character.id];

        this.engineEventCrator.asyncCeateEvent<CharacterRemovedEvent>({
            type: CharacterEngineEvents.CharacterRemoved,
            character: characterToRemove,
        });
    };

    handleCreateCharacter: EngineEventHandler<CreateCharacterEvent> = ({ event }) => {
        this.characters[event.character.id] = event.character;

        this.engineEventCrator.asyncCeateEvent<NewCharacterCreatedEvent>({
            type: CharacterEngineEvents.NewCharacterCreated,
            character: event.character,
        });
    };

    handlePlayerStartedMovement: EngineEventHandler<PlayerStartedMovementEvent> = ({ event }) => {
        if (this.characters[event.characterId]) {
            this.characters[event.characterId].isInMove = true;
        }
    };

    handlePlayerStopedAllMovementVectors: EngineEventHandler<PlayerStopedAllMovementVectorsEvent> = ({ event }) => {
        if (this.characters[event.characterId]) {
            this.characters[event.characterId].isInMove = false;
        }
    };

    handlePlayerMoved: EngineEventHandler<PlayerMovedEvent> = ({ event }) => {
        if (this.characters[event.characterId]) {
            this.characters[event.characterId].location = event.newLocation;
            this.characters[event.characterId].direction = event.newCharacterDirection;
        }
    };

    handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event }) => {
        delete this.characters[event.characterId];
    };

    getAllCharacters = () => this.characters;

    getCharacterById = (id) => this.characters[id];
}

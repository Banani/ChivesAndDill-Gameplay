import { CharacterDirection, CharacterType, CreateCharacter, PlayerClientActions } from '@bananos/types';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { CharacterDiedEvent, EngineActionHandler, EngineEventHandler } from '../../../types';
import { PlayerCharacter } from '../../../types/PlayerCharacter';
import { CharacterEngineEvents, CreateCharacterEvent, NewCharacterCreatedEvent, RemoveCharacterEvent } from '../../CharacterModule/Events';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../Events';

export class PlayerCharacterService extends EventParser {
    increment: number = 0;
    characters: Record<string, PlayerCharacter> = {};

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [EngineEvents.CharacterDied]: this.handleCharacterDied,
            [CharacterEngineEvents.RemoveCharacter]: this.handleRemoveCharacter,
            [PlayerClientActions.CreatePlayerCharacter]: this.handleCreatePlayerCharacter,
            [CharacterEngineEvents.NewCharacterCreated]: this.handleNewCharacterCreated,
        };
    }

    handleCreatePlayerCharacter: EngineActionHandler<CreateCharacter> = ({ event }) => {
        const newCharacter = this.generateCharacter({ name: event.name, characterClassId: event.characterClassId, ownerId: event.ownerId });

        this.engineEventCrator.asyncCeateEvent<CreateCharacterEvent>({
            type: CharacterEngineEvents.CreateCharacter,
            character: newCharacter,
        });
    };

    handleNewCharacterCreated: EngineEventHandler<NewCharacterCreatedEvent> = ({ event }) => {
        if (event.character.type === CharacterType.Player) {
            this.characters[event.character.id] = event.character;
            this.engineEventCrator.asyncCeateEvent<PlayerCharacterCreatedEvent>({
                type: PlayerEngineEvents.PlayerCharacterCreated,
                playerCharacter: event.character,
            });
        }
    };

    handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event }) => {
        if (this.characters[event.characterId]) {
            this.characters[event.characterId].isDead = true;
        }
    };

    handleRemoveCharacter: EngineEventHandler<RemoveCharacterEvent> = ({ event }) => {
        delete this.characters[event.character.id];
    };

    generateCharacter: ({ characterClassId, name, ownerId }: { characterClassId: string; name: string; ownerId: string }) => PlayerCharacter = ({
        characterClassId,
        name,
        ownerId,
    }) => {
        this.increment++;
        return {
            type: CharacterType.Player,
            id: `playerCharacter_${this.increment.toString()}`,
            name,
            location: { x: 50, y: 100 },
            direction: CharacterDirection.DOWN,
            sprites: 'citizen',
            avatar: '../../../../assets/spritesheets/avatars/dogAvatar.PNG',
            isInMove: false,
            movementSpeed: 24, //4
            healthPointsRegeneration: 5,
            spellPowerRegeneration: 5,
            size: 96,
            absorb: 0,
            isDead: false,
            characterClassId: characterClassId,
            spells: {},
            ownerId,
        };
    };

    getAllCharacters = () => this.characters;
}

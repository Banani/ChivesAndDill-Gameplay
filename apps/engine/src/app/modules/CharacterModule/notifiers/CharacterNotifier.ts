import { Character, GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import type { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import type { CharacterRemovedEvent, NewCharacterCreatedEvent } from '../Events';
import { CharacterEngineEvents } from '../Events';

export class CharacterNotifier extends Notifier<Character> {
    constructor() {
        super({ key: GlobalStoreModule.CHARACTER });
        this.eventsToHandlersMap = {
            [CharacterEngineEvents.NewCharacterCreated]: this.handleNewCharacterCreated,
            [CharacterEngineEvents.CharacterRemoved]: this.handleCharacterRemoved,
            [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
        };
    }

    handleNewCharacterCreated: EngineEventHandler<NewCharacterCreatedEvent> = ({ event }) => {
        this.broadcastObjectsUpdate({
            objects: { [event.character.id]: event.character },
        });
    };

    handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
        this.multicastMultipleObjectsUpdate([
            {
                receiverId: event.playerCharacter.ownerId,
                objects: services.characterService.getAllCharacters(),
            },
        ]);
    };

    handleCharacterRemoved: EngineEventHandler<CharacterRemovedEvent> = ({ event }) => {
        this.broadcastObjectsDeletion({
            objects: { [event.character.id]: null },
        });
    };
}

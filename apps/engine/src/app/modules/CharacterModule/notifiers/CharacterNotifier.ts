import { Character, GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import type { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import type { NewCharacterCreatedEvent } from '../Events';
import { CharacterEngineEvents } from '../Events';

export class CharacterNotifier extends Notifier<Character> {
    constructor() {
        super({ key: GlobalStoreModule.CHARACTER });
        this.eventsToHandlersMap = {
            [CharacterEngineEvents.NewCharacterCreated]: this.handleNewCharacterCreated,
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
}

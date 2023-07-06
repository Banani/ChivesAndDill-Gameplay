import { CharacterClassPreview, GlobalStoreModule } from '@bananos/types';
import { mapValues } from 'lodash';
import { Notifier } from '../../../Notifier';
import type { EngineEventHandler } from '../../../types';
import { NewPlayerCreatedEvent, PlayerEngineEvents } from '../Events';

export class CharacterClassNotifier extends Notifier<CharacterClassPreview> {
    constructor() {
        super({ key: GlobalStoreModule.CHARACTER_CLASS });
        this.eventsToHandlersMap = {
            [PlayerEngineEvents.NewPlayerCreated]: this.handleNewPlayerCreated,
        };
    }

    handleNewPlayerCreated: EngineEventHandler<NewPlayerCreatedEvent> = ({ event, services }) => {
        this.multicastMultipleObjectsUpdate([{
            receiverId: event.playerId, objects: mapValues(services.characterClassService.getData(), characterClass => ({
                id: characterClass.id,
                name: characterClass.name,
                iconImage: characterClass.iconImage,
                color: characterClass.color,
            }))
        }]);
    };
}

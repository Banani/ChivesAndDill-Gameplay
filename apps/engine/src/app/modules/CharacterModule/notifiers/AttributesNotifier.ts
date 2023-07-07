import { Attributes, GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import type { AttributesUpdatedEvent } from '../Events';
import { CharacterEngineEvents } from '../Events';

export class AttributesNotifier extends Notifier<Attributes> {
    constructor() {
        super({ key: GlobalStoreModule.ATTRIBUTES });
        this.eventsToHandlersMap = {
            [CharacterEngineEvents.AttributesUpdated]: this.handleNewCharacterCreated,
        };
    }

    handleNewCharacterCreated: EngineEventHandler<AttributesUpdatedEvent> = ({ event, services }) => {
        const receiverId = this.getReceiverId(event.characterId, services);
        if (!receiverId) {
            return;
        }

        this.multicastMultipleObjectsUpdate([{ receiverId, objects: { [event.characterId]: event.attributes } }]);
    };
}

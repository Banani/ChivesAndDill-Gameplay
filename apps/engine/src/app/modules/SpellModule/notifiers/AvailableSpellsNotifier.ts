import { GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';

export class AvailableSpellsNotifier extends Notifier<boolean> {
    constructor() {
        super({ key: GlobalStoreModule.AVAILABLE_SPELLS });
        this.eventsToHandlersMap = {
            [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
        };
    }

    handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
        const currentSocket = services.socketConnectionService.getSocketById(event.playerCharacter.ownerId);

        this.multicastMultipleObjectsUpdate([{
            receiverId: event.playerCharacter.ownerId,
            objects: {
                "6496f58e6dff053cbafd9fa2": true,
                "649ae88d229708ea977d0fca": true,
                "649ae8a0229708ea977d0fcb": true,
            }
        }]);
    };
}

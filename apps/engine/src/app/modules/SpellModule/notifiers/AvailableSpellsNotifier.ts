import { GlobalStoreModule } from '@bananos/types';
import { mapValues } from 'lodash';
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
        const spells = services.characterClassService.getData()[event.playerCharacter.characterClassId].spells;

        this.multicastMultipleObjectsUpdate([{
            receiverId: event.playerCharacter.ownerId,
            objects: mapValues(spells, () => true)
        }]);
    };
}

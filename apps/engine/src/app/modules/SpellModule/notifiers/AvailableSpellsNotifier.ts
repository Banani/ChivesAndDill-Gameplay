import { GlobalStoreModule } from '@bananos/types';
import * as _ from 'lodash';
import { mapValues } from 'lodash';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { CharacterClassUpdatedEvent, PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';

export class AvailableSpellsNotifier extends Notifier<boolean> {
    constructor() {
        super({ key: GlobalStoreModule.AVAILABLE_SPELLS });
        this.eventsToHandlersMap = {
            [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
            [PlayerEngineEvents.CharacterClassUpdated]: this.handleCharacterClassUpdated
        };
    }

    handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
        const spells = services.characterClassService.getData()[event.playerCharacter.characterClassId].spells;

        this.multicastMultipleObjectsUpdate([{
            receiverId: event.playerCharacter.ownerId,
            objects: mapValues(spells, () => true)
        }]);
    };

    handleCharacterClassUpdated: EngineEventHandler<CharacterClassUpdatedEvent> = ({ event, services }) => {
        const output = [];
        const spells = services.characterClassService.getData()[event.characterClassId].spells;
        const objects = mapValues(spells, () => true)

        _.forEach(services.playerCharacterService.getAllCharacters(), playerCharacter => {
            if (playerCharacter.characterClassId === event.characterClassId) {
                output.push({
                    receiverId: playerCharacter.ownerId,
                    objects
                })
            }
        })

        if (output.length > 0) {
            this.multicastMultipleObjectsUpdate(output);
        }
    };
}

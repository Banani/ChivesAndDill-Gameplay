import { CharacterType, EquipmentReferenceTrack, GlobalStoreModule } from '@bananos/types';
import { mapValues } from 'lodash';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import {
    EquipmentTrackCreatedEvent,
    ItemEngineEvents,
    ItemEquippedEvent,
    ItemStrippedEvent
} from '../Events';

export class EquipmentNotifier extends Notifier<EquipmentReferenceTrack> {
    constructor() {
        super({ key: GlobalStoreModule.EQUIPMENT });
        this.eventsToHandlersMap = {
            [ItemEngineEvents.EquipmentTrackCreated]: this.handleEquipmentTrackCreated,
            [ItemEngineEvents.ItemEquipped]: this.handleItemEquipped,
            [ItemEngineEvents.ItemStripped]: this.handleItemStripped,
        };
    }

    handleItemEquipped: EngineEventHandler<ItemEquippedEvent> = ({ event, services }) => {
        const player = services.characterService.getCharacterById(event.characterId);
        if (player.type !== CharacterType.Player) {
            return;
        }

        const item = services.itemService.getItemById(event.itemInstanceId);

        this.broadcastObjectsUpdate({
            objects: {
                [event.characterId]: {
                    [event.slot]: {
                        itemInstanceId: event.itemInstanceId,
                        itemTemplateId: item.itemTemplateId
                    }
                }
            }
        });
    };

    handleItemStripped: EngineEventHandler<ItemStrippedEvent> = ({ event, services }) => {
        const player = services.characterService.getCharacterById(event.characterId);
        if (player.type !== CharacterType.Player) {
            return;
        }

        this.broadcastObjectsDeletion({ objects: { [event.characterId]: { [event.slot]: null } } });
    };

    handleEquipmentTrackCreated: EngineEventHandler<EquipmentTrackCreatedEvent> = ({ event, services }) => {
        const player = services.characterService.getCharacterById(event.characterId);
        if (player.type !== CharacterType.Player) {
            return;
        }

        const eqTrack: EquipmentReferenceTrack = mapValues(event.equipmentTrack, itemInstanceId => {
            if (itemInstanceId === null) {
                return null;
            }

            const item = services.itemService.getItemById(itemInstanceId);

            return {
                itemInstanceId,
                itemTemplateId: item.itemTemplateId
            }
        })


        this.broadcastObjectsUpdate({
            objects: { [event.characterId]: eqTrack },
        });
    };
}

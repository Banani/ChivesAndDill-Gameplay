import { CharacterType, EquipmentTrack, GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import {
    EquipmentTrackCreatedEvent,
    ItemEngineEvents,
    ItemEquippedEvent,
    ItemStrippedEvent
} from '../Events';

export class EquipmentNotifier extends Notifier<EquipmentTrack> {
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

        this.broadcastObjectsUpdate({ objects: { [event.characterId]: { [event.slot]: event.itemInstanceId } } });
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

        this.broadcastObjectsUpdate({
            objects: { [event.characterId]: event.equipmentTrack },
        });
    };
}

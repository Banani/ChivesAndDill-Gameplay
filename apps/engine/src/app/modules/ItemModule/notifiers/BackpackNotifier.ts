import { BackpackTrack, CharacterType, GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { BackpackTrackCreatedEvent, ItemEngineEvents } from '../Events';

export class BackpackNotifier extends Notifier<BackpackTrack> {
    constructor() {
        super({ key: GlobalStoreModule.BACKPACK_SCHEMA });
        this.eventsToHandlersMap = {
            [ItemEngineEvents.BackpackTrackCreated]: this.handleBackpackTrackCreated,
        };
    }

    handleBackpackTrackCreated: EngineEventHandler<BackpackTrackCreatedEvent> = ({ event, services }) => {
        const player = services.characterService.getCharacterById(event.characterId);
        if (player.type !== CharacterType.Player) {
            return;
        }

        this.multicastMultipleObjectsUpdate([
            {
                receiverId: player.ownerId,
                objects: { [event.characterId]: event.backpackTrack },
            },
        ]);
    };
}

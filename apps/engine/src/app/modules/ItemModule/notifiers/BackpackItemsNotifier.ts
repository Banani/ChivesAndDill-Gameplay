import { BackpackItemsContainment, GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { CharacterType, EngineEventHandler } from '../../../types';
import { BackpackItemsContainmentUpdatedEvent, ItemEngineEvents } from '../Events';

export class BackpackItemsNotifier extends Notifier<BackpackItemsContainment> {
   constructor() {
      super({ key: GlobalStoreModule.BACKPACK_ITEMS });
      this.eventsToHandlersMap = {
         [ItemEngineEvents.BackpackItemsContainmentUpdated]: this.handleBackpackItemsContainmentUpdated,
      };
   }

   handleBackpackItemsContainmentUpdated: EngineEventHandler<BackpackItemsContainmentUpdatedEvent> = ({ event, services }) => {
      const player = services.characterService.getCharacterById(event.characterId);
      if (player.type !== CharacterType.Player) {
         return;
      }

      this.multicastMultipleObjectsUpdate([
         {
            receiverId: player.ownerId,
            objects: { [event.characterId]: event.backpackItemsContainment },
         },
      ]);
   };
}

import { BackpackItemsSpot, GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { CharacterType, EngineEventHandler } from '../../../types';
import { BackpackItemsContainmentUpdatedEvent, ItemAddedToCharacterEvent, ItemEngineEvents } from '../Events';

export class BackpackItemsNotifier extends Notifier<BackpackItemsSpot> {
   constructor() {
      super({ key: GlobalStoreModule.BACKPACK_ITEMS });
      this.eventsToHandlersMap = {
         [ItemEngineEvents.BackpackItemsContainmentUpdated]: this.handleBackpackItemsContainmentUpdated,
         [ItemEngineEvents.ItemAddedToCharacter]: this.handleItemAddedToCharacter,
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

   handleItemAddedToCharacter: EngineEventHandler<ItemAddedToCharacterEvent> = ({ event, services }) => {
      const player = services.characterService.getCharacterById(event.characterId);
      if (player.type !== CharacterType.Player) {
         return;
      }

      this.multicastMultipleObjectsUpdate([
         {
            receiverId: player.ownerId,
            objects: {
               [event.characterId]: {
                  [event.position.backpack]: {
                     [event.position.spot]: {
                        amount: event.amount,
                        itemId: event.itemId,
                     },
                  },
               },
            },
         },
      ]);
   };
}

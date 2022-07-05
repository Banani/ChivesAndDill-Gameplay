import { BackpackItemsSpot, GlobalStoreModule } from '@bananos/types';
import { Notifier } from '../../../Notifier';
import { CharacterType, EngineEventHandler } from '../../../types';
import { BackpackItemsContainmentUpdatedEvent, ItemAddedToCharacterEvent, ItemEngineEvents, ItemRemovedFromBagEvent } from '../Events';

export class BackpackItemsNotifier extends Notifier<BackpackItemsSpot> {
   constructor() {
      super({ key: GlobalStoreModule.BACKPACK_ITEMS });
      this.eventsToHandlersMap = {
         [ItemEngineEvents.BackpackItemsContainmentUpdated]: this.handleBackpackItemsContainmentUpdated,
         [ItemEngineEvents.ItemAddedToCharacter]: this.handleItemAddedToCharacter,
         [ItemEngineEvents.ItemRemovedFromBag]: this.handleItemRemovedFromBag,
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

   handleItemRemovedFromBag: EngineEventHandler<ItemRemovedFromBagEvent> = ({ event, services }) => {
      const player = services.characterService.getCharacterById(event.ownerId);
      if (player.type !== CharacterType.Player) {
         return;
      }

      this.multicastObjectsDeletion([
         {
            receiverId: player.ownerId,
            objects: { [event.position.backpack]: { [event.position.spot]: null } },
         },
      ]);
   };
}

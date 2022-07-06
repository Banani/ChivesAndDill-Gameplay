import { BackpackItemsSpot, GlobalStoreModule, ItemClientMessages } from '@bananos/types';
import * as _ from 'lodash';
import { Notifier } from '../../../Notifier';
import { CharacterType, EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import {
   BackpackItemsContainmentUpdatedEvent,
   ItemAddedToCharacterEvent,
   ItemEngineEvents,
   ItemRemovedFromBagEvent,
   ItemsMovedInBagEvent,
   PlayerTriesToMoveItemInBagEvent,
} from '../Events';

export class BackpackItemsNotifier extends Notifier<BackpackItemsSpot> {
   constructor() {
      super({ key: GlobalStoreModule.BACKPACK_ITEMS });
      this.eventsToHandlersMap = {
         [ItemEngineEvents.BackpackItemsContainmentUpdated]: this.handleBackpackItemsContainmentUpdated,
         [ItemEngineEvents.ItemAddedToCharacter]: this.handleItemAddedToCharacter,
         [ItemEngineEvents.ItemRemovedFromBag]: this.handleItemRemovedFromBag,
         [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
         [ItemEngineEvents.ItemsMovedInBag]: this.handleItemsMovedInBag,
      };
   }

   handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
      const currentSocket = services.socketConnectionService.getSocketById(event.playerCharacter.ownerId);

      currentSocket.on(ItemClientMessages.MoveItemInBag, ({ itemId, directionLocation }) => {
         this.engineEventCrator.asyncCeateEvent<PlayerTriesToMoveItemInBagEvent>({
            type: ItemEngineEvents.PlayerTriesToMoveItemInBag,
            requestingCharacterId: event.playerCharacter.id,
            itemId,
            directionLocation,
         });
      });
   };

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

   handleItemsMovedInBag: EngineEventHandler<ItemsMovedInBagEvent> = ({ event, services }) => {
      const player = services.characterService.getCharacterById(event.characterId);
      if (player.type !== CharacterType.Player) {
         return;
      }

      const toDelete = {};
      event.items.map((item) => {
         if (!toDelete[item.oldPosition.backpack]) {
            toDelete[item.oldPosition.backpack] = {};
         }

         toDelete[item.oldPosition.backpack][item.oldPosition.spot] = null;
      });

      const toUpdate = {};
      event.items.map((item) => {
         if (!toUpdate[item.newLocation.backpack]) {
            toUpdate[item.newLocation.backpack] = {};
         }

         delete toDelete[item.newLocation.backpack][item.newLocation.spot];
         toUpdate[item.newLocation.backpack][item.newLocation.spot] = { itemId: item.itemId };
      });

      _.forEach(toDelete, (backpack, keys) => {
         if (Object.keys(backpack).length === 0) {
            delete toDelete[keys];
         }
      });

      if (Object.keys(toDelete).length) {
         this.multicastObjectsDeletion([
            {
               receiverId: player.ownerId,
               objects: toDelete,
            },
         ]);
      }

      this.multicastMultipleObjectsUpdate([
         {
            receiverId: player.ownerId,
            objects: toUpdate,
         },
      ]);
   };
}

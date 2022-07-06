import { BackpackItemsSpot } from '@bananos/types';
import * as _ from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { Services } from '../../../types/Services';
import {
   AddItemToCharacterEvent,
   BackpackItemsContainmentUpdatedEvent,
   BackpackTrackCreatedEvent,
   DeleteItemEvent,
   GenerateItemForCharacterEvent,
   ItemAddedToCharacterEvent,
   ItemDeletedEvent,
   ItemEngineEvents,
   ItemLocationInBag,
   ItemRemovedFromBagEvent,
   ItemsMovedInBagEvent,
   PlayerTriesToMoveItemInBagEvent,
   PlayerTriesToSplitItemStackEvent,
} from '../Events';
import { ItemTemplates } from '../ItemTemplates';

export class BackpackItemsService extends EventParser {
   // character_id => backpack => slot
   private itemsPositions: Record<string, BackpackItemsSpot> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [ItemEngineEvents.BackpackTrackCreated]: this.handleBackpackTrackCreated,
         [ItemEngineEvents.AddItemToCharacter]: this.handleAddItemToCharacter,
         [ItemEngineEvents.ItemDeleted]: this.handleItemDeleted,
         [ItemEngineEvents.PlayerTriesToMoveItemInBag]: this.handlePlayerTriesToMoveItemInBag,
         [ItemEngineEvents.PlayerTriesToSplitItemStack]: this.handlePlayerTriesToSplitItemStack,
      };
   }

   handleBackpackTrackCreated: EngineEventHandler<BackpackTrackCreatedEvent> = ({ event }) => {
      this.itemsPositions[event.characterId] = { '1': {} };

      this.engineEventCrator.asyncCeateEvent<BackpackItemsContainmentUpdatedEvent>({
         type: ItemEngineEvents.BackpackItemsContainmentUpdated,
         characterId: event.characterId,
         backpackItemsContainment: this.itemsPositions[event.characterId],
      });
   };

   getAmountOfTakenSlots = (characterId) => {
      const itemsPositions = this.itemsPositions[characterId];
      return _.reduce(
         itemsPositions,
         (prev, _current, key) => {
            return prev + Object.keys(itemsPositions[key]).length;
         },
         0
      );
   };

   findNextFreeSpot = (characterId: string, services: Services): ItemLocationInBag => {
      const characterItems = this.itemsPositions[characterId];

      const backpackSizes = services.backpackService.getBackpackSizes(characterId);
      const backpack = parseInt(_.findKey(backpackSizes, (backpack, key) => backpack > Object.keys(characterItems[key]).length));
      const spot = _.range(0, backpackSizes[backpack]).find((spot) => !characterItems[backpack][spot]);

      return { backpack: backpack.toString(), spot: spot.toString() };
   };

   handleAddItemToCharacter: EngineEventHandler<AddItemToCharacterEvent> = ({ event, services }) => {
      if (this.getAmountOfTakenSlots(event.characterId) >= services.backpackService.getAmountOfAllSlots(event.characterId)) {
         this.sendErrorMessage(event.characterId, 'Your backpack is full.');
         return;
      }

      let location: ItemLocationInBag;
      const characterItems = this.itemsPositions[event.characterId];

      if (event.desiredLocation && !characterItems[event.desiredLocation.backpack][event.desiredLocation.spot]) {
         location = event.desiredLocation;
      } else {
         location = this.findNextFreeSpot(event.characterId, services);
      }

      characterItems[location.backpack][location.spot] = {
         amount: event.amount,
         itemId: event.itemId,
      };

      this.engineEventCrator.asyncCeateEvent<ItemAddedToCharacterEvent>({
         type: ItemEngineEvents.ItemAddedToCharacter,
         characterId: event.characterId,
         amount: event.amount,
         itemId: event.itemId,
         position: location,
      });
   };

   handleItemDeleted: EngineEventHandler<ItemDeletedEvent> = ({ event }) => {
      const { backpack, spot } = this.findItemLocationInBag(event.lastCharacterOwnerId, event.itemId);

      if (!backpack) {
         return;
      }

      delete this.itemsPositions[event.lastCharacterOwnerId][backpack][spot];

      this.engineEventCrator.asyncCeateEvent<ItemRemovedFromBagEvent>({
         type: ItemEngineEvents.ItemRemovedFromBag,
         ownerId: event.lastCharacterOwnerId,
         itemId: event.itemId,
         position: { backpack, spot },
      });
   };

   handlePlayerTriesToSplitItemStack: EngineEventHandler<PlayerTriesToSplitItemStackEvent> = ({ event, services }) => {
      const { backpack, spot } = this.findItemLocationInBag(event.requestingCharacterId, event.itemId);
      if (!backpack || !spot) {
         this.sendErrorMessage(event.requestingCharacterId, 'You does not have that item.');
         return;
      }

      const bagSpot = this.itemsPositions[event.requestingCharacterId][backpack][spot];

      if (bagSpot.amount < event.amount) {
         this.sendErrorMessage(event.requestingCharacterId, 'You does not have that many items.');
         return;
      }

      if (this.itemsPositions[event.requestingCharacterId][event.directionLocation.backpack][event.directionLocation.spot]) {
         this.sendErrorMessage(event.requestingCharacterId, 'You cannot do that items split.');
         return;
      }

      if (bagSpot.amount === event.amount) {
         this.engineEventCrator.asyncCeateEvent<PlayerTriesToMoveItemInBagEvent>({
            type: ItemEngineEvents.PlayerTriesToMoveItemInBag,
            directionLocation: event.directionLocation,
            requestingCharacterId: event.requestingCharacterId,
            itemId: event.itemId,
         });
         return;
      }

      bagSpot.amount -= event.amount;

      const item = services.itemService.getItemById(event.itemId);

      this.engineEventCrator.asyncCeateEvent<BackpackItemsContainmentUpdatedEvent>({
         type: ItemEngineEvents.BackpackItemsContainmentUpdated,
         characterId: event.requestingCharacterId,
         backpackItemsContainment: {
            [backpack]: {
               [spot]: {
                  amount: bagSpot.amount,
               },
            },
         },
      });

      this.engineEventCrator.asyncCeateEvent<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         desiredLocation: event.directionLocation,
         characterId: event.requestingCharacterId,
         itemTemplateId: item.itemTemplateId,
         amount: event.amount,
      });
   };

   findItemLocationInBag = (characterId: string, itemId: string) => {
      let backpack, spot;
      _.forEach(this.itemsPositions[characterId], (currentBackpack, backpackKey) => {
         _.forEach(currentBackpack, (currentSpot, slotKey) => {
            if (currentSpot.itemId === itemId) {
               backpack = backpackKey;
               spot = slotKey;
            }
         });
      });

      return { backpack, spot };
   };

   handlePlayerTriesToMoveItemInBag: EngineEventHandler<PlayerTriesToMoveItemInBagEvent> = ({ event, services }) => {
      const characterId = event.requestingCharacterId;
      const { backpack, spot } = this.findItemLocationInBag(characterId, event.itemId);
      const backpackSizes = services.backpackService.getBackpackSizes(characterId);

      if (!backpack) {
         return;
      }

      if (!backpackSizes[event.directionLocation.backpack] || backpackSizes[event.directionLocation.backpack] <= event.directionLocation.spot) {
         this.sendErrorMessage(characterId, 'Invalid backpack location.');
         return;
      }

      const items = [];
      const characterItems = this.itemsPositions[characterId];
      const { directionLocation } = event;
      const itemToMove = characterItems[backpack][spot];
      const itemOnDirectionSpot = this.getItemFromSpot(characterId, directionLocation);

      if (itemOnDirectionSpot && itemOnDirectionSpot.itemId) {
         const itemOnDirectionSpotTemplateId = services.itemService.getItemById(itemOnDirectionSpot.itemId).itemTemplateId;
         const itemToMoveTemplateId = services.itemService.getItemById(itemToMove.itemId).itemTemplateId;

         if (itemOnDirectionSpotTemplateId === itemToMoveTemplateId) {
            const stackSize = ItemTemplates[itemToMoveTemplateId].stack ?? 1;
            const sum = Math.min(itemOnDirectionSpot.amount + itemToMove.amount, stackSize);

            if (itemOnDirectionSpot.amount + itemToMove.amount <= stackSize) {
               this.engineEventCrator.asyncCeateEvent<DeleteItemEvent>({
                  type: ItemEngineEvents.DeleteItem,
                  itemId: itemToMove.itemId,
               });
            } else {
               items.push({
                  itemInstance: { ...characterItems[backpack][spot], amount: itemOnDirectionSpot.amount + itemToMove.amount - sum },
                  newLocation: { backpack, spot },
                  oldPosition: directionLocation,
               });
            }

            characterItems[directionLocation.backpack][directionLocation.spot].amount = sum;
         } else {
            this.swapItemsInBag(characterId, directionLocation, { backpack, spot });
            items.push({ itemInstance: characterItems[backpack][spot], newLocation: { backpack, spot }, oldPosition: directionLocation });
         }
      } else {
         characterItems[directionLocation.backpack][directionLocation.spot] = characterItems[backpack][spot];
         delete characterItems[backpack][spot];
      }

      items.push({
         itemInstance: characterItems[directionLocation.backpack][directionLocation.spot],
         newLocation: directionLocation,
         oldPosition: { backpack, spot },
      });

      this.engineEventCrator.asyncCeateEvent<ItemsMovedInBagEvent>({
         type: ItemEngineEvents.ItemsMovedInBag,
         characterId,
         items,
      });
   };

   getItemFromSpot = (characterId: string, location: ItemLocationInBag) => this.itemsPositions[characterId][location.backpack][location.spot];

   swapItemsInBag = (characterId: string, firstLocation: ItemLocationInBag, secLocation: ItemLocationInBag) => {
      const characterItems = this.itemsPositions[characterId];

      const tempItem = characterItems[firstLocation.backpack][firstLocation.spot];
      characterItems[firstLocation.backpack][firstLocation.spot] = characterItems[secLocation.backpack][secLocation.spot];
      characterItems[secLocation.backpack][secLocation.spot] = tempItem;
   };
}
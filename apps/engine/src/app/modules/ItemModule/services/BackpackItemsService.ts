import { BackpackItemsSpot, ItemLocationInBag } from '@bananos/types';
import * as _ from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { Services } from '../../../types/Services';
import { QuestCompletedEvent, QuestEngineEvents } from '../../QuestModule/Events';
import {
   AddItemToCharacterInventoryEvent,
   BackpackItemsContainmentUpdatedEvent,
   BackpackTrackCreatedEvent,
   DeleteItemEvent,
   GenerateItemForCharacterEvent,
   ItemAddedToCharacterEvent,
   ItemDeletedEvent,
   ItemEngineEvents,
   ItemEquippedEvent,
   ItemRemovedFromBagEvent,
   ItemsMovedInBagEvent,
   ItemStrippedEvent,
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
         [ItemEngineEvents.AddItemToCharacterInventory]: this.handleAddItemToCharacter,
         [ItemEngineEvents.ItemStripped]: this.handleItemStripped,
         [ItemEngineEvents.ItemDeleted]: this.handleItemDeleted,
         [ItemEngineEvents.ItemEquipped]: this.handleItemEquipped,
         [ItemEngineEvents.PlayerTriesToMoveItemInBag]: this.handlePlayerTriesToMoveItemInBag,
         [ItemEngineEvents.PlayerTriesToSplitItemStack]: this.handlePlayerTriesToSplitItemStack,
         [ItemEngineEvents.PlayerTriesToSplitItemStack]: this.handlePlayerTriesToSplitItemStack,
         [QuestEngineEvents.QuestCompleted]: this.handleQuestCompleted,
      };
   }

   getItemById = (characterId: string, itemId: string) => {
      for (let backpack in this.itemsPositions[characterId]) {
         for (let spot in this.itemsPositions[characterId][backpack]) {
            if (itemId === this.itemsPositions[characterId][backpack][spot].itemId) {
               return this.itemsPositions[characterId][backpack][spot];
            }
         }
      }

      return null;
   };

   handleQuestCompleted: EngineEventHandler<QuestCompletedEvent> = ({ event, services }) => {
      const { questReward } = services.questTemplateService.getData()[event.questId];

      if (questReward.items) {
         _.forEach(questReward.items, (item) => {
            this.engineEventCrator.asyncCeateEvent<GenerateItemForCharacterEvent>({
               type: ItemEngineEvents.GenerateItemForCharacter,
               characterId: event.characterId,
               itemTemplateId: item.itemTemplateId,
               amount: item.amount,
            });
         });
      }
   };

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

   canAddThanManyItems = (characterId: string, itemTemplateId: string, amount: number, services: Services) => {
      const amountOfAllSlots = services.backpackService.getAmountOfAllSlots(characterId);
      const amountOfFreeSpots = amountOfAllSlots - this.getAmountOfTakenSlots(characterId);
      const stackSize = ItemTemplates[itemTemplateId].stack ?? 1;

      const amountOfSpacesInAlreadyExistingStacks = _.chain(this.itemsPositions[characterId])
         .map((backpack) =>
            _.chain(backpack)
               .map((item) => {
                  const templateId = services.itemService.getItemById(item.itemId).itemTemplateId;
                  return {
                     templateId,
                     amount: item.amount,
                  };
               })
               .filter((item) => item.templateId === itemTemplateId)
               .map((item) => stackSize - item.amount)
               .sum()
               .value()
         )
         .sum()
         .value();

      return amountOfFreeSpots * stackSize + amountOfSpacesInAlreadyExistingStacks > amount;
   };

   findNextFreeSpot = (characterId: string, services: Services): ItemLocationInBag => {
      const characterItems = this.itemsPositions[characterId];

      const backpackSizes = services.backpackService.getBackpackSizes(characterId);
      const backpack = parseInt(_.findKey(backpackSizes, (backpack, key) => backpack > Object.keys(characterItems[key]).length));
      const spot = _.range(0, backpackSizes[backpack]).find((spot) => !characterItems[backpack][spot]);

      return { backpack: backpack.toString(), spot: spot.toString() };
   };

   findItemOfTheSameTemplateId = (characterId: string, itemId: string, services: Services): ItemLocationInBag[] => {
      const { itemTemplateId } = services.itemService.getItemById(itemId);

      const itemsWithTheSameTemplate = [];

      _.forEach(this.itemsPositions[characterId], (currentBackpack, backpackKey) => {
         _.forEach(currentBackpack, (currentSpot, slotKey) => {
            const currentItemTemplateId = services.itemService.getItemById(currentSpot.itemId).itemTemplateId;
            if (currentItemTemplateId === itemTemplateId) {
               itemsWithTheSameTemplate.push({ backpack: backpackKey, spot: slotKey });
            }
         });
      });

      return itemsWithTheSameTemplate;
   };

   handleItemStripped: EngineEventHandler<ItemStrippedEvent> = ({ event, services }) => {
      this.placeItemInBackpack({ eventData: { ...event, itemId: event.itemInstanceId, amount: 1 }, services });
   };

   handleAddItemToCharacter: EngineEventHandler<AddItemToCharacterInventoryEvent> = ({ event, services }) => {
      this.placeItemInBackpack({ eventData: event, services });
   };

   placeItemInBackpack = ({
      eventData,
      services,
   }: {
      eventData: {
         characterId: string;
         itemId: string;
         amount: number;
         desiredLocation?: ItemLocationInBag;
      };
      services: Services;
   }) => {
      const { itemTemplateId } = services.itemService.getItemById(eventData.itemId);
      if (!this.canAddThanManyItems(eventData.characterId, itemTemplateId, eventData.amount, services)) {
         this.sendErrorMessage(eventData.characterId, 'Your backpack is full.');
         return;
      }

      let location: ItemLocationInBag;
      const characterItems = this.itemsPositions[eventData.characterId];
      let amountToAdd = eventData.amount;

      if (eventData.desiredLocation && !characterItems[eventData.desiredLocation.backpack][eventData.desiredLocation.spot]) {
         location = eventData.desiredLocation;
      } else {
         const itemsWithTheSameTemplate = this.findItemOfTheSameTemplateId(eventData.characterId, eventData.itemId, services);
         const stackSize = ItemTemplates[services.itemService.getItemById(eventData.itemId).itemTemplateId].stack ?? 1;
         const newItemPositions = {};

         _.forEach(itemsWithTheSameTemplate, ({ backpack, spot }) => {
            const freeSpaceSize = stackSize - characterItems[backpack][spot].amount;
            const amountToMove = Math.min(freeSpaceSize, amountToAdd);
            amountToAdd -= amountToMove;
            characterItems[backpack][spot].amount += amountToMove;

            if (amountToMove) {
               if (!newItemPositions[backpack]) {
                  newItemPositions[backpack] = {};
               }
               newItemPositions[backpack][spot] = { amount: characterItems[backpack][spot].amount };
            }
         });

         if (Object.keys(newItemPositions).length > 0) {
            this.engineEventCrator.asyncCeateEvent<BackpackItemsContainmentUpdatedEvent>({
               type: ItemEngineEvents.BackpackItemsContainmentUpdated,
               characterId: eventData.characterId,
               backpackItemsContainment: newItemPositions,
            });
         }

         if (amountToAdd > 0) {
            location = this.findNextFreeSpot(eventData.characterId, services);
         } else {
            this.engineEventCrator.asyncCeateEvent<DeleteItemEvent>({
               type: ItemEngineEvents.DeleteItem,
               itemId: eventData.itemId,
            });
         }
      }

      if (location) {
         characterItems[location.backpack][location.spot] = {
            amount: amountToAdd,
            itemId: eventData.itemId,
         };

         this.engineEventCrator.asyncCeateEvent<ItemAddedToCharacterEvent>({
            type: ItemEngineEvents.ItemAddedToCharacter,
            characterId: eventData.characterId,
            amount: amountToAdd,
            itemId: eventData.itemId,
            position: location,
         });
      }
   };

   handleItemDeleted: EngineEventHandler<ItemDeletedEvent> = ({ event }) => {
      this.removeFromBag(event.lastCharacterOwnerId, event.itemId);
   };

   handleItemEquipped: EngineEventHandler<ItemEquippedEvent> = ({ event }) => {
      this.removeFromBag(event.characterId, event.itemInstanceId);
   };

   removeFromBag = (lastCharacterOwnerId: string, itemId: string) => {
      const { backpack, spot } = this.findItemLocationInBag(lastCharacterOwnerId, itemId);

      if (!backpack) {
         return;
      }

      delete this.itemsPositions[lastCharacterOwnerId][backpack][spot];

      this.engineEventCrator.asyncCeateEvent<ItemRemovedFromBagEvent>({
         type: ItemEngineEvents.ItemRemovedFromBag,
         ownerId: lastCharacterOwnerId,
         itemId: itemId,
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

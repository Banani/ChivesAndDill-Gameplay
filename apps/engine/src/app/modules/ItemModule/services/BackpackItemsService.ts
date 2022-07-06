import { BackpackItemsSpot } from '@bananos/types';
import * as _ from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import {
   AddItemToCharacterEvent,
   BackpackItemsContainmentUpdatedEvent,
   BackpackTrackCreatedEvent,
   ItemAddedToCharacterEvent,
   ItemDeletedEvent,
   ItemEngineEvents,
   ItemLocationInBag,
   ItemRemovedFromBagEvent,
   ItemsMovedInBagEvent,
   PlayerTriesToMoveItemInBagEvent,
} from '../Events';

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

   handleAddItemToCharacter: EngineEventHandler<AddItemToCharacterEvent> = ({ event, services }) => {
      const backpackSizes = services.backpackService.getBackpackSizes(event.characterId);
      if (this.getAmountOfTakenSlots(event.characterId) >= services.backpackService.getAmountOfAllSlots(event.characterId)) {
         this.sendErrorMessage(event.characterId, 'Your backpack is full.');
         return;
      }

      const backpackNumber = parseInt(_.findKey(backpackSizes, (backpack, key) => backpack > Object.keys(this.itemsPositions[event.characterId][key]).length));
      const spot = _.range(0, backpackSizes[backpackNumber]).find((spot) => !this.itemsPositions[event.characterId][backpackNumber][spot]);

      this.itemsPositions[event.characterId][backpackNumber][spot] = {
         amount: event.amount,
         itemId: event.itemId,
      };

      this.engineEventCrator.asyncCeateEvent<ItemAddedToCharacterEvent>({
         type: ItemEngineEvents.ItemAddedToCharacter,
         characterId: event.characterId,
         amount: event.amount,
         itemId: event.itemId,
         position: { backpack: backpackNumber, spot },
      });
   };

   handleItemDeleted: EngineEventHandler<ItemDeletedEvent> = ({ event }) => {
      const { backpack, spot } = this.findItemInBag(event.lastCharacterOwnerId, event.itemId);

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

   findItemInBag = (characterId: string, itemId: string) => {
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
      const { backpack, spot } = this.findItemInBag(characterId, event.itemId);
      const backpackSizes = services.backpackService.getBackpackSizes(characterId);

      if (!backpack) {
         return;
      }

      if (!backpackSizes[event.directionLocation.backpack] || backpackSizes[event.directionLocation.backpack] <= event.directionLocation.spot) {
         this.sendErrorMessage(characterId, 'Invalid backpack location.');
         return;
      }

      const characterItems = this.itemsPositions[characterId];
      const { directionLocation } = event;
      const items = [];

      if (this.getItemFromSpot(characterId, directionLocation)) {
         this.swapItemsInBag(characterId, directionLocation, { backpack, spot });
         items.push({ itemId: characterItems[backpack][spot].itemId, newLocation: { backpack, spot }, oldPosition: directionLocation });
      } else {
         delete this.itemsPositions[characterId][backpack][spot];
         characterItems[directionLocation.backpack][directionLocation.spot] = characterItems[backpack][spot];
      }

      items.push({ itemId: event.itemId, newLocation: directionLocation, oldPosition: { backpack, spot } });

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

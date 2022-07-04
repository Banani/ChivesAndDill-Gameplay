import { BackpackItemsSpot } from '@bananos/types';
import * as _ from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import {
   AddItemToCharacterEvent,
   BackpackItemsContainmentUpdatedEvent,
   BackpackTrackCreatedEvent,
   ItemAddedToCharacterEvent,
   ItemEngineEvents,
} from '../Events';

export class BackpackItemsService extends EventParser {
   // character_id => backpack => slot
   private itemsPositions: Record<string, BackpackItemsSpot> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [ItemEngineEvents.BackpackTrackCreated]: this.handleBackpackTrackCreated,
         [ItemEngineEvents.AddItemToCharacter]: this.handleAddItemToCharacter,
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
}

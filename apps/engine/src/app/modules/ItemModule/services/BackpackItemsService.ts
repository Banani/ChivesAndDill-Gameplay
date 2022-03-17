import { BackpackItemsContainment } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { BackpackItemsContainmentUpdatedEvent, BackpackTrackCreatedEvent, ItemEngineEvents } from '../Events';

export class BackpackItemsService extends EventParser {
   // player id => backpack number => backpack place
   private playerToItemsOwnership: Record<string, BackpackItemsContainment> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [ItemEngineEvents.BackpackTrackCreated]: this.handleBackpackTrackCreated,
      };
   }

   handleBackpackTrackCreated: EngineEventHandler<BackpackTrackCreatedEvent> = ({ event }) => {
      this.playerToItemsOwnership[event.characterId] = {
         '1': {
            '3': {
               itemId: '2',
               amount: 1,
            },
         },
      };

      this.engineEventCrator.asyncCeateEvent<BackpackItemsContainmentUpdatedEvent>({
         type: ItemEngineEvents.BackpackItemsContainmentUpdated,
         characterId: event.characterId,
         backpackItemsContainment: this.playerToItemsOwnership[event.characterId],
      });
   };
}

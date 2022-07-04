import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import { AddItemToCharacterEvent, CurrencyAmountUpdatedEvent, GenerateItemForCharacterEvent, ItemEngineEvents } from '../Events';

export class ItemService extends EventParser {
   private items: Record<string, { itemId: string }> = {};
   private increment = 0;

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [ItemEngineEvents.GenerateItemForCharacter]: this.handleGenerateItemForCharacter,
      };
   }

   handleGenerateItemForCharacter: EngineEventHandler<GenerateItemForCharacterEvent> = ({ event }) => {
      const itemId = `ItemInstance_${this.increment++}`;
      this.items[itemId] = { itemId };

      this.engineEventCrator.asyncCeateEvent<AddItemToCharacterEvent>({
         type: ItemEngineEvents.AddItemToCharacter,
         characterId: event.characterId,
         amount: event.amount,
         itemId,
      });
   };
}

import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { AddItemToCharacterEvent, GenerateItemForCharacterEvent, ItemDeletedEvent, ItemEngineEvents, PlayerTriesToDeleteItemEvent } from '../Events';
import { ItemTemplates } from '../ItemTemplates';

export class ItemService extends EventParser {
   private items: Record<string, { itemId: string; ownerId: string }> = {};
   private increment = 0;

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [ItemEngineEvents.GenerateItemForCharacter]: this.handleGenerateItemForCharacter,
         [ItemEngineEvents.PlayerTriesToDeleteItem]: this.handlePlayerTriesToDeleteItem,
      };
   }

   handleGenerateItemForCharacter: EngineEventHandler<GenerateItemForCharacterEvent> = ({ event }) => {
      if (!ItemTemplates[event.itemTemplateId]) {
         return;
      }

      const amountToGenerate = event.amount ?? 1;
      const stackSize = ItemTemplates[event.itemTemplateId].stack ?? 1;

      for (let i = 0; i < amountToGenerate / stackSize; i++) {
         const itemId = `ItemInstance_${this.increment++}`;
         this.items[itemId] = { itemId, ownerId: event.characterId };

         let amount = stackSize;
         if (i + 1 > amountToGenerate / stackSize) {
            amount = amountToGenerate % stackSize;
         }

         this.engineEventCrator.asyncCeateEvent<AddItemToCharacterEvent>({
            type: ItemEngineEvents.AddItemToCharacter,
            characterId: event.characterId,
            itemId,
            amount,
         });
      }
   };

   handlePlayerTriesToDeleteItem: EngineEventHandler<PlayerTriesToDeleteItemEvent> = ({ event }) => {
      if (!this.items[event.itemId] || this.items[event.itemId].ownerId !== event.requestingCharacterId) {
         this.sendErrorMessage(event.requestingCharacterId, 'Item does not exist.');
         return;
      }

      delete this.items[event.itemId];

      this.engineEventCrator.asyncCeateEvent<ItemDeletedEvent>({
         type: ItemEngineEvents.ItemDeleted,
         lastCharacterOwnerId: event.requestingCharacterId,
         itemId: event.itemId,
      });
   };
}

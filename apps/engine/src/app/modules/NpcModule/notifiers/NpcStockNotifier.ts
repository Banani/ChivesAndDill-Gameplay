import { ActiveNpcConversation, GlobalStoreModule } from '@bananos/types';
import * as _ from 'lodash';
import { Notifier } from '../../../Notifier';
import { CharacterType, EngineEventHandler } from '../../../types';
import { ConversationWithNpcStartedEvent, NpcEngineEvents } from '../Events';

export class NpcStockNotifier extends Notifier<ActiveNpcConversation> {
   constructor() {
      super({ key: GlobalStoreModule.NPC_STOCK });
      this.eventsToHandlersMap = {
         [NpcEngineEvents.ConversationWithNpcStarted]: this.handleConversationWithNpcStarted,
      };
   }

   handleConversationWithNpcStarted: EngineEventHandler<ConversationWithNpcStartedEvent> = ({ event, services }) => {
      const character = services.characterService.getCharacterById(event.characterId);
      if (character.type != CharacterType.Player) {
         return;
      }

      const npc = services.npcService.getNpcById(event.npcId);
      const itemsStock = services.npcTemplateService.getData()[npc.templateId].stock;

      if (itemsStock) {
         const itemsIds = _.mapValues(itemsStock, () => true);
         this.multicastMultipleObjectsUpdate([{ receiverId: character.ownerId, objects: { [event.npcId]: itemsIds } }]);
      }
   };
}

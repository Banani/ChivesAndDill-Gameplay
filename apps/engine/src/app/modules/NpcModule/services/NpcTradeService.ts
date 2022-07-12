import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import * as _ from 'lodash';
import { NpcEngineEvents, PlayerTriesToBuyItemFromNpcEvent } from '../Events';
import { GenerateItemForCharacterEvent, ItemEngineEvents } from '../../ItemModule/Events';

export class NpcTradeService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {
         [NpcEngineEvents.PlayerTriesToBuyItemFromNpc]: this.handlePlayerTriesToBuyItemFromNpc,
      };
   }

   handlePlayerTriesToBuyItemFromNpc: EngineEventHandler<PlayerTriesToBuyItemFromNpcEvent> = ({ event, services }) => {
      const npcIdThatCharacterIsTalkingWith = services.activeNpcConversationService.getConversationById(event.requestingCharacterId);
      if (npcIdThatCharacterIsTalkingWith !== event.npcId) {
         this.sendErrorMessage(event.requestingCharacterId, 'You are not talking with that NPC.');
         return;
      }

      const npc = services.npcService.getNpcById(npcIdThatCharacterIsTalkingWith);
      const npcTemplate = services.npcTemplateService.getData()[npc.templateId];
      if (!npcTemplate.stock[event.itemTemplateId]) {
         this.sendErrorMessage(event.requestingCharacterId, 'This npc is not selling that item.');
         return;
      }

      if (!services.backpackItemsService.canAddThanManyItems(event.requestingCharacterId, event.itemTemplateId, event.amount ?? 1, services)) {
         this.sendErrorMessage(event.requestingCharacterId, 'You do not have enough space in your backpack.');
         return;
      }

      this.engineEventCrator.asyncCeateEvent<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         amount: event.amount,
         characterId: event.requestingCharacterId,
         itemTemplateId: event.itemTemplateId,
         desiredLocation: event.desiredLocation,
      });
   };
}

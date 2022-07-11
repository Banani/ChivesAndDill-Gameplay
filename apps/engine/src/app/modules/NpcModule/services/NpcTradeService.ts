import { EventParser } from '../../../EventParser';
import { EngineEventHandler, PlayerMovedEvent } from '../../../types';
import * as _ from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import {
   ConversationWithNpcEndedEvent,
   ConversationWithNpcStartedEvent,
   NpcEngineEvents,
   PlayerTriesToBuyItemFromNpcEvent,
   PlayerTriesToFinishConversationEvent,
   PlayerTriesToStartConversationEvent,
} from '../Events';
import { distanceBetweenTwoPoints } from '../../../math';
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

      this.engineEventCrator.asyncCeateEvent<GenerateItemForCharacterEvent>({
         type: ItemEngineEvents.GenerateItemForCharacter,
         amount: event.amount,
         characterId: event.requestingCharacterId,
         itemTemplateId: event.itemTemplateId,
         desiredLocation: event.desiredLocation,
      });
   };
}

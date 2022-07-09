import { EventParser } from '../../../EventParser';
import { EngineEventHandler, PlayerMovedEvent } from '../../../types';
import * as _ from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import {
   ConversationWithNpcEndedEvent,
   ConversationWithNpcStartedEvent,
   NpcEngineEvents,
   PlayerTriesToFinishConversationEvent,
   PlayerTriesToStartConversationEvent,
} from '../Events';

export class ActiveNpcConversationService extends EventParser {
   // character_id => npc_id
   activeDialogs: Record<string, string> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [NpcEngineEvents.PlayerTriesToStartConversation]: this.handlePlayerTriesToStartConversation,
         [EngineEvents.PlayerMoved]: this.handlePlayerMoved,
         [NpcEngineEvents.PlayerTriesToFinishConversation]: this.handlePlayerTriesToFinishConversation,
      };
   }

   handlePlayerTriesToStartConversation: EngineEventHandler<PlayerTriesToStartConversationEvent> = ({ event, services }) => {
      // check distance

      if (!services.npcService.getNpcById(event.npcId)) {
         this.sendErrorMessage(event.requestingCharacterId, 'That npc does not exist.');
         return;
      }

      this.activeDialogs[event.requestingCharacterId] = event.npcId;

      this.engineEventCrator.asyncCeateEvent<ConversationWithNpcStartedEvent>({
         type: NpcEngineEvents.ConversationWithNpcStarted,
         characterId: event.requestingCharacterId,
         npcId: event.npcId,
      });
   };

   handlePlayerMoved: EngineEventHandler<PlayerMovedEvent> = ({ event }) => {
      if (this.activeDialogs[event.characterId]) {
         this.closeConversationDialog(event.characterId);
      }
   };

   handlePlayerTriesToFinishConversation: EngineEventHandler<PlayerTriesToFinishConversationEvent> = ({ event }) => {
      if (this.activeDialogs[event.requestingCharacterId]) {
         this.closeConversationDialog(event.requestingCharacterId);
      } else {
         this.sendErrorMessage(event.requestingCharacterId, 'You are not talking with anyone.');
      }
   };

   closeConversationDialog = (characterId: string) => {
      delete this.activeDialogs[characterId];

      this.engineEventCrator.asyncCeateEvent<ConversationWithNpcEndedEvent>({
         type: NpcEngineEvents.ConversationWithNpcEnded,
         characterId,
      });
   };
}

import { ChatMessage } from '@bananos/types';
import { now, pickBy } from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import {
   ChatEngineEvents,
   SendChatMessageEvent,
   ChatMessageSentEvent,
   DeleteChatChannelEvent,
   ChatMessagesDeletedEvent,
   ChatChannelDeletedEvent,
} from '../Events';

export class ChatMessageService extends EventParser {
   private messages: Record<string, ChatMessage> = {};
   private increment = 0;

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [ChatEngineEvents.SendChatMessage]: this.handleSendChatMessage,
         [ChatEngineEvents.ChatChannelDeleted]: this.handleChatChannelDeleted,
      };
   }

   handleSendChatMessage: EngineEventHandler<SendChatMessageEvent> = ({ event, services }) => {
      const chatChannel = services.chatChannelService.getChatChannelById(event.chatChannelId);

      if (!chatChannel) {
         this.sendErrorMessage(event.requestingCharacterId, 'Chat channel does not exist.');
         return;
      }

      if (!chatChannel.membersIds[event.requestingCharacterId]) {
         this.sendErrorMessage(event.requestingCharacterId, 'You are not a member of this chat channel.');
         return;
      }

      const id = `chatMessage_${this.increment++}`;
      this.messages[id] = { id, message: event.message, authorId: event.requestingCharacterId, time: now(), chatChannelId: event.chatChannelId };

      this.engineEventCrator.asyncCeateEvent<ChatMessageSentEvent>({
         type: ChatEngineEvents.ChatMessageSent,
         chatMessage: this.messages[id],
      });
   };

   handleChatChannelDeleted: EngineEventHandler<ChatChannelDeletedEvent> = ({ event }) => {
      const messagesToDeleteIds = Object.keys(pickBy(this.messages, (message) => message.chatChannelId === event.chatChannel.id));
      this.messages = pickBy(this.messages, (message) => message.chatChannelId !== event.chatChannel.id);

      this.engineEventCrator.asyncCeateEvent<ChatMessagesDeletedEvent>({
         type: ChatEngineEvents.ChatMessagesDeleted,
         messagesIds: messagesToDeleteIds,
         receiversIds: Object.keys(event.chatChannel.membersIds),
      });
   };
}

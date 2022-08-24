import { EngineModule } from '../../types/EngineModule';
import { ChatChannelNotifier } from './notifiers/ChatChannelNotifier';
import { ChatMessageNotifier } from './notifiers/ChatMessageNotifier';
import { ChatChannelService, ChatRangeMessageService } from './services';
import { ChatMessageService } from './services/ChatMessageService';
import { ChatQuoteMessageService } from './services/ChatQuoteMessageService';

export interface ChatModuleServices {
   chatChannelService: ChatChannelService;
   chatMessageService: ChatMessageService;
   chatRangeMessageService: ChatRangeMessageService;
   chatQuoteMessageService: ChatQuoteMessageService;
}

export const getChatModule: () => EngineModule<ChatModuleServices> = () => {
   return {
      notifiers: [new ChatChannelNotifier(), new ChatMessageNotifier()],
      services: {
         chatChannelService: new ChatChannelService(),
         chatMessageService: new ChatMessageService(),
         chatRangeMessageService: new ChatRangeMessageService(),
         chatQuoteMessageService: new ChatQuoteMessageService(),
      },
   };
};

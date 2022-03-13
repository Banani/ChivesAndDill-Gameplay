import { EngineModule } from '../../types/EngineModule';
import { ChatChannelNotifier } from './notifiers/ChatChannelNotifier';
import { ChatMessageNotifier } from './notifiers/ChatMessageNotifier';
import { ChatChannelService } from './services';
import { ChatMessageService } from './services/ChatMessageService';

export interface ChatModuleServices {
   chatChannelService: ChatChannelService;
   chatMessageService: ChatMessageService;
}

export const getChatModule: () => EngineModule<ChatModuleServices> = () => {
   return {
      notifiers: [new ChatChannelNotifier(), new ChatMessageNotifier()],
      services: {
         chatChannelService: new ChatChannelService(),
         chatMessageService: new ChatMessageService(),
      },
   };
};

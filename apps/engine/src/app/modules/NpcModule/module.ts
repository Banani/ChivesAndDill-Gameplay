import { EngineModule } from '../../types/EngineModule';
import { ActiveNpcConversationNotifier, NpcQuestNotifier } from './notifiers';
import { NpcStockNotifier } from './notifiers/NpcStockNotifier';
import { ActiveNpcConversationService } from './services/ActiveNpcConversationService';
import { NpcRespawnTemplateService } from './services/NpcRespawnTemplateService';
import { NpcService } from './services/NpcService';
import { NpcTemplateService } from './services/NpcTemplateService';
import { NpcTradeService } from './services/NpcTradeService';

export interface NpcModuleServices {
   npcService: NpcService;
   activeNpcConversationService: ActiveNpcConversationService;
   npcTemplateService: NpcTemplateService;
   npcRespawnTemplateService: NpcRespawnTemplateService;
   npcTradeService: NpcTradeService;
}

export const getNpcModule: () => EngineModule<NpcModuleServices> = () => {
   return {
      notifiers: [new ActiveNpcConversationNotifier(), new NpcStockNotifier(), new NpcQuestNotifier()],
      services: {
         npcService: new NpcService(),
         activeNpcConversationService: new ActiveNpcConversationService(),
         npcTemplateService: new NpcTemplateService(),
         npcRespawnTemplateService: new NpcRespawnTemplateService(),
         npcTradeService: new NpcTradeService(),
      },
   };
};

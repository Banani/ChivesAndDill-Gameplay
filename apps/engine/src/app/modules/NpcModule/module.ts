import { EngineModule } from '../../types/EngineModule';
import { ActiveNpcConversationNotifier } from './notifiers';
import { ActiveNpcConversationService } from './services/ActiveNpcConversationService';
import { NpcRespawnTemplateService } from './services/NpcRespawnTemplateService';
import { NpcService } from './services/NpcService';
import { NpcTemplateService } from './services/NpcTemplateService';

export interface NpcModuleServices {
   npcService: NpcService;
   activeNpcConversationService: ActiveNpcConversationService;
   npcTemplateService: NpcTemplateService;
   npcRespawnTemplateService: NpcRespawnTemplateService;
}

export const getNpcModule: () => EngineModule<NpcModuleServices> = () => {
   return {
      notifiers: [new ActiveNpcConversationNotifier()],
      services: {
         npcService: new NpcService(),
         activeNpcConversationService: new ActiveNpcConversationService(),
         npcTemplateService: new NpcTemplateService(),
         npcRespawnTemplateService: new NpcRespawnTemplateService(),
      },
   };
};

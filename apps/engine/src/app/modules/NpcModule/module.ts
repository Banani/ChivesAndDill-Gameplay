import { EngineModule } from '../../types/EngineModule';
import { ActiveNpcConversationNotifier } from './notifiers';
import { ActiveNpcConversationService } from './services/ActiveNpcConversationService';
import { NpcService } from './services/NpcService';

export interface NpcModuleServices {
   npcService: NpcService;
   activeNpcConversationService: ActiveNpcConversationService;
}

export const getNpcModule: () => EngineModule<NpcModuleServices> = () => {
   return {
      notifiers: [new ActiveNpcConversationNotifier()],
      services: {
         npcService: new NpcService(),
         activeNpcConversationService: new ActiveNpcConversationService(),
      },
   };
};

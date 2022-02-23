import { EngineModule } from '../../types/EngineModule';
import { QuestNotifier } from './notifiers';
import { KillingQuestService, MovementQuestService, QuestProgressService } from './services';

export interface QuestModuleServices {
   killingQuestService: KillingQuestService;
   movementQuestService: MovementQuestService;
   questProgressService: QuestProgressService;
}

export const getQuestModule: () => EngineModule<QuestModuleServices> = () => {
   return {
      notifiers: [new QuestNotifier()],
      services: {
         killingQuestService: new KillingQuestService(),
         movementQuestService: new MovementQuestService(),
         questProgressService: new QuestProgressService(),
      },
   };
};

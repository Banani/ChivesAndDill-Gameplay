// @ts-nocheck
import { EngineModule } from '../../types/EngineModule';
import { QuestDefinitionNotifier, QuestNotifier, QuestProgressNotifier } from './notifiers';
import { KillingQuestService, MovementQuestService, QuestProgressService, QuestTemplateService } from './services';

export interface QuestModuleServices {
   killingQuestService: KillingQuestService;
   movementQuestService: MovementQuestService;
   questProgressService: QuestProgressService;
   questTemplateService: QuestTemplateService;
}

export const getQuestModule: () => EngineModule<QuestModuleServices> = () => {
   return {
      notifiers: [new QuestNotifier(), new QuestDefinitionNotifier(), new QuestProgressNotifier()],
      services: {
         killingQuestService: new KillingQuestService(),
         movementQuestService: new MovementQuestService(),
         questProgressService: new QuestProgressService(),
         questTemplateService: new QuestTemplateService(),
      },
   };
};

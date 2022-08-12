import { EngineModule } from '../../types/EngineModule';
import { QuestDefinitionNotifier, QuestProgressNotifier } from './notifiers';
import { ArchivedQuestService, KillingQuestService, MovementQuestService, QuestProgressService, QuestTemplateService } from './services';

export interface QuestModuleServices {
   killingQuestService: KillingQuestService;
   movementQuestService: MovementQuestService;
   questProgressService: QuestProgressService;
   questTemplateService: QuestTemplateService;
   archivedQuestService: ArchivedQuestService;
}

export const getQuestModule: () => EngineModule<QuestModuleServices> = () => {
   return {
      notifiers: [new QuestDefinitionNotifier(), new QuestProgressNotifier()],
      services: {
         killingQuestService: new KillingQuestService(),
         movementQuestService: new MovementQuestService(),
         questProgressService: new QuestProgressService(),
         questTemplateService: new QuestTemplateService(),
         archivedQuestService: new ArchivedQuestService(),
      },
   };
};

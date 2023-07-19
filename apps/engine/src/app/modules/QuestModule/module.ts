import { EngineModule } from '../../types/EngineModule';
import { QuestDefinitionNotifier, QuestProgressNotifier } from './notifiers';
import { ArchivedQuestService, KillingQuestService, MovementQuestService, QuestProgressService, QuestSchemasService } from './services';
import { QuestMessagesService } from './services/QuestMessagesService';

export interface QuestModuleServices {
    killingQuestService: KillingQuestService;
    movementQuestService: MovementQuestService;
    questProgressService: QuestProgressService;
    questSchemasService: QuestSchemasService;
    archivedQuestService: ArchivedQuestService;
    questMessagesService: QuestMessagesService;
}

export const getQuestModule: () => EngineModule<QuestModuleServices> = () => {
    return {
        notifiers: [new QuestDefinitionNotifier(), new QuestProgressNotifier()],
        services: {
            killingQuestService: new KillingQuestService(),
            movementQuestService: new MovementQuestService(),
            questProgressService: new QuestProgressService(),
            questSchemasService: new QuestSchemasService(),
            archivedQuestService: new ArchivedQuestService(),
            questMessagesService: new QuestMessagesService()
        },
    };
};

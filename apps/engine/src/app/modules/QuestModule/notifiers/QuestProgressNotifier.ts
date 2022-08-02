import { AllExternalQuestStageProgress, ExternalQuestProgress, GlobalStoreModule, QuestType } from '@bananos/types';
import * as _ from 'lodash';
import { Notifier } from '../../../Notifier';
import { CharacterType, EngineEventHandler } from '../../../types';
import { NewQuestStageStartedEvent, QuestEngineEvents } from '../Events';

export class QuestProgressNotifier extends Notifier<ExternalQuestProgress> {
   constructor() {
      super({ key: GlobalStoreModule.QUEST_PROGRESS });
      this.eventsToHandlersMap = {
         [QuestEngineEvents.NewQuestStageStarted]: this.handleNewQuestStageStarted,
      };
   }

   stageInitialTranformers: Record<QuestType, () => AllExternalQuestStageProgress> = {
      [QuestType.MOVEMENT]: () => ({ type: QuestType.MOVEMENT, isDone: false }),
      [QuestType.KILLING]: () => ({ type: QuestType.MOVEMENT, isDone: false, currentAmount: 0 }),
   };

   handleNewQuestStageStarted: EngineEventHandler<NewQuestStageStartedEvent> = ({ event, services }) => {
      const character = services.characterService.getCharacterById(event.characterId);
      if (character.type != CharacterType.Player) {
         return;
      }

      this.multicastMultipleObjectsUpdate([
         {
            receiverId: character.ownerId,
            objects: {
               [event.questId]: {
                  activeStage: event.questStage.id,
                  stagesProgress: _.mapValues(event.questStage.stageParts, (stagePart) => this.stageInitialTranformers[stagePart.type]()),
               },
            },
         },
      ]);
   };
}

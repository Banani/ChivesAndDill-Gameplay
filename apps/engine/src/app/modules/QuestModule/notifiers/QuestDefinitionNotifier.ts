import { GlobalStoreModule } from '@bananos/types';
import { AllQuestStagePart, ExternalQuestStagePart, KillingQuestStagePart, MovementQuestStagePart, QuestSchema, QuestType } from 'libs/types/src/QuestPackage';
import * as _ from 'lodash';
import { Notifier } from '../../../Notifier';
import { CharacterType, EngineEventHandler } from '../../../types';
import { ConversationWithNpcStartedEvent, NpcEngineEvents } from '../../NpcModule/Events';
import { NewQuestStageStartedEvent, QuestEngineEvents } from '../Events';

export class QuestDefinitionNotifier extends Notifier<QuestSchema> {
   constructor() {
      super({ key: GlobalStoreModule.QUEST_DEFINITION });
      this.eventsToHandlersMap = {
         [NpcEngineEvents.ConversationWithNpcStarted]: this.handleConversationWithNpcStarted,
         [QuestEngineEvents.NewQuestStageStarted]: this.handleNewQuestStageStarted,
      };
   }

   stageTranformers: Record<QuestType, (questStagePart: AllQuestStagePart) => ExternalQuestStagePart> = {
      [QuestType.MOVEMENT]: (questStagePart: MovementQuestStagePart) => ({ type: QuestType.MOVEMENT, description: questStagePart.description }),
      [QuestType.KILLING]: (questStagePart: KillingQuestStagePart) => ({
         type: QuestType.KILLING,
         amount: questStagePart.amount,
         description: questStagePart.description,
      }),
   };

   handleNewQuestStageStarted: EngineEventHandler<NewQuestStageStartedEvent> = ({ event, services }) => {
      const character = services.characterService.getCharacterById(event.characterId);
      if (character.type != CharacterType.Player) {
         return;
      }

      const quest = services.questTemplateService.getData()[event.questId];
      const stageIndex = quest.stageOrder.indexOf(event.questStage.id);

      this.multicastMultipleObjectsUpdate([
         {
            receiverId: character.ownerId,
            objects: {
               [quest.id]: {
                  stageOrder: quest.stageOrder.splice(0, stageIndex),
                  stages: {
                     [event.questStage.id]: {
                        description: event.questStage.description,
                        stageParts: _.mapValues(event.questStage.stageParts, (stagePart) => this.stageTranformers[stagePart.type](stagePart)),
                     },
                  },
               },
            },
         },
      ]);
   };

   handleConversationWithNpcStarted: EngineEventHandler<ConversationWithNpcStartedEvent> = ({ event, services }) => {
      const character = services.characterService.getCharacterById(event.characterId);
      if (character.type != CharacterType.Player) {
         return;
      }
      const npc = services.npcService.getNpcById(event.npcId);
      const { quests } = services.npcTemplateService.getData()[npc.templateId];

      if (!quests) {
         return;
      }

      this.multicastMultipleObjectsUpdate([{ receiverId: character.ownerId, objects: this.getOnlyFirstStage(quests) }]);
   };

   getOnlyFirstStage = (quests: Record<string, QuestSchema>) =>
      _.mapValues(quests, (quest) => ({
         name: quest.name,
         description: quest.description,
         questReward: quest.questReward,
         stageOrder: [quest.stageOrder[0]],
         stages: {
            [quest.stageOrder[0]]: {
               description: quest.stages[quest.stageOrder[0]].description,
               stageParts: _.mapValues(quest.stages[quest.stageOrder[0]].stageParts, (stagePart) => this.stageTranformers[stagePart.type](stagePart)),
            },
         },
      }));
}

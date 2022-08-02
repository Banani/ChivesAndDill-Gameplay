import { QuestProgress } from 'libs/types/src/QuestPackage';
import { filter, forEach, keyBy, mapValues } from 'lodash';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { PlayerCharacterCreatedEvent, PlayerEngineEvents } from '../../PlayerModule/Events';
import {
   NewQuestStageStartedEvent,
   QuestCompletedEvent,
   QuestEngineEvents,
   QuestStartedEvent,
   StagePartCompletedEvent,
   StartNewQuestStagePartEvent,
   StartQuestEvent,
} from '../Events';
import { Quests } from '../Quests';

export class QuestProgressService extends EventParser {
   questProgress: Record<string, Record<string, QuestProgress>> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [QuestEngineEvents.StartQuest]: this.handleStartQuest,
         [QuestEngineEvents.StagePartCompleted]: this.handleStagePartCompleted,
         [PlayerEngineEvents.PlayerCharacterCreated]: this.handlePlayerCharacterCreated,
      };
   }

   handlePlayerCharacterCreated: EngineEventHandler<PlayerCharacterCreatedEvent> = ({ event, services }) => {
      this.questProgress[event.playerCharacter.id] = {};
   };

   handleStartQuest: EngineEventHandler<StartQuestEvent> = ({ event, services }) => {
      const quest = Quests[event.questId];
      this.engineEventCrator.asyncCeateEvent<QuestStartedEvent>({
         type: QuestEngineEvents.QuestStarted,
         questTemplate: {
            id: quest.id,
            name: quest.name,
            description: quest.description,
         },
         characterId: event.characterId,
      });

      const firstStageId = quest.stageOrder[0];
      this.startAllStagesParts({
         characterId: event.characterId,
         stageId: firstStageId,
         questId: quest.id,
      });
   };

   startAllStagesParts = ({ characterId, stageId, questId }: { characterId: string; stageId: string; questId: string }) => {
      this.questProgress[characterId][questId] = {
         completed: false,
         stageId: stageId,
         stagesParts: mapValues(keyBy(Quests[questId].stages[stageId].stageParts, 'id'), () => false),
      };

      this.engineEventCrator.asyncCeateEvent<NewQuestStageStartedEvent>({
         type: QuestEngineEvents.NewQuestStageStarted,
         questId,
         characterId,
         questStage: Quests[questId].stages[stageId],
      });

      forEach(Quests[questId].stages[stageId].stageParts, (stagePart) => {
         this.engineEventCrator.asyncCeateEvent<StartNewQuestStagePartEvent>({
            type: QuestEngineEvents.StartNewQuestStagePart,
            characterId,
            stagePart,
         });
      });
   };

   handleStagePartCompleted: EngineEventHandler<StagePartCompletedEvent> = ({ event, services }) => {
      const { stagesParts } = this.questProgress[event.characterId][event.questId];
      stagesParts[event.stagePartId] = true;
      const remainingStages = filter(stagesParts, (stage) => !stage).length;

      if (!remainingStages) {
         const { stageOrder } = Quests[event.questId];
         const completedStageIndex = stageOrder.indexOf(event.stageId);

         if (completedStageIndex === stageOrder.length - 1) {
            this.questProgress[event.characterId][event.questId].completed = true;
            this.engineEventCrator.asyncCeateEvent<QuestCompletedEvent>({
               type: QuestEngineEvents.QuestCompleted,
               questId: event.questId,
               characterId: event.characterId,
            });
         } else {
            this.startAllStagesParts({
               characterId: event.characterId,
               stageId: stageOrder[completedStageIndex + 1],
               questId: event.questId,
            });
         }
      }
   };
}

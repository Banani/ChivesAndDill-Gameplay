import { KillingQuestStagePartComparison } from '@bananos/types';
import { KillingQuestStagePartStatus, QuestResetEvent, QuestType } from 'libs/types/src/QuestPackage';
import { find, forEach } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { Character, CharacterDiedEvent, EngineEventHandler } from '../../../types';
import { CharacterEngineEvents, CharacterLostHpEvent } from '../../CharacterModule/Events';
import { KillingStagePartProgress, QuestEngineEvents, StagePartCompletedEvent, StartNewQuestStagePartEvent } from '../Events';

const comparators: Record<KillingQuestStagePartComparison, (character: Character, fieldName: string, value: string) => boolean> = {
   [KillingQuestStagePartComparison.equality]: (character: Character, fieldName: string, value: string) => character[fieldName] === value,
};

export class KillingQuestService extends EventParser {
   activeStages: Record<string, Record<string, KillingQuestStagePartStatus>> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [QuestEngineEvents.StartNewQuestStagePart]: this.handleStartNewQuestStagePart,
         [EngineEvents.CharacterDied]: this.handleCharacterDied,
         [CharacterEngineEvents.CharacterLostHp]: this.handleCharacterLostHp,
      };
   }

   handleStartNewQuestStagePart: EngineEventHandler<StartNewQuestStagePartEvent> = ({ event }) => {
      if (event.stagePart.type !== QuestType.KILLING) {
         return;
      }

      if (!this.activeStages[event.characterId]) {
         this.activeStages[event.characterId] = {};
      }

      this.activeStages[event.characterId][event.stagePart.id] = { currentAmount: 0, ...event.stagePart };
   };

   handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event }) => {
      if (this.activeStages[event.killerId]) {
         forEach(this.activeStages[event.killerId], (stagePart) => {
            const matched = find(stagePart.rule, (rule) => comparators[rule.comparison](event.character, rule.fieldName, rule.value));

            if (matched) {
               stagePart.currentAmount++;
               this.engineEventCrator.asyncCeateEvent<KillingStagePartProgress>({
                  type: QuestEngineEvents.KillingStagePartProgress,
                  questId: stagePart.questId,
                  stageId: stagePart.stageId,
                  characterId: event.killerId,
                  stagePartId: stagePart.id,
                  currentProgress: stagePart.currentAmount,
                  targetAmount: stagePart.amount,
               });

               if (stagePart.currentAmount === stagePart.amount) {
                  this.engineEventCrator.asyncCeateEvent<StagePartCompletedEvent>({
                     type: QuestEngineEvents.StagePartCompleted,
                     questId: stagePart.questId,
                     stageId: stagePart.stageId,
                     characterId: event.killerId,
                     stagePartId: stagePart.id,
                  });
                  delete this.activeStages[event.killerId][stagePart.id];
               }
            }
         });
      }
   };

   handleCharacterLostHp: EngineEventHandler<CharacterLostHpEvent> = ({ event }) => {
      const stages = this.activeStages[event.characterId];
      if (stages) {
         forEach(stages, (stagePart) => {
            if (stagePart.resetConditions?.some((condition) => condition.type === QuestResetEvent.PlayerLostHp)) {
               stagePart.currentAmount = 0;

               this.engineEventCrator.asyncCeateEvent<KillingStagePartProgress>({
                  type: QuestEngineEvents.KillingStagePartProgress,
                  questId: stagePart.questId,
                  stageId: stagePart.stageId,
                  characterId: event.characterId,
                  stagePartId: stagePart.id,
                  currentProgress: stagePart.currentAmount,
                  targetAmount: stagePart.amount,
               });
            }
         });
      }
   };
}

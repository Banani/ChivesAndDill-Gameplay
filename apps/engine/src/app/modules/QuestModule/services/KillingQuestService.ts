import * as _ from 'lodash';
import { forEach, find } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { Character, CharacterDiedEvent, CharacterLostHpEvent, EngineEventHandler } from '../../../types';
import { KillingStagePartProgress, QuestEngineEvents, StagePartCompletedEvent, StartNewQuestKillingStagePartEvent } from '../Events';
import { KillingQuestStagePartComparison, KillingQuestStagePartStatus, QuestResetEvent } from '../types';

const comparators: Record<KillingQuestStagePartComparison, (character: Character, fieldName: string, value: string) => boolean> = {
   [KillingQuestStagePartComparison.equality]: (character: Character, fieldName: string, value: string) => character[fieldName] === value,
};

export class KillingQuestService extends EventParser {
   activeStages: Record<string, Record<string, KillingQuestStagePartStatus>> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [QuestEngineEvents.START_NEW_QUEST_KILLING_STAGE_PART]: this.handleStartNewQuestKillingStagePart,
         [EngineEvents.CharacterDied]: this.handleCharacterDied,
         [EngineEvents.CharacterLostHp]: this.handleCharacterLostHp,
      };
   }

   handleStartNewQuestKillingStagePart: EngineEventHandler<StartNewQuestKillingStagePartEvent> = ({ event }) => {
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
               this.engineEventCrator.createEvent<KillingStagePartProgress>({
                  type: QuestEngineEvents.KILLING_STAGE_PART_PROGRESS,
                  questId: stagePart.questId,
                  stageId: stagePart.stageId,
                  characterId: event.killerId,
                  stagePartId: stagePart.id,
                  currentProgress: stagePart.currentAmount,
                  targetAmount: stagePart.amount,
               });

               if (stagePart.currentAmount === stagePart.amount) {
                  this.engineEventCrator.createEvent<StagePartCompletedEvent>({
                     type: QuestEngineEvents.STAGE_PART_COMPLETED,
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

               this.engineEventCrator.createEvent<KillingStagePartProgress>({
                  type: QuestEngineEvents.KILLING_STAGE_PART_PROGRESS,
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

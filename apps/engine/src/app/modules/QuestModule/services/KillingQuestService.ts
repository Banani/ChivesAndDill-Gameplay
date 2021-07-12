import { forEach, find } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { Character, CharacterDiedEvent, EngineEventHandler } from '../../../types';
import { KillingStagePartProgress, QuestEngineEvents, StagePartCompletedEvent, StartNewQuestKillingStagePartEvent } from '../Events';
import { KillingQuestStagePartComparison, KillingQuestStagePartStatus } from '../types';

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
      };
   }

   handleStartNewQuestKillingStagePart: EngineEventHandler<StartNewQuestKillingStagePartEvent> = ({ event }) => {
      if (!this.activeStages[event.characterId]) {
         this.activeStages[event.characterId] = {};
      }
      this.activeStages[event.characterId][event.stagePart.id] = { currentAmount: 0, ...event.stagePart };
   };

   handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event }) => {
      if (this.activeStages[event.killer.id]) {
         forEach(this.activeStages[event.killer.id], (stagePart) => {
            const matched = find(stagePart.rule, (rule) => comparators[rule.comparison](event.character, rule.fieldName, rule.value));

            if (matched) {
               stagePart.currentAmount++;
               this.engineEventCrator.createEvent<KillingStagePartProgress>({
                  type: QuestEngineEvents.KILLING_STAGE_PART_PROGRESS,
                  questId: stagePart.questId,
                  stageId: stagePart.stageId,
                  characterId: event.killer.id,
                  stagePartId: stagePart.id,
                  currentProgress: stagePart.currentAmount,
                  targetAmount: stagePart.amount,
               });

               if (stagePart.currentAmount === stagePart.amount) {
                  this.engineEventCrator.createEvent<StagePartCompletedEvent>({
                     type: QuestEngineEvents.STAGE_PART_COMPLETED,
                     questId: stagePart.questId,
                     stageId: stagePart.stageId,
                     characterId: event.killer.id,
                     stagePartId: stagePart.id,
                  });
                  delete this.activeStages[event.killer.id][stagePart.id];
               }
            }
         });
      }
   };
}

import { forEach } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { distanceBetweenTwoPoints } from '../../../math';
import { EngineEventHandler, PlayerMovedEvent } from '../../../types';
import { QuestEngineEvents, StartNewQuestMovementStagePartEvent, StagePartCompletedEvent } from '../Events';
import { MovementQuestStagePart } from '../types';

export class MovementQuestService extends EventParser {
   activeStages: Record<string, Record<string, MovementQuestStagePart>> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [QuestEngineEvents.START_NEW_QUEST_MOVEMENT_STAGE_PART]: this.handleStartNewQuestMovementStagePart,
         [EngineEvents.PlayerMoved]: this.handlePlayerMoved,
      };
   }

   handleStartNewQuestMovementStagePart: EngineEventHandler<StartNewQuestMovementStagePartEvent> = ({ event }) => {
      if (!this.activeStages[event.characterId]) {
         this.activeStages[event.characterId] = {};
      }
      this.activeStages[event.characterId][event.stagePart.id] = event.stagePart;
   };

   handlePlayerMoved: EngineEventHandler<PlayerMovedEvent> = ({ event }) => {
      if (!this.activeStages[event.characterId]) {
         return;
      }

      forEach(this.activeStages[event.characterId], (stagePart) => {
         if (distanceBetweenTwoPoints(event.newLocation, stagePart.targetLocation) <= stagePart.acceptableRange) {
            this.engineEventCrator.asyncCeateEvent<StagePartCompletedEvent>({
               type: QuestEngineEvents.STAGE_PART_COMPLETED,
               questId: stagePart.questId,
               stageId: stagePart.stageId,
               characterId: event.characterId,
               stagePartId: stagePart.id,
            });
            delete this.activeStages[event.characterId][stagePart.id];
         }
      });
   };
}

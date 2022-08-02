import { MovementQuestStagePart, QuestType } from 'libs/types/src/QuestPackage';
import { forEach } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EventParser } from '../../../EventParser';
import { distanceBetweenTwoPoints } from '../../../math';
import { EngineEventHandler, PlayerMovedEvent } from '../../../types';
import { QuestEngineEvents, StagePartCompletedEvent, StartNewQuestStagePartEvent } from '../Events';

export class MovementQuestService extends EventParser {
   activeStages: Record<string, Record<string, MovementQuestStagePart>> = {};

   constructor() {
      super();
      this.eventsToHandlersMap = {
         [QuestEngineEvents.StartNewQuestStagePart]: this.handleStartNewQuestStagePart,
         [EngineEvents.PlayerMoved]: this.handlePlayerMoved,
      };
   }

   handleStartNewQuestStagePart: EngineEventHandler<StartNewQuestStagePartEvent> = ({ event }) => {
      if (event.stagePart.type !== QuestType.MOVEMENT) {
         return;
      }

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
               type: QuestEngineEvents.StagePartCompleted,
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

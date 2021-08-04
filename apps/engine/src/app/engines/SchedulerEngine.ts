import { forEach } from 'lodash';
import { Engine } from '../Engine';
import { EngineEvents } from '../EngineEvents';
import { ScheduledAction } from '../services/SchedulerService';
import { ScheduleActionFinishedEvent, ScheduleActionTriggeredEvent } from '../types';

export class SchedulerEngine extends Engine {
   tickTime: Record<string, number> = {};

   isNotReadyToBeTriggered = (scheduledAction: ScheduledAction) =>
      this.tickTime[scheduledAction.id] && this.tickTime[scheduledAction.id] + scheduledAction.frequency > Date.now();

   hasEnded = (scheduledAction: ScheduledAction) => scheduledAction.perdiod && scheduledAction.creationTimestamp + scheduledAction.perdiod > Date.now();

   clearActionData = (id: string) => {
      delete this.tickTime[id];
   };

   doAction() {
      forEach(this.services.schedulerService.getActiveActions(), (scheduledAction) => {
         if (this.isNotReadyToBeTriggered(scheduledAction)) {
            return;
         } else if (this.hasEnded(scheduledAction)) {
            this.eventCrator.createEvent<ScheduleActionFinishedEvent>({
               type: EngineEvents.ScheduleActionFinished,
               id: scheduledAction.id,
            });
            return;
         }

         this.tickTime[scheduledAction.id] = Date.now();

         this.eventCrator.createEvent<ScheduleActionTriggeredEvent>({
            type: EngineEvents.ScheduleActionTriggered,
            id: scheduledAction.id,
         });
      });
   }
}

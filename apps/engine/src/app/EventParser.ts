import { EngineEvents } from './EngineEvents';
import { EngineEventCrator } from './EngineEventsCreator';
import { EngineEvent } from './types';
import { Services } from './types/Services';

export abstract class EventParser {
   engineEventCrator: EngineEventCrator;
   eventsToHandlersMap: Partial<Record<EngineEvents, ({ event, services }: { event: EngineEvent; services: Services }) => void>> = {};

   init(engineEventCrator: EngineEventCrator, services?: Services) {
      this.engineEventCrator = engineEventCrator;
   }

   handleEvent<EventType extends EngineEvent>({ event, services }: { event: EventType; services: Services }) {
      if (this.eventsToHandlersMap[event.type]) {
         this.eventsToHandlersMap[event.type]({ event, services });
      }
   }
}

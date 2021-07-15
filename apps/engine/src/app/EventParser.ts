import { EngineEventCrator } from './EngineEventsCreator';
import { MonsterEngineEventsMap } from './modules/MonsterModule/Events';
import { QuestEngineEventsMap } from './modules/QuestModule/Events';
import { EngineEvent, EngineEventsMap } from './types';
import { Services } from './types/Services';

export abstract class EventParser {
   engineEventCrator: EngineEventCrator;
   eventsToHandlersMap: Partial<EngineEventsMap & QuestEngineEventsMap & MonsterEngineEventsMap> = {};

   init(engineEventCrator: EngineEventCrator, services?: Services) {
      this.engineEventCrator = engineEventCrator;
   }

   handleEvent<EventType extends EngineEvent>({ event, services }: { event: EventType; services: Services }) {
      if (this.eventsToHandlersMap[event.type]) {
         this.eventsToHandlersMap[event.type]({ event: event as any, services });
      }
   }
}

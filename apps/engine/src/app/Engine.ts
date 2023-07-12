import type { EngineEventCrator } from './EngineEventsCreator';
import type { Services } from './types/Services';

export abstract class Engine {
   eventCrator: EngineEventCrator;
   services: Services;

   init(eventCrator, services) {
      this.eventCrator = eventCrator;
      this.services = services;
   }

   abstract doAction();
}

import { EngineEventCrator } from './EngineEventsCreator';
import { Services } from './types/Services';

export abstract class Engine {
   eventCrator: EngineEventCrator;
   services: Services;

   init(eventCrator, services) {
      this.eventCrator = eventCrator;
      this.services = services;
   }

   abstract doAction();
}

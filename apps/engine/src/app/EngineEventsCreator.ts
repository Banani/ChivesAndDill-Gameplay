import { each } from 'lodash';
import { EventParser } from './EventParser';
import { EngineEvent } from './types';
import { Services } from './types/Services';

export class EngineEventCrator {
   services: Services;
   eventsToBeProcessed: EngineEvent[] = [];

   constructor(services: Services) {
      this.services = services;

      each(this.services, (service) => service.init(this, { ...this.services }));
   }

   createEvent<T extends EngineEvent>(event: T) {
      this.asyncCeateEvent(event);
      this.processEvents();
   }

   processEvents = () => {
      while (this.eventsToBeProcessed.length > 0) {
         const eventToBeProcessed = this.eventsToBeProcessed.shift();
         each(this.services, (service: EventParser) => {
            service.handleEvent({
               event: eventToBeProcessed,
               services: this.services,
            });
         });
      }
   };

   asyncCeateEvent<T extends EngineEvent>(event: T) {
      this.eventsToBeProcessed.push(event);
   }
}

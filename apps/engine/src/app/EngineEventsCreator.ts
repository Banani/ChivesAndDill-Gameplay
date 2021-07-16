import { each } from 'lodash';
import { EventParser } from './EventParser';
import { EngineEvent } from './types';
import { Services } from './types/Services';

export class EngineEventCrator {
   services: Services;

   constructor(services: Services) {
      this.services = services;

      each(this.services, (service) => service.init(this, { ...this.services }));
   }

   createEvent<T extends EngineEvent>(event: T) {
      setTimeout(() => {
         each(this.services, (service: EventParser) => {
            service.handleEvent<T>({
               event,
               services: this.services,
            });
         });
      }, 0);
   }
}

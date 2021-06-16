import _ from 'lodash';
import { EventParser } from './EventParser';
import { EngineEvent } from './types';

export class EngineEventCrator {
  services: Record<string, EventParser>;

  constructor(services: Record<string, EventParser>) {
    this.services = services;

    _.each(this.services, (service) =>
      service.init(this, { eventCreatorService: this, ...this.services })
    );
  }

  createEvent<T extends EngineEvent>(event: T) {
    _.each(this.services, (service: EventParser) => {
      service.handleEvent<T>({
        event,
        services: this.services,
      });
    });
  }
}

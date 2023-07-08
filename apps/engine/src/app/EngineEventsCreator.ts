import { each } from 'lodash';
import { EventParser } from './EventParser';
import { Notifier } from './Notifier';
import { EngineEvent } from './types';
import { Services } from './types/Services';

export class EngineEventCrator {
    services: Services;
    eventParsers: EventParser[];
    eventsToBeProcessed: EngineEvent[] = [];

    constructor(services: Services, notifiers: Notifier<any>[]) {
        this.services = services;
        this.eventParsers = Object.keys(services)
            .map((serviceName) => services[serviceName])
            .concat(notifiers);

        each(this.eventParsers, (service) => service.init(this, { ...this.services }));
    }

    createEvent<T extends EngineEvent>(event: T) {
        this.eventsToBeProcessed.push(event);
        this.processEvents();
    }

    processEvents = () => {
        while (this.eventsToBeProcessed.length > 0) {
            const eventToBeProcessed = this.eventsToBeProcessed.shift();
            each(this.eventParsers, (service: EventParser) => {
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

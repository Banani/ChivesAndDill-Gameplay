import _ from 'lodash';

export class EngineEventCrator {
  services: any;

  constructor(services) {
    this.services = services;

    _.each(this.services, (service) =>
      service.init(this, { eventCreatorService: this, ...this.services })
    );
  }

  createEvent(event) {
    _.each(this.services, (service) => {
      service.handleEvent({
        event,
        services: this.services,
      });
    });
  }
}

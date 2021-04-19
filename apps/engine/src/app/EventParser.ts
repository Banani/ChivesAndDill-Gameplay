import { EngineEventCrator } from './EngineEventsCreator';

export abstract class EventParser {
  engineEventCrator: EngineEventCrator;
  eventsToHandlersMap = {};

  init(engineEventCrator: EngineEventCrator, services?) {
    this.engineEventCrator = engineEventCrator;
  }

  handleEvent({ event, services }) {
    if (this.eventsToHandlersMap[event.type]) {
      this.eventsToHandlersMap[event.type]({ event, services });
    }
  }
}

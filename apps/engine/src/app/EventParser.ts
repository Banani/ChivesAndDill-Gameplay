import { EngineEvents } from './EngineEvents';
import { EngineEventCrator } from './EngineEventsCreator';
import { EngineEvent } from './types';

export abstract class EventParser {
  engineEventCrator: EngineEventCrator;
  eventsToHandlersMap: Partial<
    Record<
      EngineEvents,
      ({ event, services }: { event: EngineEvent; services: any }) => void
    >
  > = {};

  init(engineEventCrator: EngineEventCrator, services?) {
    this.engineEventCrator = engineEventCrator;
  }

  handleEvent<EventType extends EngineEvent>({
    event,
    services,
  }: {
    event: EventType;
    services: any;
  }) {
    if (this.eventsToHandlersMap[event.type]) {
      this.eventsToHandlersMap[event.type]({ event, services });
    }
  }
}

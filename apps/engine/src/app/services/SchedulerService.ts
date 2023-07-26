import { EngineEvents } from '../EngineEvents';
import { EngineEventCrator } from '../EngineEventsCreator';
import { SchedulerEngine } from '../engines/SchedulerEngine';
import { EventParser } from '../EventParser';
import { CancelScheduledActionEvent, EngineEventHandler, ScheduleActionEvent, ScheduleActionFinishedEvent } from '../types';

export interface ScheduledAction {
    id: string;
    frequency: number;
    perdiod?: number;
    creationTimestamp: number;
}

export class SchedulerService extends EventParser {
    private activeActions: Record<string, ScheduledAction> = {};
    private schedulerEngine: SchedulerEngine;

    constructor(schedulerEngine: SchedulerEngine) {
        super();
        this.schedulerEngine = schedulerEngine;
        this.eventsToHandlersMap = {
            [EngineEvents.ScheduleAction]: this.handleScheduleAction,
            [EngineEvents.CancelScheduledAction]: this.handleCancelScheduledAction,
            [EngineEvents.ScheduleActionFinished]: this.handleScheduleActionFinished
        };
    }

    init(engineEventCrator: EngineEventCrator, services) {
        super.init(engineEventCrator);
        this.schedulerEngine.init(this.engineEventCrator, services);
    }

    handleScheduleAction: EngineEventHandler<ScheduleActionEvent> = ({ event }) => {
        this.activeActions[event.id] = {
            id: event.id,
            frequency: event.frequency,
            perdiod: event.perdiod,
            creationTimestamp: Date.now(),
        };
    };

    handleCancelScheduledAction: EngineEventHandler<CancelScheduledActionEvent> = ({ event }) => {
        delete this.activeActions[event.id];
        this.schedulerEngine.clearActionData(event.id);
    };

    handleScheduleActionFinished: EngineEventHandler<ScheduleActionFinishedEvent> = ({ event }) => {
        delete this.activeActions[event.id];
        this.schedulerEngine.clearActionData(event.id);
    };

    getActiveActions = () => this.activeActions;
}

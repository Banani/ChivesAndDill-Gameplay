import * as _ from 'lodash';
import { merge } from 'lodash';
import type { Engine } from '../Engine';
import { EngineEventCrator } from '../EngineEventsCreator';
import type { Notifier } from '../Notifier';
import { DbService, PathFinderService, SocketConnectionService } from '../services';
import { RandomGeneratorService } from '../services/RandomGeneratorService';
import { SchedulerService } from '../services/SchedulerService';
import type { EngineEvent } from '../types';
import type { EngineModule } from '../types/EngineModule';
import type { Services } from '../types/Services';
import { PathFinderEngine } from './PathFinderEngine';
import { SchedulerEngine } from './SchedulerEngine';

export class MainEngine {
    private engineEventCreator: EngineEventCrator;
    private socketConnectionService: SocketConnectionService;
    private fastEngines: Engine[];
    private slowEngines: Engine[];
    private notifiers: Notifier<any>[];

    constructor(io: any, modules: EngineModule<any>[]) {
        const pathFinderEngine = new PathFinderEngine();
        const schedulerEngine = new SchedulerEngine();

        this.fastEngines = [..._.flatten(modules.filter((module) => module.fastEngines).map((module) => module.fastEngines)), pathFinderEngine, schedulerEngine];
        this.slowEngines = _.flatten(modules.filter((module) => module.slowEngines).map((module) => module.slowEngines));
        this.notifiers = _.flatten(modules.filter((module) => module.notifiers).map((module) => module.notifiers));

        this.socketConnectionService = new SocketConnectionService(io, this.notifiers);

        const services: Services = _.merge(
            {},
            _.map(
                _.pickBy(modules, (module) => module.services),
                (module) => module.services
            ).reduce((currentServices, allServices) => merge({}, currentServices, allServices)),
            {
                randomGeneratorService: new RandomGeneratorService(),
                pathFinderService: new PathFinderService(pathFinderEngine),
                schedulerService: new SchedulerService(schedulerEngine),
                dbService: new DbService(),
                socketConnectionService: this.socketConnectionService,
            }
        );

        this.engineEventCreator = new EngineEventCrator(services, this.notifiers);
    }

    start() {
        const startTime = Date.now();
        let i = 0;
        setInterval(() => {
            this.engineEventCreator.processEvents();
            this.fastEngines.forEach((engine) => engine.doAction());
            this.socketConnectionService.sendMessages();
            i++;
            //    console.log(1000 / ((Date.now() - startTime) / i));
        }, 1000 / 60);

        setInterval(() => {
            this.slowEngines.forEach((engine) => engine.doAction());
        }, 250);
    }

    doActions() {
        this.engineEventCreator.processEvents();

        this.fastEngines.forEach((engine) => engine.doAction());
        this.slowEngines.forEach((engine) => engine.doAction());

        this.socketConnectionService.sendMessages();
    }

    createEvent<T extends EngineEvent>(event: T) {
        this.engineEventCreator.asyncCeateEvent<T>(event);
    }

    getNotifiers = () => this.notifiers;
}

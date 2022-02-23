import * as _ from 'lodash';
import { merge } from 'lodash';
import { EngineEventCrator } from '../EngineEventsCreator';
import { PathFinderService, SocketConnectionService } from '../services';
import { SchedulerService } from '../services/SchedulerService';
import { EngineModule } from '../types/EngineModule';
import { Services } from '../types/Services';
import { PathFinderEngine } from './PathFinderEngine';
import { SchedulerEngine } from './SchedulerEngine';

export class MainEngine {
   private modules: EngineModule[];
   private io: any;

   constructor(io: any, modules: EngineModule<any>[]) {
      this.modules = modules;
      this.io = io;
   }

   start() {
      const pathFinderEngine = new PathFinderEngine();
      const schedulerEngine = new SchedulerEngine();

      const fastEngines = [
         ..._.flatten(this.modules.filter((module) => module.fastEngines).map((module) => module.fastEngines)),
         pathFinderEngine,
         schedulerEngine,
      ];

      const slowEngines = _.flatten(this.modules.filter((module) => module.slowEngines).map((module) => module.slowEngines));

      const notifiers = _.flatten(this.modules.filter((module) => module.notifiers).map((module) => module.notifiers));

      const socketConnectionService = new SocketConnectionService(this.io, notifiers);

      const services: Services = _.merge(
         {},
         _.map(
            _.pickBy(this.modules, (module) => module.services),
            (module) => module.services
         ).reduce((currentServices, allServices) => merge({}, currentServices, allServices)),
         {
            pathFinderService: new PathFinderService(pathFinderEngine),
            schedulerService: new SchedulerService(schedulerEngine),
            socketConnectionService,
         }
      );

      const engineEventCreator = new EngineEventCrator(services, notifiers);

      const startTime = Date.now();
      let i = 0;
      setInterval(() => {
         engineEventCreator.processEvents();
         fastEngines.forEach((engine) => engine.doAction());
         socketConnectionService.sendMessages();
         i++;
         //    console.log(1000 / ((Date.now() - startTime) / i));
      }, 1000 / 60);

      setInterval(() => {
         slowEngines.forEach((engine) => engine.doAction());
      }, 1000);
   }
}

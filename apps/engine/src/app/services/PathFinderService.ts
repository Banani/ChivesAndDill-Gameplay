import { EngineEvents } from '../EngineEvents';
import { EngineEventCrator } from '../EngineEventsCreator';
import { PathFinderEngine } from '../engines';
import { EventParser } from '../EventParser';
import { Location } from '../types/Location';
import { CreatePathEvent, EngineEventHandler, UpdatePathEvent } from '../types';

interface Path {
   pathSeekerId: string;
   targetId: string;
   points: Location[];
}

export class PathFinderService extends EventParser {
   private activePaths: Record<string, Path> = {};
   private pathFinderEngine: PathFinderEngine;

   constructor(pathFinderEngine: PathFinderEngine) {
      super();
      this.pathFinderEngine = pathFinderEngine;
      this.eventsToHandlersMap = {
         [EngineEvents.CreatePath]: this.handleCreatePath,
         [EngineEvents.UpdatePath]: this.handleUpdatePath,
      };
   }

   init(engineEventCrator: EngineEventCrator, services) {
      super.init(engineEventCrator);
      this.pathFinderEngine.init(this.engineEventCrator, services);
   }

   handleCreatePath: EngineEventHandler<CreatePathEvent> = ({ event }) => {
      this.activePaths[event.pathSeekerId] = {
         pathSeekerId: event.pathSeekerId,
         targetId: event.targetId,
         points: [],
      };
   };

   handleUpdatePath: EngineEventHandler<UpdatePathEvent> = ({ event }) => {
      this.activePaths[event.pathSeekerId] = {
         ...this.activePaths[event.pathSeekerId],
         points: event.points,
      };
   };

   getActivePaths = () => this.activePaths;

   getNextDirection = (targetId: string) => this.activePaths[targetId].points[0];
}

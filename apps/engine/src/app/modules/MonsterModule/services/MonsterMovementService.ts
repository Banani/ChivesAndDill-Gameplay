import { EngineEvents } from '../../../EngineEvents';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { CreatePathEvent, EngineEventHandler } from '../../../types';
import { MonsterMovementEngine } from '../engines/MonsterMovementEngine';
import { MonsterEngineEvents, MonsterPulledEvent } from '../Events';

export class MonsterMovementService extends EventParser {
   monsterMovementEngine: MonsterMovementEngine;

   constructor(monsterMovementEngine: MonsterMovementEngine) {
      super();
      this.monsterMovementEngine = monsterMovementEngine;
      this.eventsToHandlersMap = {
         [MonsterEngineEvents.MonsterPulled]: this.handleMonsterPulled,
      };
   }

   init(engineEventCrator: EngineEventCrator, services) {
      super.init(engineEventCrator);
      this.monsterMovementEngine.init(this.engineEventCrator, services);
   }

   handleMonsterPulled: EngineEventHandler<MonsterPulledEvent> = ({ event }) => {
      this.engineEventCrator.asyncCeateEvent<CreatePathEvent>({
         type: EngineEvents.CreatePath,
         pathSeekerId: event.monster.id,
         targetId: event.targetId,
      });
   };
}

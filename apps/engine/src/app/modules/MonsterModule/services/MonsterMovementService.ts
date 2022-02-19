import { EngineEvents } from '../../../EngineEvents';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { CreatePathEvent, DeletePathEvent, EngineEventHandler } from '../../../types';
import { MonsterMovementEngine } from '../engines/MonsterMovementEngine';
import { MonsterEngineEvents, MonsterLostAggroEvent, MonsterPulledEvent } from '../Events';

export class MonsterMovementService extends EventParser {
   monsterMovementEngine: MonsterMovementEngine;

   constructor(monsterMovementEngine: MonsterMovementEngine) {
      super();
      this.monsterMovementEngine = monsterMovementEngine;
      this.eventsToHandlersMap = {
         [MonsterEngineEvents.MonsterPulled]: this.handleMonsterPulled,
         [MonsterEngineEvents.MonsterLostAggro]: this.handleMonsterLostAggro,
      };
   }

   init(engineEventCrator: EngineEventCrator, services) {
      super.init(engineEventCrator);
      this.monsterMovementEngine.init(this.engineEventCrator, services);
   }

   handleMonsterPulled: EngineEventHandler<MonsterPulledEvent> = ({ event }) => {
      this.monsterMovementEngine.stopIdleWalking(event.monster.id);
      this.engineEventCrator.asyncCeateEvent<CreatePathEvent>({
         type: EngineEvents.CreatePath,
         pathSeekerId: event.monster.id,
         targetId: event.targetId,
      });
   };

   handleMonsterLostAggro: EngineEventHandler<MonsterLostAggroEvent> = ({ event }) => {
      this.monsterMovementEngine.startIdleWalking(event.monsterId);
      this.engineEventCrator.asyncCeateEvent<DeletePathEvent>({
         type: EngineEvents.DeletePath,
         pathSeekerId: event.monsterId,
      });
   };
}

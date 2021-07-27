import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import { MonsterAttackEngine } from '../engines';
import { MonsterEngineEvents, ScheduleMonsterAttackEvent } from '../Events';

export class MonsterAttackService extends EventParser {
   monsterAttackEngine: MonsterAttackEngine;

   constructor(monsterAttackEngine: MonsterAttackEngine) {
      super();
      this.monsterAttackEngine = monsterAttackEngine;
      this.eventsToHandlersMap = {
         [MonsterEngineEvents.ScheduleMonsterAttack]: this.handleScheduleMonsterAttack,
      };
   }

   init(engineEventCrator: EngineEventCrator, services) {
      super.init(engineEventCrator);
      this.monsterAttackEngine.init(this.engineEventCrator, services);
   }

   handleScheduleMonsterAttack: EngineEventHandler<ScheduleMonsterAttackEvent> = ({ event }) => {
      this.monsterAttackEngine.scheduleAttack(event.monsterId, { spell: event.spell, targetId: event.targetId });
   };
}

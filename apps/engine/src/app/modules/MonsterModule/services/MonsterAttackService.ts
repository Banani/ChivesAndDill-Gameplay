import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { MonsterAttackEngine } from '../engines';

export class MonsterAttackService extends EventParser {
   monsterAttackEngine: MonsterAttackEngine;

   constructor(monsterAttackEngine: MonsterAttackEngine) {
      super();
      this.monsterAttackEngine = monsterAttackEngine;
   }

   init(engineEventCrator: EngineEventCrator, services) {
      super.init(engineEventCrator);
      this.monsterAttackEngine.init(this.engineEventCrator, services);
   }
}

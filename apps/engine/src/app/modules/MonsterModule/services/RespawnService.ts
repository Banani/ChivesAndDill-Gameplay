import { forEach } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { CharacterDiedEvent, EngineEventHandler } from '../../../types';
import { RespawnMonsterEngine } from '../engines';
import { CreateNewMonsterEvent, MonsterDiedEvent, MonsterEngineEvents, RespawnMonsterEvent } from '../Events';
import { MonsterRespawns } from '../MonsterRespawns';
import { Monster } from '../types';

interface MonsterDead {
   deadTime: number;
}

export class RespawnService extends EventParser {
   respawnMonsterEngine: RespawnMonsterEngine;
   waitingRespawns: Record<string, MonsterDead> = {};

   constructor(respawnMonsterEngine: RespawnMonsterEngine) {
      super();
      this.respawnMonsterEngine = respawnMonsterEngine;
      this.eventsToHandlersMap = {
         [MonsterEngineEvents.MonsterDied]: this.handleMonsterDied,
         [MonsterEngineEvents.RespawnMonster]: this.handleRespawnMonster,
      };
   }

   init(engineEventCrator: EngineEventCrator, services) {
      super.init(engineEventCrator);
      this.respawnMonsterEngine.init(this.engineEventCrator, services);

      forEach(MonsterRespawns, (monsterRespawn) => {
         this.engineEventCrator.asyncCeateEvent<CreateNewMonsterEvent>({
            type: MonsterEngineEvents.CreateNewMonster,
            monsterRespawn,
         });
      });
   }

   handleMonsterDied: EngineEventHandler<MonsterDiedEvent> = ({ event }) => {
      this.waitingRespawns[event.monster.respawnId] = {
         deadTime: Date.now(),
      };
   };

   handleRespawnMonster: EngineEventHandler<RespawnMonsterEvent> = ({ event }) => {
      delete this.waitingRespawns[event.respawnId];
      this.engineEventCrator.asyncCeateEvent<CreateNewMonsterEvent>({
         type: MonsterEngineEvents.CreateNewMonster,
         monsterRespawn: MonsterRespawns[event.respawnId],
      });
   };

   getWaitingRespawns = () => this.waitingRespawns;
}

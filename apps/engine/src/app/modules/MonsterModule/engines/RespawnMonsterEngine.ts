import { forEach } from 'lodash';
import { Engine } from '../../../Engine';
import { MonsterEngineEvents, RespawnMonsterEvent } from '../Events';
import { MonsterRespawns } from '../MonsterRespawns';

export class RespawnMonsterEngine extends Engine {
   doAction() {
      forEach(this.services.respawnService.getWaitingRespawns(), (waitingRespawn, respawnId) => {
         if (Date.now() - waitingRespawn.deadTime >= MonsterRespawns[respawnId].time) {
            this.eventCrator.createEvent<RespawnMonsterEvent>({
               type: MonsterEngineEvents.RespawnMonster,
               respawnId,
            });
         }
      });
   }
}

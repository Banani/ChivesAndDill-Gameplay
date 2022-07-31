import { forEach } from 'lodash';
import { Engine } from '../../../Engine';
import { MonsterEngineEvents, RespawnMonsterEvent } from '../Events';

export class RespawnMonsterEngine extends Engine {
   doAction() {
      const monsterRespawns = this.services.monsterRespawnTemplateService.getData();

      forEach(this.services.respawnService.getWaitingRespawns(), (waitingRespawn, respawnId) => {
         if (Date.now() - waitingRespawn.deadTime >= monsterRespawns[respawnId].time) {
            this.eventCrator.createEvent<RespawnMonsterEvent>({
               type: MonsterEngineEvents.RespawnMonster,
               respawnId,
            });
         }
      });
   }
}

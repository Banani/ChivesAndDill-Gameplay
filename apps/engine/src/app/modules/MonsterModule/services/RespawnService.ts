import { forEach } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { CharacterDiedEvent, CharacterType, EngineEventHandler } from '../../../types';
import { RespawnMonsterEngine } from '../engines';
import { CreateNewMonsterEvent, MonsterEngineEvents, RespawnMonsterEvent } from '../Events';

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
         [EngineEvents.CharacterDied]: this.handleCharacterDied,
         [MonsterEngineEvents.RespawnMonster]: this.handleRespawnMonster,
      };
   }

   init(engineEventCrator: EngineEventCrator, services) {
      super.init(engineEventCrator);
      this.respawnMonsterEngine.init(this.engineEventCrator, services);
      const monsterRespawns = services.monsterRespawnTemplateService.getData();

      forEach(monsterRespawns, (monsterRespawn) => {
         this.engineEventCrator.asyncCeateEvent<CreateNewMonsterEvent>({
            type: MonsterEngineEvents.CreateNewMonster,
            monsterRespawn,
         });
      });
   }

   handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event, services }) => {
      if (event.character.type === CharacterType.Monster) {
         this.waitingRespawns[event.character.respawnId] = {
            deadTime: Date.now(),
         };
      }
   };

   handleRespawnMonster: EngineEventHandler<RespawnMonsterEvent> = ({ event, services }) => {
      const monsterRespawns = services.monsterRespawnTemplateService.getData();
      delete this.waitingRespawns[event.respawnId];

      this.engineEventCrator.asyncCeateEvent<CreateNewMonsterEvent>({
         type: MonsterEngineEvents.CreateNewMonster,
         monsterRespawn: monsterRespawns[event.respawnId],
      });
   };

   getWaitingRespawns = () => this.waitingRespawns;
}

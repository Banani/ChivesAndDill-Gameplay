import { EngineEvents } from '../../../EngineEvents';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { CharacterDiedEvent, EngineEventHandler } from '../../../types';
import { BossFightsTemplates } from '../BossFightsTemplates';
import { BossFightEngine } from '../engines';
import { MonsterDiedEvent, MonsterEngineEvents, MonsterLostAggroEvent, MonsterPulledEvent } from '../Events';

export class BossFightService extends EventParser {
   bossFightEngine: BossFightEngine;

   constructor(bossFightEngine: BossFightEngine) {
      super();
      this.bossFightEngine = bossFightEngine;
      this.eventsToHandlersMap = {
         [MonsterEngineEvents.MonsterPulled]: this.handleMonsterPulled,
         [MonsterEngineEvents.MonsterLostAggro]: this.handleMonsterLostAggro,
         [EngineEvents.CharacterDied]: this.handleCharacterDied,
      };
   }

   init(engineEventCrator: EngineEventCrator, services) {
      super.init(engineEventCrator);
      this.bossFightEngine.init(this.engineEventCrator, services);
   }

   handleMonsterPulled: EngineEventHandler<MonsterPulledEvent> = ({ event }) => {
      if (BossFightsTemplates[event.monster.name]) {
         this.bossFightEngine.startNewBossFight(event.monster);
      }
   };

   handleMonsterLostAggro: EngineEventHandler<MonsterLostAggroEvent> = ({ event }) => {
      this.bossFightEngine.stopBossFight(event.monsterId);
   };

   handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event }) => {
      this.bossFightEngine.stopBossFight(event.characterId);
   };
}

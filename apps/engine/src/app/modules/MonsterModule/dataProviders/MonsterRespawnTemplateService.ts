import { EventParser } from '../../../EventParser';
import { MonsterRespawns } from '../MonsterRespawns';

export class MonsterRespawnTemplateService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {};
   }

   getData = () => MonsterRespawns;
}

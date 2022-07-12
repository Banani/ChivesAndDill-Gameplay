import { EventParser } from '../../../EventParser';
import * as _ from 'lodash';
import { NpcRespawns } from '../NpcRespawns';

export class NpcRespawnTemplateService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {};
   }

   getData = () => NpcRespawns;
}

import { EventParser } from '../../../EventParser';
import { MonsterTemplates } from '../MonsterTemplates';

export class MonsterTemplatesService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {};
   }

   getData = () => MonsterTemplates;
}

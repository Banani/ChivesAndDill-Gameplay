import { EventParser } from '../../../EventParser';
import * as _ from 'lodash';
import { NpcTemplates } from '../NpcTemplate';

export class NpcTemplateService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {};
   }

   getData = () => NpcTemplates;
}

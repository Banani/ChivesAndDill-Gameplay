import { cloneDeep } from 'lodash';
import { EventParser } from '../../../EventParser';
import { ItemTemplates } from '../ItemTemplates';

export class ItemTemplateService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {};
   }

   getData = () => cloneDeep(ItemTemplates);
}

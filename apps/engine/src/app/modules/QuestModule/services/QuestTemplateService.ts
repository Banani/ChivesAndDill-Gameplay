import { EventParser } from '../../../EventParser';
import { Quests } from '../Quests';

export class QuestTemplateService extends EventParser {
   constructor() {
      super();
      this.eventsToHandlersMap = {};
   }

   getData = () => Quests;
}

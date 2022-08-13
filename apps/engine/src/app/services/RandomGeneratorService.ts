const seedrandom = require('seedrandom');
import { EventParser } from '../EventParser';

export class RandomGeneratorService extends EventParser {
   generator;

   constructor() {
      super();
      this.generator = seedrandom('284329238932482');
      this.eventsToHandlersMap = {};
   }

   generateNumber = () => this.generator();
}

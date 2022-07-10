import _ = require('lodash');
import { EngineManager } from '..';

describe('MainEngine', () => {
   it('Each notifier should have unique key', () => {
      const engine = new EngineManager();

      const notifiers = engine.getNotifiers();

      const groupedNotifiers = _.chain(notifiers)
         .filter((notifier) => !!notifier.getNotifierKey)
         .countBy((notifier) => notifier.getNotifierKey())
         .value();

      expect(_.pickBy(groupedNotifiers, (notifier) => notifier > 1)).toStrictEqual({});
   });
});

import { GlobalStoreModule } from '@bananos/types';
import { EngineManager } from '..';
import _ = require('lodash');

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

   it.skip('Each GlobalStoreModule key should have connected notifier', () => {
      const engine = new EngineManager();

      const notifiers = engine.getNotifiers();

      const keys = _.chain(Object.values(GlobalStoreModule))
         .keyBy()
         .mapValues(() => 0)
         .value();

      _.chain(notifiers)
         .filter((notifier) => !!notifier.getNotifierKey)
         .value()
         .forEach((notifier) => {
            keys[notifier.getNotifierKey()]++;
         });

      const notConnectedNotifier = _.pickBy(keys, (el) => !el);

      expect(notConnectedNotifier).toBe({});
   });
});

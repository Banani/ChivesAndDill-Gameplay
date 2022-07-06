import { EngineEventType, EnginePackage, GlobalStoreModule, PartialEnginePackage } from '@bananos/types';
import { merge } from 'lodash';

export const checkIfErrorWasHandled = (moduleName: GlobalStoreModule, message: string, enginePackage: EnginePackage) => {
   expect(enginePackage.errorMessages.events).toStrictEqual([{ message, type: EngineEventType.ErrorMessage }]);
   expect(enginePackage[moduleName]).toBeUndefined();
};

export const checkIfPackageIsValid = (moduleName: GlobalStoreModule, enginePackage: EnginePackage, expectedPackage: Partial<PartialEnginePackage<any>>) => {
   expect(enginePackage.errorMessages?.events ?? []).toStrictEqual([]);
   if (expectedPackage) {
      expect(enginePackage[moduleName]).toStrictEqual(merge(expectedPackage, { key: moduleName }));
   } else {
      expect(enginePackage[moduleName]).toBeUndefined();
   }
};

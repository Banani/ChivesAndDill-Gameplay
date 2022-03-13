import { EngineEventType, EnginePackage, GlobalStoreModule, PartialEnginePackage } from '@bananos/types';
import { merge } from 'lodash';

export const checkIfErrorWasHandled = (moduleName: GlobalStoreModule, message: string, enginePackage: EnginePackage) => {
   expect(enginePackage.errorMessages.events).toStrictEqual([{ message, type: EngineEventType.ErrorMessage }]);
   expect(enginePackage[moduleName]).toStrictEqual({ data: {}, events: [], key: moduleName, toDelete: {} });
};

export const checkIfPackageIsValid = (moduleName: GlobalStoreModule, enginePackage: EnginePackage, expectedPackage: Partial<PartialEnginePackage<any>>) => {
   expect(enginePackage.errorMessages.events).toStrictEqual([]);
   expect(enginePackage[moduleName]).toStrictEqual(merge({ data: {}, events: [], key: moduleName, toDelete: {} }, expectedPackage));
};

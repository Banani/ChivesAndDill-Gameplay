import { EnginePackage, GlobalStoreModule, PartialEnginePackage, PlayerClientEvents } from '@bananos/types';
import { merge, omit } from 'lodash';

export const checkIfErrorWasHandled = (moduleName: GlobalStoreModule, message: string, enginePackage: EnginePackage) => {
    if (!enginePackage.errorMessages) {
        throw new Error('Error message was not sent.');
    }
    expect(enginePackage.errorMessages.events.map(event => omit(event, "id"))).toStrictEqual([{ message, type: PlayerClientEvents.ErrorMessage }]);
    expect(enginePackage[moduleName]).toBeUndefined();
};

export const checkIfPackageIsValid = (moduleName: GlobalStoreModule, enginePackage: EnginePackage, expectedPackage: Partial<PartialEnginePackage<any>>, skipErrorCheck: boolean = false) => {
    if (!skipErrorCheck) {
        expect(enginePackage.errorMessages?.events ?? []).toStrictEqual([]);
    }
    if (expectedPackage) {
        expect(enginePackage[moduleName]).toStrictEqual(merge(expectedPackage, { key: moduleName }));
    } else {
        expect(enginePackage[moduleName]).toBeUndefined();
    }
};

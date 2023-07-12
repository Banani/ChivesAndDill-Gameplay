import { GlobalStoreModule } from '@bananos/types';
import { MockedItemTemplates } from 'apps/engine/src/app/mocks';
import { EngineManager, checkIfPackageIsValid } from '../../../../testUtilities';
import { ItemTemplateService } from '../../services/ItemTemplateService';
import _ = require('lodash');

const CURRENT_MODULE = GlobalStoreModule.BACKPACK_ITEMS;

const setupEngine = () => {
    const itemTemplateService = new ItemTemplateService();
    (itemTemplateService.getData as jest.Mock).mockReturnValue(MockedItemTemplates)

    const engineManager = new EngineManager();

    const players = {
        '1': engineManager.preparePlayerWithCharacter({ name: 'character_1' }),
        '2': engineManager.preparePlayerWithCharacter({ name: 'character_2' }),
        '3': engineManager.preparePlayerWithCharacter({ name: 'character_3' }),
    };

    return { engineManager, players };
};

describe('BackpackItemsContainment', () => {
    it('Player should get information about his empty backpack state', () => {
        const { players, engineManager } = setupEngine();

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['3'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                playerCharacter_3: {
                    '1': {},
                },
            },
        });
    });

    it('Other players should not get information about not their backpack items', () => {
        const { players, engineManager } = setupEngine();
        const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, undefined);
    });
});

import { GlobalStoreModule } from '@bananos/types';
import { MockedItemTemplates } from 'apps/engine/src/app/mocks';
import { checkIfPackageIsValid, EngineManager } from '../../../../testUtilities';
import { ItemTemplateService } from '../../services/ItemTemplateService';

const CURRENT_MODULE = GlobalStoreModule.BACKPACK_SCHEMA;

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

describe('BackpackSchema', () => {
    it('Player should get information about his backpack schema', () => {
        const { players, engineManager } = setupEngine();

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['3'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                playerCharacter_3: {
                    '1': 16,
                    '2': null,
                    '3': null,
                    '4': null,
                    '5': null,
                },
            },
        });
    });

    it('Other players should not get information about not their backpack schemas', () => {
        const { players, engineManager } = setupEngine();
        const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, undefined);
    });
});

import { EquipmentSlot, GlobalStoreModule, ItemClientActions, ItemTemplateType } from '@bananos/types';
import { MockedItemTemplates } from 'apps/engine/src/app/mocks';
import { EngineManager, checkIfPackageIsValid } from '../../../../testUtilities';
import { ItemTemplateService } from '../../services/ItemTemplateService';

const CURRENT_MODULE = GlobalStoreModule.ITEMS;

const setupEngine = () => {
    const itemTemplateService = new ItemTemplateService();
    (itemTemplateService.getData as jest.Mock).mockReturnValue(MockedItemTemplates)

    const engineManager = new EngineManager();

    const players = {
        '1': engineManager.preparePlayerWithCharacter({ name: 'character_1' }),
    };

    return { engineManager, players };
};

describe('Items', () => {
    it('Player should get requested item templates', () => {
        const { players, engineManager } = setupEngine();

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientActions.RequestItemTemplates, itemTemplateIds: ['1', '3'] });

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                '1': {
                    id: '1',
                    image: 'https://www.tibiaitens.com.br/image/cache/catalog/espadas/mercenary-swordtibia-605-500x500.png',
                    name: 'Mercenary sword',
                    value: 1000,
                    type: ItemTemplateType.Equipment,
                    slot: EquipmentSlot.Feet,
                },
                '3': {
                    id: '3',
                    image: 'https://static.wikia.nocookie.net/wowpedia/images/7/78/Inv_misc_fish_24.png',
                    name: 'Mackerel',
                    stack: 20,
                    value: 95,
                    type: ItemTemplateType.Generic,
                },
            },
        });
    });

    it('Player should get undefined, if such item does not exist', () => {
        const { players, engineManager } = setupEngine();
        const RANDOM_ID = 'RANDOM_ID';

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientActions.RequestItemTemplates, itemTemplateIds: [RANDOM_ID] });

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                [RANDOM_ID]: undefined,
            },
        });
    });
});

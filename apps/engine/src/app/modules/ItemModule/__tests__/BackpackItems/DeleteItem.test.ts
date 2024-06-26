import { GlobalStoreModule, ItemClientActions } from '@bananos/types';
import { MockedItemTemplates } from 'apps/engine/src/app/mocks';
import { EngineManager, checkIfErrorWasHandled, checkIfPackageIsValid } from '../../../../testUtilities';
import { GenerateItemForCharacterEvent, ItemEngineEvents } from '../../Events';
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

describe('DeleteItem', () => {
    it('Player should be able to delete his item', () => {
        const { players, engineManager } = setupEngine();
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '1',
            amount: 1,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientActions.DeleteItem, itemId });

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, { toDelete: { [players['1'].characterId]: { '1': { '0': null } } } });
    });

    it('Player should get error when tries to delete item that does not exist', () => {
        const { players, engineManager } = setupEngine();

        const dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientActions.DeleteItem, itemId: 'SOME_ITEM_ID' });

        checkIfErrorWasHandled(CURRENT_MODULE, 'Item does not exist.', dataPackage);
    });

    it('Player should get error when tries to delete item that does not belong to him', () => {
        const { players, engineManager } = setupEngine();
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '1',
            amount: 1,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

        dataPackage = engineManager.callPlayerAction(players['2'].socketId, { type: ItemClientActions.DeleteItem, itemId });

        checkIfErrorWasHandled(CURRENT_MODULE, 'Item does not exist.', dataPackage);
    });
});

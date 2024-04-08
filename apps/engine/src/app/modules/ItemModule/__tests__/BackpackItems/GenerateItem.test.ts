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

describe('GenerateItem', () => {
    it('Should inform player about getting new item', () => {
        const { players, engineManager } = setupEngine();
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '1',
            amount: 1,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                playerCharacter_1: {
                    '1': {
                        '0': {
                            amount: 1,
                            itemId: 'ItemInstance_0',
                            itemTemplateId: "1",
                        },
                    },
                },
            },
        });
    });

    it('should allow to add 16 items to backpack', () => {
        const { players, engineManager } = setupEngine();
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        _.range(0, 16).forEach(() => {
            engineManager.createSystemAction<GenerateItemForCharacterEvent>({
                type: ItemEngineEvents.GenerateItemForCharacter,
                characterId: players['1'].characterId,
                itemTemplateId: '1',
                amount: 1,
            });
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                playerCharacter_1: {
                    "1": {
                        "15": {
                            amount: 1,
                            itemId: "ItemInstance_15",
                            itemTemplateId: "1"
                        }
                    }
                }
            }
        });
    });

    it('should return error message if backpack is full', () => {
        const { players, engineManager } = setupEngine();
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        _.range(0, 17).forEach(() => {
            engineManager.createSystemAction<GenerateItemForCharacterEvent>({
                type: ItemEngineEvents.GenerateItemForCharacter,
                characterId: players['1'].characterId,
                itemTemplateId: '1',
                amount: 1,
            });
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfErrorWasHandled(CURRENT_MODULE, 'Your backpack is full.', dataPackage);
    });

    it('should add item if all slots are taken but some stack can take that item', () => {
        const { players, engineManager } = setupEngine();
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        _.range(0, 16).forEach(() => {
            engineManager.createSystemAction<GenerateItemForCharacterEvent>({
                type: ItemEngineEvents.GenerateItemForCharacter,
                characterId: players['1'].characterId,
                itemTemplateId: '3',
                amount: 19,
            });
        });

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '3',
            amount: 5,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                playerCharacter_1: {
                    '1': {
                        '15': {
                            amount: 9,
                        },
                    },
                },
            },
        });
    });

    it('Item should be placed in first empty spot', () => {
        const { players, engineManager } = setupEngine();
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '1',
            amount: 1,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        let itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ItemClientActions.MoveItemInBag,
            itemId,
            directionLocation: {
                backpack: '1',
                spot: '2',
            },
        });

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '1',
            amount: 1,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                playerCharacter_1: {
                    '1': {
                        '0': {
                            amount: 1,
                            itemId: 'ItemInstance_1',
                            itemTemplateId: "1",
                        },
                    },
                },
            },
        });
    });

    it('if item does not have stack, then is should be treated as stack size one, and each item should be created as a separate one', () => {
        const { players, engineManager } = setupEngine();
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '1',
            amount: 2,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                playerCharacter_1: {
                    '1': {
                        '0': {
                            itemId: 'ItemInstance_0',
                            amount: 1,
                            itemTemplateId: "1",
                        },
                        '1': {
                            itemId: 'ItemInstance_1',
                            amount: 1,
                            itemTemplateId: "1",
                        },
                    },
                },
            },
        });
    });

    it('if item has a stack size smaller then requested amount, then more item stacks should be generated', () => {
        const { players, engineManager } = setupEngine();
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '3',
            amount: 35,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                playerCharacter_1: {
                    '1': {
                        '0': {
                            itemId: 'ItemInstance_0',
                            amount: 20,
                            itemTemplateId: "3",
                        },
                        '1': {
                            itemId: 'ItemInstance_1',
                            amount: 15,
                            itemTemplateId: "3",
                        },
                    },
                },
            },
        });
    });

    it('If there are some not full stacks, first newly generated item should be added to them. and then all remaining items should take first empty space', () => {
        const { players, engineManager } = setupEngine();
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '3',
            amount: 20,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        let itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ItemClientActions.SplitItemStackInBag,
            itemId,
            amount: 5,
            directionLocation: { backpack: '1', spot: '3' },
        });

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ItemClientActions.SplitItemStackInBag,
            itemId,
            amount: 5,
            directionLocation: { backpack: '1', spot: '5' },
        });

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ItemClientActions.SplitItemStackInBag,
            itemId,
            amount: 5,
            directionLocation: { backpack: '1', spot: '6' },
        });

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '3',
            amount: 65,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                playerCharacter_1: {
                    '1': {
                        '0': {
                            amount: 20,
                        },
                        '1': {
                            itemId: 'ItemInstance_7',
                            amount: 5,
                            itemTemplateId: "3",
                        },
                        '3': {
                            amount: 20,
                        },
                        '5': {
                            amount: 20,
                        },
                        '6': {
                            amount: 20,
                        },
                    },
                },
            },
        });
    });

    it('If there is not full stack of items, and then new stack is generated but with different template id, tehn is should take different spot in bag', () => {
        const { players, engineManager } = setupEngine();
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '3',
            amount: 5,
        });

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '4',
            amount: 5,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                playerCharacter_1: {
                    '1': {
                        '1': {
                            itemId: 'ItemInstance_1',
                            amount: 5,
                            itemTemplateId: "4",
                        },
                    },
                },
            },
        });
    });

    it('Item should be placed in second bag if the first one is already full', () => { });
});

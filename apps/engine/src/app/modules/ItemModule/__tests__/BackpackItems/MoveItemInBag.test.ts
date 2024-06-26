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

describe('MoveItemInBag', () => {
    it('Player should be able to move his item', () => {
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

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ItemClientActions.MoveItemInBag,
            itemId,
            directionLocation: {
                backpack: '1',
                spot: '2',
            },
        });

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                [players['1'].characterId]: {
                    '1': {
                        '2': {
                            amount: 1,
                            itemId: 'ItemInstance_0',
                            itemTemplateId: "1",
                        },
                    },
                },
            },
            toDelete: {
                [players['1'].characterId]: {
                    '1': { '0': null },
                },
            },
        });
    });

    it('Player should get an error if it is trying to move item to spot that does not exist', () => {
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

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ItemClientActions.MoveItemInBag,
            itemId,
            directionLocation: {
                backpack: '1',
                spot: '16',
            },
        });

        checkIfErrorWasHandled(CURRENT_MODULE, 'Invalid backpack location.', dataPackage);
    });

    it('Player should get an error if it is trying to move item to bag that does not exist', () => {
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

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ItemClientActions.MoveItemInBag,
            itemId,
            directionLocation: {
                backpack: '2',
                spot: '1',
            },
        });

        checkIfErrorWasHandled(CURRENT_MODULE, 'Invalid backpack location.', dataPackage);
    });

    it('If player will move item to a place in a bag which is already taken by other item, then their places should be switched', () => {
        const { players, engineManager } = setupEngine();
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '1',
            amount: 1,
        });
        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '2',
            amount: 1,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['1'].itemId;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ItemClientActions.MoveItemInBag,
            itemId,
            directionLocation: {
                backpack: '1',
                spot: '0',
            },
        });

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                [players['1'].characterId]: {
                    '1': {
                        '0': {
                            amount: 1,
                            itemId: 'ItemInstance_1',
                            itemTemplateId: "2",
                        },
                        '1': {
                            amount: 1,
                            itemId: 'ItemInstance_0',
                            itemTemplateId: "1",
                        },
                    },
                },
            },
        });
    });

    it('if player moves item to a place taken by item of the same type, but not full stack it should be combined', () => {
        const { players, engineManager } = setupEngine();
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '3',
            amount: 11,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        let itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ItemClientActions.SplitItemStackInBag,
            directionLocation: { backpack: '1', spot: '1' },
            itemId,
            amount: 6,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['1'].itemId;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ItemClientActions.MoveItemInBag,
            itemId,
            directionLocation: {
                backpack: '1',
                spot: '0',
            },
        });

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                [players['1'].characterId]: {
                    '1': {
                        '0': {
                            amount: 11,
                            itemId: 'ItemInstance_0',
                            itemTemplateId: "3",
                        },
                    },
                },
            },
            toDelete: {
                [players['1'].characterId]: {
                    '1': { '1': null },
                },
            },
        });
    });

    it('if player moves item to a place taken by item of the same type, but sum of those is bigger then stackSize, then is should trasfer as much as it can', () => {
        const { players, engineManager } = setupEngine();
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '3',
            amount: 15,
        });
        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '3',
            amount: 13,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['1'].itemId;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ItemClientActions.MoveItemInBag,
            itemId,
            directionLocation: {
                backpack: '1',
                spot: '0',
            },
        });

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                [players['1'].characterId]: {
                    '1': {
                        '0': {
                            amount: 20,
                            itemId: 'ItemInstance_0',
                            itemTemplateId: "3",
                        },
                        '1': {
                            amount: 8,
                            itemId: 'ItemInstance_1',
                            itemTemplateId: "3",
                        },
                    },
                },
            },
        });
    });

    it('if player moves item to a place taken by item of the same type, but stack size is 1 they should be replaced', () => {
        const { players, engineManager } = setupEngine();
        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '1',
        });
        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '1',
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['1'].itemId;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, {
            type: ItemClientActions.MoveItemInBag,
            itemId,
            directionLocation: {
                backpack: '1',
                spot: '0',
            },
        });

        checkIfPackageIsValid(CURRENT_MODULE, dataPackage, {
            data: {
                [players['1'].characterId]: {
                    '1': {
                        '0': {
                            amount: 1,
                            itemId: 'ItemInstance_0',
                            itemTemplateId: "1",
                        },
                        '1': {
                            amount: 1,
                            itemId: 'ItemInstance_1',
                            itemTemplateId: "1",
                        },
                    },
                },
            },
        });
    });
});

import { GlobalStoreModule, ItemClientActions } from '@bananos/types';
import { EngineManager, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { } from '..';
import { MockedItemTemplates } from '../../../mocks';
import { GenerateItemForCharacterEvent, ItemEngineEvents } from '../../ItemModule/Events';
import { ItemTemplateService } from '../../ItemModule/services/ItemTemplateService';
import _ = require('lodash');

const setupEngine = () => {
    const itemTemplateService = new ItemTemplateService();
    (itemTemplateService.getData as jest.Mock).mockReturnValue(MockedItemTemplates)

    const engineManager = new EngineManager();

    const players = {
        '1': engineManager.preparePlayerWithCharacter({ name: 'character_1' }),
    };

    return { engineManager, players };
};

describe('Attributes', () => {
    it('Player should be notified about his character attributes', () => {
        const { engineManager, players } = setupEngine();

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.ATTRIBUTES, dataPackage, {
            data: {
                playerCharacter_1: {
                    agility: 20,
                    armor: 0,
                    intelect: 20,
                    spirit: 20,
                    stamina: 20,
                    strength: 20,
                },
            },
        });
    });

    it('Attributes should be updated when character equipes item', () => {
        const { players, engineManager } = setupEngine();

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '7',
            amount: 1,
        });

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const itemId = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientActions.EquipItem, itemInstanceId: itemId });

        checkIfPackageIsValid(GlobalStoreModule.ATTRIBUTES, dataPackage, {
            data: {
                playerCharacter_1: {
                    agility: 20,
                    armor: 49,
                    intelect: 20,
                    spirit: 20,
                    stamina: 22,
                    strength: 23,
                },
            },
        });
    });

    it('Attributes should be combined when character equipes two items', () => {
        const { players, engineManager } = setupEngine();

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '7',
            amount: 1,
        });

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const itemId1 = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientActions.EquipItem, itemInstanceId: itemId1 });

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '8',
            amount: 1,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const itemId2 = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientActions.EquipItem, itemInstanceId: itemId2 });

        checkIfPackageIsValid(GlobalStoreModule.ATTRIBUTES, dataPackage, {
            data: {
                playerCharacter_1: {
                    agility: 22,
                    armor: 49,
                    intelect: 20,
                    spirit: 20,
                    stamina: 23,
                    strength: 23,
                },
            },
        });
    });

    it('Attributes should not be added when item is replaced', () => {
        const { players, engineManager } = setupEngine();

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '7',
            amount: 1,
        });

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const itemId1 = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientActions.EquipItem, itemInstanceId: itemId1 });

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '7',
            amount: 1,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const itemId2 = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientActions.EquipItem, itemInstanceId: itemId2 });

        checkIfPackageIsValid(GlobalStoreModule.ATTRIBUTES, dataPackage, {
            data: {
                playerCharacter_1: {
                    agility: 20,
                    armor: 49,
                    intelect: 20,
                    spirit: 20,
                    stamina: 22,
                    strength: 23,
                },
            },
        });
    });

    it('Attributes should not be recalculated when item is stripped', () => {
        const { players, engineManager } = setupEngine();

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '7',
            amount: 1,
        });

        let dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const itemId1 = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientActions.EquipItem, itemInstanceId: itemId1 });

        engineManager.createSystemAction<GenerateItemForCharacterEvent>({
            type: ItemEngineEvents.GenerateItemForCharacter,
            characterId: players['1'].characterId,
            itemTemplateId: '8',
            amount: 1,
        });

        dataPackage = engineManager.getLatestPlayerDataPackage(players['1'].socketId);
        const itemId2 = dataPackage.backpackItems.data[players['1'].characterId]['1']['0'].itemId;

        dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientActions.EquipItem, itemInstanceId: itemId2 });
        dataPackage = engineManager.callPlayerAction(players['1'].socketId, { type: ItemClientActions.StripItem, itemInstanceId: itemId1 });

        checkIfPackageIsValid(GlobalStoreModule.ATTRIBUTES, dataPackage, {
            data: {
                playerCharacter_1: {
                    agility: 22,
                    armor: 0,
                    intelect: 20,
                    spirit: 20,
                    stamina: 21,
                    strength: 20,
                },
            },
        });
    });
});

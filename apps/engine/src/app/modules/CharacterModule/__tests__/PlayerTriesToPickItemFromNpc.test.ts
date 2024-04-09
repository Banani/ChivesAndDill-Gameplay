import { GlobalStoreModule, RecursivePartial } from '@bananos/types';
import { EngineManager, checkIfErrorWasHandled, checkIfPackageIsValid } from 'apps/engine/src/app/testUtilities';
import { WalkingType } from 'apps/engine/src/app/types/CharacterRespawn';
import { } from '..';
import { MockedItemTemplates, MockedMonsterTemplates } from "../../../mocks";
import { RandomGeneratorService } from '../../../services/RandomGeneratorService';
import { ItemTemplateService } from '../../ItemModule/services/ItemTemplateService';
import { MonsterEngineEvents, MonsterRespawnsUpdatedEvent } from '../../MonsterModule/Events';
import { MonsterTemplate } from '../../MonsterModule/MonsterTemplates';
import { MonsterRespawnTemplateService, MonsterTemplateService } from '../../MonsterModule/services';
import { getDroppedItemIds, getNewestCorpseId, killAnyMonster, openAnyCorpse, pickOneItemFromCorpse } from '../testUtilities/Corpse';
import _ = require('lodash');

const setupEngine = (monsterTemplates: Record<string, RecursivePartial<MonsterTemplate>> = {}) => {
    const itemTemplateService = new ItemTemplateService();
    (itemTemplateService.getData as jest.Mock).mockReturnValue(MockedItemTemplates)

    const monsterTemplateService = new MonsterTemplateService();
    (monsterTemplateService.getData as jest.Mock).mockReturnValue(_.merge({}, MockedMonsterTemplates, monsterTemplates))

    const respawnService = new MonsterRespawnTemplateService();
    (respawnService.getData as jest.Mock).mockReturnValue(
        {
            'respawn_1': {
                id: 'respawn_1',
                location: { x: 150, y: 100 },
                templateId: "1",
                time: 4000,
                walkingType: WalkingType.None,
            },
        }
    );

    const randomGeneratorService = new RandomGeneratorService();
    (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0.64);

    const engineManager = new EngineManager();

    const players = {
        '1': engineManager.preparePlayerWithCharacter({ name: 'character_1' }),
        '2': engineManager.preparePlayerWithCharacter({ name: 'character_2' }),
        '3': engineManager.preparePlayerWithCharacter({ name: 'character_3' }),
    };

    engineManager.createSystemAction<MonsterRespawnsUpdatedEvent>({
        type: MonsterEngineEvents.MonsterRespawnsUpdated,
        respawnIds: ['respawn_1']
    });

    return { engineManager, players, randomGeneratorService };
};

describe('PlayerTriesToPickItemFromNpc', () => {
    it('Player should get item when he is picking it up', () => {
        const { engineManager, randomGeneratorService } = setupEngine();
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0);

        killAnyMonster(engineManager, '1');
        const { corpseId } = openAnyCorpse({ engineManager, playerId: '1' });
        const { dataPackage } = pickOneItemFromCorpse({ engineManager, playerId: '1', corpseId });

        checkIfPackageIsValid(GlobalStoreModule.BACKPACK_ITEMS, dataPackage, {
            data: {
                playerCharacter_1: {
                    '1': {
                        '0': {
                            amount: 1,
                            itemId: 'ItemInstance_0',
                            itemTemplateId: '1'
                        },
                    },
                },
            },
        });
    });

    it('Player should get error if itemId does not exist', () => {
        const { engineManager, randomGeneratorService } = setupEngine();
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0);

        killAnyMonster(engineManager, '1');
        const { corpseId } = openAnyCorpse({ engineManager, playerId: '1' });
        const { dataPackage } = pickOneItemFromCorpse({ engineManager, playerId: '1', corpseId, itemId: "Some_random_id" });

        checkIfErrorWasHandled(GlobalStoreModule.BACKPACK_ITEMS, 'This item is already taken.', dataPackage);
    });

    it('Player should get error if item is already taken', () => {
        const { engineManager, randomGeneratorService } = setupEngine();
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0);

        killAnyMonster(engineManager, '1');
        const { corpseId } = openAnyCorpse({ engineManager, playerId: '1' });
        const [itemId] = getDroppedItemIds(engineManager, '1', corpseId);
        pickOneItemFromCorpse({ engineManager, playerId: '1', corpseId, itemId });
        const { dataPackage } = pickOneItemFromCorpse({ engineManager, playerId: '1', corpseId, itemId });

        checkIfErrorWasHandled(GlobalStoreModule.BACKPACK_ITEMS, 'This item is already taken.', dataPackage);
    });

    it('Player should get error if tries to pick item from corpse that is not opened by him', () => {
        const { engineManager, randomGeneratorService } = setupEngine();
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0);

        killAnyMonster(engineManager, '1');
        const { corpseId } = openAnyCorpse({ engineManager, playerId: '1' });
        const [itemId] = getDroppedItemIds(engineManager, '1', corpseId);
        const { dataPackage } = pickOneItemFromCorpse({ engineManager, playerId: '2', corpseId, itemId });

        checkIfErrorWasHandled(GlobalStoreModule.BACKPACK_ITEMS, 'You cannot take item from corpse that is not opened by you.', dataPackage);
    });

    it('Player should get information that this item is no longer available', () => {
        const { engineManager, randomGeneratorService } = setupEngine();
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0);

        killAnyMonster(engineManager, '1');
        const { corpseId } = openAnyCorpse({ engineManager, playerId: '1' });
        const { dataPackage } = pickOneItemFromCorpse({ engineManager, playerId: '1', corpseId });

        checkIfPackageIsValid(GlobalStoreModule.ACTIVE_LOOT, dataPackage, {
            toDelete: {
                monster_0: {
                    items: {
                        corpseItemId_1: null,
                    },
                },
            },
        });
    });

    it('Other players should also get information that this item is no longer available', () => {
        const { engineManager, players, randomGeneratorService } = setupEngine();
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0);

        killAnyMonster(engineManager, '1');
        const corpseId = getNewestCorpseId(engineManager, '1')

        openAnyCorpse({ engineManager, playerId: '1', corpseId });
        openAnyCorpse({ engineManager, playerId: '2', corpseId });

        const [itemId] = getDroppedItemIds(engineManager, '2', corpseId);
        pickOneItemFromCorpse({ engineManager, playerId: '1', corpseId, itemId });

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.ACTIVE_LOOT, dataPackage, {
            toDelete: {
                monster_0: {
                    items: {
                        corpseItemId_1: null,
                    },
                },
            },
        });
    });

    it('Players that do not have corpse opened should not get update about corpse state', () => {
        const { engineManager, players, randomGeneratorService } = setupEngine();
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0);

        killAnyMonster(engineManager, '1');
        const corpseId = getNewestCorpseId(engineManager, '1')

        openAnyCorpse({ engineManager, playerId: '1', corpseId });
        const [itemId] = getDroppedItemIds(engineManager, '1', corpseId);
        pickOneItemFromCorpse({ engineManager, playerId: '1', corpseId, itemId });

        const dataPackage = engineManager.getLatestPlayerDataPackage(players['2'].socketId);

        checkIfPackageIsValid(GlobalStoreModule.ACTIVE_LOOT, dataPackage, undefined);
    });

    it('Players should have items deleted when all items were collected', () => {
        const { engineManager, randomGeneratorService } = setupEngine();
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0.2);

        killAnyMonster(engineManager, '1');
        const corpseId = getNewestCorpseId(engineManager, '1')

        openAnyCorpse({ engineManager, playerId: '1', corpseId });
        const [itemId1, itemId2] = getDroppedItemIds(engineManager, '1', corpseId);
        pickOneItemFromCorpse({ engineManager, playerId: '1', corpseId, itemId: itemId1 });
        const { dataPackage } = pickOneItemFromCorpse({ engineManager, playerId: '1', corpseId, itemId: itemId2 });

        checkIfPackageIsValid(GlobalStoreModule.ACTIVE_LOOT, dataPackage, { toDelete: { monster_0: { items: null } } });
    });

    it('Players should get error message if tries to pick up the item when the backpack is full', () => {
        const { engineManager, randomGeneratorService } = setupEngine({
            '1': {
                dropSchema: {
                    items: {
                        '1': {
                            itemTemplateId: '1',
                            dropChance: 1,
                            maxAmount: 21,
                            minAmount: 21,
                        },
                    }
                }
            }
        });
        (randomGeneratorService.generateNumber as jest.Mock).mockReturnValue(0.2);

        killAnyMonster(engineManager, '1');
        const corpseId = getNewestCorpseId(engineManager, '1')

        openAnyCorpse({ engineManager, playerId: '1', corpseId });
        const itemIds = getDroppedItemIds(engineManager, '1', corpseId);

        let dataPackage;
        _.forEach(itemIds, itemId => {
            dataPackage = pickOneItemFromCorpse({ engineManager, playerId: '1', corpseId, itemId }).dataPackage;
        })

        checkIfPackageIsValid(GlobalStoreModule.ACTIVE_LOOT, dataPackage, undefined, true);
        checkIfErrorWasHandled(GlobalStoreModule.BACKPACK_ITEMS, 'Your backpack is full.', dataPackage);
    });

    it('Players should get error if tries to open corpse which does not exist', () => {
        const { engineManager } = setupEngine();

        const { dataPackage } = openAnyCorpse({ engineManager, playerId: '1', corpseId: "Some_random_id" });

        checkIfErrorWasHandled(GlobalStoreModule.BACKPACK_ITEMS, 'This corpse does not exist.', dataPackage);
    });
});
